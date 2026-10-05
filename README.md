# Top Notch Reliable Cleaning LLC

Animated marketing site for a commercial and office cleaning company in Columbus.

Live: https://clearsky-cleaning.vercel.app

## What's inside

- Pinned 3D hero: a cleaning kit modelled in code (bucket, squeegee, spray bottle, cloths, sponge) that rotates, then unpacks into labelled parts as you scroll
- 3D tilt cards for services, reasons and process steps
- Bubbles that drift toward the cursor in the "Why choose us" and quote sections
- 3D review ring that auto-rotates, drags to spin and steps with arrows
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

All copy lives in `src/lib/site.ts`. The business name, phone, email, service area and the six services come from the client's flyer. The stats, opening hours, service claims and reviews are placeholders and need confirming with the client before launch.

## Notes

- The site is set to `noindex` in `src/app/layout.tsx` until the placeholder content is replaced.
- The quote form has no backend: it opens the visitor's email app with the request filled in.
- Respects `prefers-reduced-motion`.
