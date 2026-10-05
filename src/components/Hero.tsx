"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { hero, heroFeatures, kit } from "@/lib/site";
import { useLazyCanvas } from "@/lib/useLazyCanvas";
import { icons } from "./icons";

const KitScene = dynamic(() => import("./KitScene"), { ssr: false, loading: () => null });

const { lines } = hero;

function Clouds() {
  const cloud = "absolute rounded-full bg-white blur-2xl";
  return (
    <div className="absolute inset-x-0 top-[8%] h-[45%] opacity-70">
      {/* Two identical halves so the drift loops seamlessly. */}
      <div className="flex h-full w-[200%] animate-drift">
        {[0, 1].map((half) => (
          <div key={half} className="relative h-full w-1/2">
            <span className={`${cloud} left-[58%] top-[10%] h-16 w-56 opacity-60`} />
            <span className={`${cloud} left-[66%] top-[18%] h-12 w-40 opacity-50`} />
            <span className={`${cloud} left-[82%] top-[46%] h-20 w-64 opacity-45`} />
            <span className={`${cloud} left-[20%] top-[30%] h-14 w-48 opacity-25`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const explode = useRef(0);
  const { ref: canvasRef, ready, active } = useLazyCanvas<HTMLDivElement>();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // No scroll animation: show the kit already unpacked and labelled.
        explode.current = 0.8;
        stage.current?.style.setProperty("--explode", "1");
        return;
      }

      // Elements with .hero-anim start hidden in CSS; autoAlpha reveals them.
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-eyebrow", { autoAlpha: 0, letterSpacing: "0.1em", duration: 1 }, 0.2)
        .from(".hero-line", { autoAlpha: 0, yPercent: 110, duration: 1, stagger: 0.12 }, 0.3)
        .from(".hero-copy", { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.12 }, 0.75)
        .from(".hero-feature", { autoAlpha: 0, y: 28, duration: 0.7, stagger: 0.1 }, 1.05);

      // Pinned hero: scrolling unpacks the kit and swaps the copy for the kit list.
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            onUpdate: (self) => {
              const e = gsap.utils.clamp(0, 1, (self.progress - 0.1) / 0.45);
              explode.current = e * e * (3 - 2 * e);
              stage.current?.style.setProperty("--explode", explode.current.toFixed(3));
            },
          },
        })
        .to(".hero-intro", { autoAlpha: 0, y: -40, duration: 0.22 }, 0.05)
        .fromTo(".hero-kit", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.22 }, 0.26)
        .from(".hero-kit-item", { opacity: 0, x: -16, stagger: 0.05, duration: 0.18 }, 0.34)
        // Hold the unpacked view for the rest of the pinned scroll.
        .to({}, { duration: 0.33 });
    },
    { scope: ref },
  );

  return (
    <section id="home" ref={ref} className="relative h-[260svh]">
      <div
        ref={stage}
        className="sticky top-0 isolate h-[100svh] overflow-hidden bg-[linear-gradient(115deg,#0a34c2_0%,#1a5cff_38%,#3d8bff_68%,#8ecbff_100%)]"
        style={{ ["--explode" as string]: "0" }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-ice/40 blur-[120px]" />
          <div className="absolute -bottom-52 left-1/3 h-[36rem] w-[36rem] rounded-full bg-sky/40 blur-[130px]" />
          <Clouds />
        </div>

        {/* three.js cleaning kit */}
        <div ref={canvasRef} aria-hidden className="absolute inset-0 md:left-[30%]">
          {ready && (
            <div className="absolute inset-0 animate-fade-in">
              <KitScene explode={explode} active={active} />
            </div>
          )}
        </div>

        <div className="pointer-events-none relative mx-auto flex h-full w-full max-w-7xl items-start px-5 pt-28 sm:px-8 md:items-center md:pt-24">
          <div className="hero-intro pointer-events-auto">
            <p className="hero-eyebrow hero-anim text-xs font-semibold uppercase tracking-[0.32em] text-ice">
              {hero.eyebrow}
            </p>

            <h1 className="mt-5 text-[clamp(2.6rem,6.4vw,5.5rem)] font-semibold leading-[1.04] tracking-tight text-white">
              {lines.map((line, index) => (
                <span key={line} className="-mb-[0.2em] block overflow-hidden">
                  {/* Padding sits on the inner span so the clipped gradient covers descenders. */}
                  <span
                    className={`hero-line hero-anim block pb-[0.2em] ${
                      index === lines.length - 1
                        ? "bg-gradient-to-r from-ice via-[#bfe6ff] to-white bg-clip-text text-transparent"
                        : ""
                    }`}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <p className="hero-copy hero-anim mt-6 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
              {hero.text}
            </p>

            <div className="hero-copy hero-anim mt-8">
              <a
                href="#contact"
                className="group inline-flex items-center gap-4 rounded-full bg-white py-4 pl-7 pr-6 text-sm font-semibold text-royal shadow-[0_18px_40px_-16px_rgb(6_26_92/0.8)] transition-[box-shadow,transform] duration-300 hover:shadow-[0_24px_50px_-14px_rgb(6_26_92/0.9)] active:scale-[0.97]"
              >
                {hero.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
            </div>

            <ul className="mt-10 hidden max-w-xl grid-cols-4 gap-6 md:grid">
              {heroFeatures.map((feature) => {
                const Icon = icons[feature.icon];
                return (
                  <li
                    key={feature.label}
                    className="hero-feature hero-anim flex flex-col items-center gap-3 text-center"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className="max-w-[7rem] text-xs font-medium leading-snug text-white/90">
                      {feature.label}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="hero-copy hero-anim mt-10 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
              Scroll to unpack the kit ↓
            </p>
          </div>

          <div className="hero-kit pointer-events-auto invisible absolute max-w-md pr-5">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-ice">
              Inside the kit
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
              Every clean, fully equipped.
            </h2>
            {/* Phones get a compact two-column list so the kit has room below it. */}
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:mt-8 sm:block sm:space-y-4">
              {kit.map((item, index) => (
                <li
                  key={item.name}
                  className="hero-kit-item flex gap-3 border-b border-white/20 pb-3 sm:gap-4 sm:pb-4"
                >
                  <span className="text-sm font-semibold text-[#ffd23f]">0{index + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-white sm:text-base">{item.name}</p>
                    <p className="hidden text-sm text-white/75 sm:block">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Curved transition into the page */}
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-8 w-full text-white sm:h-12"
        >
          <path d="M0 80V40C240 0 480 0 720 28s480 40 720 4v48Z" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
