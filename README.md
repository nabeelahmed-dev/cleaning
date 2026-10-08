# Cleaning company site (demo)

Animated marketing and booking site for a cleaning company. This is a demo: the
company is shown as "Your Company" and all details are placeholders.

Live demo: https://cleaning-ten-rho.vercel.app/

## What's inside

- Pinned 3D hero: a cleaning kit modelled in code (bucket, squeegee, spray bottle, cloths, sponge) that rotates, then unpacks into labelled parts as you scroll
- 3D tilt cards for services, reasons and process steps
- Bubbles that drift toward the cursor in the "Why choose us" and quote sections
- 3D review ring that auto-rotates, drags to spin and steps with arrows
- Booking page with a multi-step form and a live price estimate
- Smooth scrolling and scroll-triggered reveals

## Stack

Next.js 16 (App Router) · React 19 · React Three Fiber + drei · three.js · GSAP + ScrollTrigger · Lenis · Tailwind CSS 4 · TypeScript

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Content

All copy lives in `src/lib/site.ts`. The company name, phone, email, service area, stats, opening hours, claims, reviews and booking prices are placeholders. Replace them with the real business's details.

## Notes

- The site is set to `noindex` in `src/app/layout.tsx` while it holds placeholder content.
- The quote and booking forms have no backend: they open the visitor's email app with the request filled in.
- Respects `prefers-reduced-motion`.
