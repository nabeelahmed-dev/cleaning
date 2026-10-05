"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { reviews } from "@/lib/site";

const AUTO_SPEED = 7; // degrees per second while idle
const DRAG_SPEED = 0.28; // degrees per pixel dragged

// Reviews arranged around a 3D ring: it turns slowly on its own, can be
// dragged to spin, and the arrows step one review at a time.
export function ReviewRing() {
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  // Set by the animation setup so the arrow buttons can step the ring.
  const stepBy = useRef<(direction: number) => void>(() => {});

  useGSAP(
    () => {
      const stageEl = stage.current;
      const ringEl = ring.current;
      if (!stageEl || !ringEl) return;

      const cards = gsap.utils.toArray<HTMLElement>(".review-card", ringEl);
      const step = 360 / cards.length;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const motion = { angle: 0, velocity: 0 };
      let radius = 0;
      let hovering = false;
      let dragging = false;
      let stepping = false;
      let lastX = 0;
      let lastTime = 0;

      const layout = () => {
        // Radius that makes the cards meet edge to edge, plus a small gap.
        radius = Math.round(cards[0].offsetWidth / 2 / Math.tan(Math.PI / cards.length)) + 30;
        cards.forEach((card, i) => {
          card.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
        });
        render();
      };

      const render = () => {
        ringEl.style.transform = `translateZ(${-radius}px) rotateY(${motion.angle}deg)`;
        cards.forEach((card, i) => {
          // 1 when the card faces the viewer, 0 side-on, negative when facing away.
          const facing = Math.cos(((i * step + motion.angle) * Math.PI) / 180);
          const visible = gsap.utils.clamp(0, 1, (facing + 0.1) / 0.7);
          card.style.opacity = visible.toFixed(3);
          card.style.pointerEvents = facing > 0.8 ? "auto" : "none";
        });
      };

      const tick = (_time: number, deltaMs: number) => {
        const delta = Math.min(deltaMs, 50) / 1000;
        if (!dragging && !stepping) {
          if (!hovering && !reduce) motion.angle -= AUTO_SPEED * delta;
          // Spin left over from a drag or the entrance, fading out.
          motion.angle += motion.velocity * delta;
          motion.velocity *= Math.pow(0.04, delta);
        }
        render();
      };

      stepBy.current = (direction) => {
        const target = (Math.round(motion.angle / step) - direction) * step;
        motion.velocity = 0;
        stepping = true;
        gsap.to(motion, {
          angle: target,
          duration: reduce ? 0 : 0.9,
          ease: "power3.out",
          overwrite: true,
          onComplete: () => {
            stepping = false;
          },
        });
      };

      const onPointerDown = (event: PointerEvent) => {
        if ((event.target as Element).closest("button")) return;
        dragging = true;
        motion.velocity = 0;
        gsap.killTweensOf(motion);
        stepping = false;
        lastX = event.clientX;
        lastTime = event.timeStamp;
        stageEl.setPointerCapture(event.pointerId);
      };
      const onPointerMove = (event: PointerEvent) => {
        if (!dragging) return;
        const moved = (event.clientX - lastX) * DRAG_SPEED;
        const elapsed = Math.max(event.timeStamp - lastTime, 1) / 1000;
        motion.angle += moved;
        // Keep some of the throw so the ring coasts after release.
        motion.velocity = gsap.utils.clamp(-400, 400, moved / elapsed);
        lastX = event.clientX;
        lastTime = event.timeStamp;
      };
      const onPointerUp = () => {
        dragging = false;
      };
      const onEnter = (event: PointerEvent) => {
        if (event.pointerType === "mouse") hovering = true;
      };
      const onLeave = () => {
        hovering = false;
      };

      layout();
      const resizeObserver = new ResizeObserver(layout);
      resizeObserver.observe(cards[0]);
      gsap.ticker.add(tick);
      stageEl.addEventListener("pointerdown", onPointerDown);
      stageEl.addEventListener("pointermove", onPointerMove);
      stageEl.addEventListener("pointerup", onPointerUp);
      stageEl.addEventListener("pointercancel", onPointerUp);
      stageEl.addEventListener("pointerenter", onEnter);
      stageEl.addEventListener("pointerleave", onLeave);

      // Entrance: the ring spins in as the section scrolls into view.
      if (!reduce) {
        ScrollTrigger.create({
          trigger: stageEl,
          start: "top 80%",
          once: true,
          onEnter: () => {
            motion.velocity = -260;
          },
        });
      }

      return () => {
        gsap.ticker.remove(tick);
        resizeObserver.disconnect();
        stageEl.removeEventListener("pointerdown", onPointerDown);
        stageEl.removeEventListener("pointermove", onPointerMove);
        stageEl.removeEventListener("pointerup", onPointerUp);
        stageEl.removeEventListener("pointercancel", onPointerUp);
        stageEl.removeEventListener("pointerenter", onEnter);
        stageEl.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: stage },
  );

  return (
    <div data-reveal className="mt-14">
      <div
        ref={stage}
        className="cursor-grab touch-pan-y select-none py-10 [perspective:1400px] active:cursor-grabbing"
      >
        <div
          ref={ring}
          className="relative mx-auto h-[17rem] w-[min(22rem,76vw)] [transform-style:preserve-3d] sm:h-[15.5rem] sm:w-[24rem]"
        >
          {reviews.map((review) => (
            <figure
              key={review.name}
              className="review-card absolute inset-0 flex flex-col rounded-3xl border border-azure/10 bg-white p-7 shadow-[0_30px_60px_-35px_rgb(10_52_194/0.7)] [backface-visibility:hidden]"
            >
              <div className="flex gap-1" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, star) => (
                  <Star key={star} className="h-4 w-4 fill-azure text-azure" />
                ))}
              </div>
              <blockquote className="mt-5 text-base leading-relaxed text-ink/80">
                “{review.text}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-azure to-ice text-sm font-semibold text-white">
                  {review.name[0]}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{review.name}</span>
                  <span className="block text-xs text-ink/55">{review.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        {[
          { label: "Previous review", direction: -1, Icon: ArrowLeft },
          { label: "Next review", direction: 1, Icon: ArrowRight },
        ].map(({ label, direction, Icon }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            onClick={() => stepBy.current(direction)}
            className="grid h-12 w-12 place-items-center rounded-full border border-azure/20 text-azure transition-colors duration-300 hover:bg-azure hover:text-white"
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
        <span className="ml-2 text-xs font-medium text-ink/50">Drag to spin</span>
      </div>
    </div>
  );
}
