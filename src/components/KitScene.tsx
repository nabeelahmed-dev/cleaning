"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

type Explode = { current: number };
type LabelRefs = { current: (HTMLDivElement | null)[] };

// Label text in order (01 – 04); each follows an anchor point on its tool.
const LABELS = ["Squeegee", "Eco spray", "Microfibre cloths", "Sponge & pads"];
const pointer = { x: 0, y: 0 };

const NAVY = "#0b2a8f";
const AZURE = "#1a5cff";
const SUN = "#ffd23f";

// Soap-bubble shader: transparent centre, bright iridescent rim, one highlight.
const bubbleVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const bubbleFragment = /* glsl */ `
  uniform float uSeed;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float fresnel = pow(1.0 - clamp(dot(vNormal, vView), 0.0, 1.0), 2.4);
    vec3 film = 0.5 + 0.5 * cos(6.2831 * (fresnel * 1.4 + uSeed) + vec3(0.0, 2.1, 4.2));
    vec3 color = mix(vec3(0.8, 0.92, 1.0), film, 0.3) + fresnel * 0.6;
    float spec = pow(max(dot(reflect(-normalize(vec3(-0.5, 0.7, 0.6)), vNormal), vView), 0.0), 60.0);
    gl_FragColor = vec4(color + spec, fresnel * 0.85 + 0.05 + spec);
  }
`;

// Bubbles rise out of the bucket and loop back to the waterline.
function Bubbles() {
  const group = useRef<THREE.Group>(null);
  const bubbles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        x: Math.sin(i * 2.4) * 0.75,
        z: Math.cos(i * 1.7) * 0.6,
        size: 0.05 + ((i * 37) % 10) / 90,
        speed: 0.16 + ((i * 13) % 7) / 40,
        phase: i * 0.83,
        material: new THREE.ShaderMaterial({
          vertexShader: bubbleVertex,
          fragmentShader: bubbleFragment,
          uniforms: { uSeed: { value: i * 0.37 } },
          transparent: true,
          depthWrite: false,
        }),
      })),
    [],
  );
  useEffect(() => () => bubbles.forEach((bubble) => bubble.material.dispose()), [bubbles]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    group.current?.children.forEach((mesh, i) => {
      const bubble = bubbles[i];
      const rise = (time * bubble.speed + bubble.phase) % 1;
      mesh.position.set(
        bubble.x + Math.sin(time * 0.8 + bubble.phase) * 0.12,
        0.5 + rise * 3.2,
        bubble.z,
      );
      // Grow out of the water, then shrink away at the top.
      mesh.scale.setScalar(bubble.size * Math.sin(rise * Math.PI) * 2);
    });
  });

  return (
    <group ref={group}>
      {bubbles.map((bubble, i) => (
        <mesh key={i} material={bubble.material}>
          <sphereGeometry args={[1, 32, 32]} />
        </mesh>
      ))}
    </group>
  );
}

