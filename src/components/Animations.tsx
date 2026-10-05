"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// One motion language for every scroll reveal: a short rise with a soft fade.
const RISE = 24;
const reveal = { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out" };

// Page-wide scroll animations, driven by data attributes so the sections
// themselves can stay server components:
//   data-reveal            fade/rise the element in
//   data-stagger           fade/rise its direct children in, one after another
//   data-stagger="flip"    same, but the children swing up in 3D
//   data-tilt="10"         3D card: tilts up to that many degrees toward the pointer
//   data-count="5000"      count up to the number (data-decimals optional)
//   data-parallax="-60"    move by that many px while crossing the viewport
export function Animations() {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Smooth, inertial scrolling driven by GSAP's ticker so scrubbed
    // animations and the scroll position stay on the same frame.
    const lenis = new Lenis({ duration: 1.15 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    // In-page links glide to their section instead of the browser's instant
    // jump (which would fight the smooth scroll for a frame).
    const onAnchorClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const target = link && document.querySelector<HTMLElement>(link.hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -72, duration: 1.4 });
    };
    document.addEventListener("click", onAnchorClick);

    // Elements that enter together are revealed as one staggered batch.
    gsap.set("[data-reveal]", { y: RISE });
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 88%",
      once: true,
      onEnter: (elements) => gsap.to(elements, { ...reveal, stagger: 0.12 }),
    });

    gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
      const flip = group.dataset.stagger === "flip";
      gsap.set(
        group.children,
        flip
          ? { y: 48, rotationX: -32, transformPerspective: 900, transformOrigin: "50% 0%" }
          : { y: RISE },
      );
      ScrollTrigger.create({
        trigger: group,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(group.children, {
            ...reveal,
            rotationX: 0,
            duration: flip ? 1.3 : reveal.duration,
            stagger: flip ? 0.12 : 0.09,
            // Once flat, pivot from the centre so the pointer tilt feels balanced.
            onComplete: () => gsap.set(group.children, { transformOrigin: "50% 50%" }),
          }),
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
      const target = Number(element.dataset.count);
      const decimals = Number(element.dataset.decimals ?? 0);
      const counter = { value: 0 };
      const format = (value: number) =>
        value.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      element.textContent = format(0);
      ScrollTrigger.create({
        // Start with the group the number is revealed in, so no stat sits at 0.
        trigger: element.closest("[data-stagger]") ?? element,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(counter, {
            value: target,
            duration: 1.8,
            delay: 0.2,
            ease: "power3.out",
            onUpdate: () => {
              element.textContent = format(counter.value);
            },
          }),
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
      gsap.to(element, {
        y: Number(element.dataset.parallax),
        ease: "none",
        scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // Pointer effects (3D cards and bubble fields).
    // Only for devices with a real hover pointer.
    const pointerCleanups: (() => void)[] = [];
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((card) => {
        const max = Number(card.dataset.tilt);
        gsap.set(card, { transformPerspective: 900 });
        const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
        const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
        const onMove = (event: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width;
          const y = (event.clientY - rect.top) / rect.height;
          rotateY((x - 0.5) * 2 * max);
          rotateX((0.5 - y) * 2 * max);
          card.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
          card.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
        };
        const onLeave = () => {
          rotateX(0);
          rotateY(0);
        };
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        pointerCleanups.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
      });

      // Pointer fields: bubbles drift toward the cursor by their depth, and one
      // bubble trails the cursor itself.
      gsap.utils.toArray<HTMLElement>("[data-pointer-field]").forEach((field) => {
        const drifters = gsap.utils.toArray<HTMLElement>("[data-depth]", field).map((element) => ({
          depth: Number(element.dataset.depth),
          x: gsap.quickTo(element, "x", { duration: 1.2, ease: "power3.out" }),
          y: gsap.quickTo(element, "y", { duration: 1.2, ease: "power3.out" }),
        }));
        const follower = field.querySelector<HTMLElement>("[data-cursor-bubble]");
        const followX = follower && gsap.quickTo(follower, "x", { duration: 0.7, ease: "power3.out" });
        const followY = follower && gsap.quickTo(follower, "y", { duration: 0.7, ease: "power3.out" });

        const onMove = (event: PointerEvent) => {
          const rect = field.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          // -1 … 1 from the centre of the section
          const nx = (x / rect.width - 0.5) * 2;
          const ny = (y / rect.height - 0.5) * 2;
          drifters.forEach((drifter) => {
            drifter.x(nx * drifter.depth);
            drifter.y(ny * drifter.depth);
          });
          if (follower) {
            followX?.(x - follower.offsetWidth / 2);
            followY?.(y - follower.offsetHeight / 2);
          }
        };
        const onEnter = (event: PointerEvent) => {
          if (!follower) return;
          // Start at the cursor rather than gliding in from the corner.
          const rect = field.getBoundingClientRect();
          gsap.set(follower, {
            x: event.clientX - rect.left - follower.offsetWidth / 2,
            y: event.clientY - rect.top - follower.offsetHeight / 2,
          });
          gsap.to(follower, { opacity: 0.9, scale: 1, duration: 0.5, ease: "power2.out" });
        };
        const onLeave = () => {
          drifters.forEach((drifter) => {
            drifter.x(0);
            drifter.y(0);
          });
          if (follower) gsap.to(follower, { opacity: 0, scale: 0.4, duration: 0.5, ease: "power2.in" });
        };
        field.addEventListener("pointerenter", onEnter);
        field.addEventListener("pointermove", onMove);
        field.addEventListener("pointerleave", onLeave);
        pointerCleanups.push(() => {
          field.removeEventListener("pointerenter", onEnter);
          field.removeEventListener("pointermove", onMove);
          field.removeEventListener("pointerleave", onLeave);
        });
      });
    }

    return () => {
      pointerCleanups.forEach((cleanup) => cleanup());
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  });

  return null;
}