function Kit({ explode, labels }: { explode: Explode; labels: LabelRefs }) {
  const root = useRef<THREE.Group>(null);
  const bucket = useRef<THREE.Group>(null);
  const squeegee = useRef<THREE.Group>(null);
  const spray = useRef<THREE.Group>(null);
  const cloths = useRef<THREE.Group>(null);
  const sponge = useRef<THREE.Group>(null);
  const anchors = useRef<(THREE.Object3D | null)[]>([]);
  const projected = useMemo(() => new THREE.Vector3(), []);
  // Per-frame animation state: eased explode, turntable angle, the angle it
  // comes to rest at while unpacking, and the eased pointer tilt.
  const anim = useRef({ e: 0, spin: 0, rest: null as number | null, tiltX: 0.32, tiltY: -0.45 });
  const aspect = useThree((state) => state.viewport.aspect);
  // On portrait screens the kit sits below the copy and is drawn smaller.
  const narrow = aspect < 1;
  // Portrait screens have less width to fan the tools out into.
  const spread = narrow ? 0.5 : 1;

  useFrame((state, rawDelta) => {
    // Cap the step so a dropped frame can't make anything lurch.
    const delta = Math.min(rawDelta, 0.05);
    const time = state.clock.elapsedTime;
    const motion = anim.current;

    // Ease toward the scroll position instead of snapping to it.
    motion.e = THREE.MathUtils.damp(motion.e, explode.current, 5, delta);
    const e = motion.e;
    // Each tool leaves the bucket a beat after the previous one.
    const stage = (index: number) =>
      THREE.MathUtils.smootherstep(THREE.MathUtils.clamp((e - index * 0.07) / 0.79, 0, 1), 0, 1);
    const [s1, s2, s3, s4] = [stage(0), stage(1), stage(2), stage(3)];

    // Turntable: the packed kit rotates slowly, then glides round to face
    // front as it unpacks so the labels land in the same place every time.
    const TURN = Math.PI * 2;
    if (e < 0.002) motion.rest = null;
    else if (motion.rest === null) motion.rest = Math.ceil(motion.spin / TURN) * TURN;
    motion.spin += delta * 0.45 * (1 - e) * (1 - e);
    if (motion.rest !== null) motion.spin = Math.min(motion.spin, motion.rest);
    const settle = THREE.MathUtils.smootherstep(e, 0, 0.6);
    const turn = motion.rest === null ? motion.spin : motion.spin + (motion.rest - motion.spin) * settle;

    bucket.current?.position.set(0, -e * 0.55, 0);
    if (squeegee.current) {
      squeegee.current.position.set(-0.3 - s1 * 1.45 * spread, 0.95 + s1 * 0.45, -0.25 + s1 * 0.5);
      squeegee.current.rotation.set(0, s1 * 0.4, 0.22 + s1 * 0.4);
    }
    if (spray.current) {
      spray.current.position.set(0.42 + s2 * 1.55 * spread, 0.8 + s2 * 0.55, 0.0 + s2 * 0.5);
      spray.current.rotation.set(0, -s2 * 0.6, -0.12 - s2 * 0.1);
    }
    if (cloths.current) {
      cloths.current.position.set(-0.5 - s3 * (narrow ? 0.25 : 1.25), 0.84 - s3 * 0.55, 0.78 + s3 * 0.9);
      cloths.current.rotation.set(0.5 - s3 * 0.3, 0.3 + s3 * 0.5, 0.2 - s3 * 0.2);
    }
    if (sponge.current) {
      sponge.current.position.set(0.5 + s4 * 1.2 * spread, 0.52 - s4 * 0.35, 0.45 + s4 * 1.1);
      sponge.current.rotation.set(0.15 + s4 * 0.5, 0.4 + s4 * 0.9, 0.1);
    }
    if (root.current) {
      // Pointer tilt is eased on its own so it never fights the turntable.
      motion.tiltY = THREE.MathUtils.damp(motion.tiltY, -0.45 + pointer.x * 0.3 - e * 0.25, 3, delta);
      motion.tiltX = THREE.MathUtils.damp(motion.tiltX, 0.32 - pointer.y * 0.15 - e * 0.1, 3, delta);
      root.current.rotation.set(motion.tiltX, motion.tiltY + turn, 0);
      root.current.position.y = (narrow ? -1.9 : -0.7) - e * 0.25 + Math.sin(time * 0.8) * 0.05;
    }
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 7.2 + e * 2.2, 4, delta);

    // Pin each HTML label to its anchor's position on screen.
    anchors.current.forEach((anchor, i) => {
      const label = labels.current[i];
      if (!anchor || !label) return;
      anchor.getWorldPosition(projected).project(state.camera);
      const x = (projected.x * 0.5 + 0.5) * state.size.width;
      const y = (-projected.y * 0.5 + 0.5) * state.size.height;
      label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    });
  });

  const plastic = { roughness: 0.25, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.15 };

  return (
    <group ref={root} scale={narrow ? 0.62 : 1}>
      <group ref={bucket}>
        <mesh>
          <cylinderGeometry args={[1.05, 0.8, 1.5, 64, 1, true]} />
          <meshPhysicalMaterial color="#f4f9ff" side={THREE.DoubleSide} {...plastic} />
        </mesh>
        <mesh position={[0, -0.74, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.04, 64]} />
          <meshPhysicalMaterial color="#e3efff" {...plastic} />
        </mesh>
        {/* Rim */}
        <mesh position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.05, 0.055, 16, 72]} />
          <meshPhysicalMaterial color={AZURE} {...plastic} />
        </mesh>
        {/* Handle, folded back against the rim */}
        <mesh position={[0, 0.72, 0]} rotation={[-1.15, 0, 0]}>
          <torusGeometry args={[1.1, 0.03, 12, 48, Math.PI]} />
          <meshStandardMaterial color="#dfe6f0" metalness={1} roughness={0.25} />
        </mesh>
        {/* Soapy water */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.96, 0.96, 0.02, 64]} />
          <meshPhysicalMaterial color="#6fb4ff" roughness={0.05} transparent opacity={0.85} clearcoat={1} />
        </mesh>
        <Bubbles />
      </group>

      <group ref={squeegee}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 1.7, 24]} />
          <meshPhysicalMaterial color={NAVY} {...plastic} />
        </mesh>
        <RoundedBox args={[1.4, 0.14, 0.12]} radius={0.04} position={[0, 0.9, 0]}>
          <meshStandardMaterial color="#dfe6f0" metalness={1} roughness={0.25} />
        </RoundedBox>
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[1.4, 0.1, 0.03]} />
          <meshStandardMaterial color="#12151c" roughness={0.9} />
        </mesh>
        <group ref={(node) => { anchors.current[0] = node; }} position={[0.55, -0.1, 0]} />
      </group>

      <group ref={spray}>
        <RoundedBox args={[0.56, 0.82, 0.38]} radius={0.13} smoothness={4}>
          <meshPhysicalMaterial color="#8cc8ff" roughness={0.08} transparent opacity={0.92} clearcoat={1} />
        </RoundedBox>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.13, 0.2, 24]} />
          <meshPhysicalMaterial color="#f4f9ff" {...plastic} />
        </mesh>
        <RoundedBox args={[0.52, 0.2, 0.24]} radius={0.07} position={[0.1, 0.7, 0]}>
          <meshPhysicalMaterial color={NAVY} {...plastic} />
        </RoundedBox>
        <mesh position={[0.4, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 0.14, 20]} />
          <meshPhysicalMaterial color={SUN} {...plastic} />
        </mesh>
        <mesh position={[0.24, 0.5, 0]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.06, 0.3, 0.1]} />
          <meshPhysicalMaterial color={NAVY} {...plastic} />
        </mesh>
        <group ref={(node) => { anchors.current[1] = node; }} position={[0.1, -0.68, 0]} />
      </group>

      <group ref={cloths}>
        <RoundedBox args={[0.85, 0.08, 0.62]} radius={0.035}>
          <meshStandardMaterial color="#d5ecff" roughness={1} />
        </RoundedBox>
        <RoundedBox args={[0.8, 0.08, 0.58]} radius={0.035} position={[0.03, 0.085, 0.02]} rotation={[0, 0.12, 0]}>
          <meshStandardMaterial color="#9fd0ff" roughness={1} />
        </RoundedBox>
        <group ref={(node) => { anchors.current[2] = node; }} position={[0.4, 0.5, 0]} />
      </group>

      <group ref={sponge}>
        <RoundedBox args={[0.62, 0.26, 0.42]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color={SUN} roughness={0.95} />
        </RoundedBox>
        <RoundedBox args={[0.62, 0.09, 0.42]} radius={0.04} position={[0, 0.17, 0]}>
          <meshStandardMaterial color={AZURE} roughness={1} />
        </RoundedBox>
        <group ref={(node) => { anchors.current[3] = node; }} position={[0, 0.55, 0]} />
      </group>
    </group>
  );
}

export default function KitScene({ explode, active }: { explode: Explode; active: boolean }) {
  const [dpr, setDpr] = useState(1.5);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 7.2], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={active ? "always" : "never"}
        style={{ pointerEvents: "none" }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(window.devicePixelRatio, 1.75))} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 5]} intensity={1.6} />
        {/* Studio lighting from light panels, generated in-scene: nothing to download */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 5, -2]} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={1.8} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[4, 6, 1]} />
          <Lightformer form="rect" intensity={2} color="#9fd8ff" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[2, 6, 1]} />
          <Lightformer form="ring" intensity={1.2} position={[0, 0, 6]} scale={3} />
        </Environment>
        <Kit explode={explode} labels={labels} />
      </Canvas>
      {/* Part labels: fade in with --explode (set on the hero stage) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {LABELS.map((text, i) => (
          <div
            key={text}
            ref={(node) => {
              labels.current[i] = node;
            }}
            className="absolute left-0 top-0 will-change-transform"
          >
            <div
              className="-translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/40 bg-navy/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur"
              style={{ opacity: "var(--explode, 0)" }}
            >
              <span className="text-[#ffd23f]">0{i + 1}</span> {text}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
