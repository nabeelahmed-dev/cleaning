# Cleaning company site (demo)

Animated marketing and booking site for a cleaning company. This is a demo: the
company is shown as "Your Company" and all details are placeholders.

- Live demo: https://cleaning-ten-rho.vercel.app/
- Booking page: https://cleaning-ten-rho.vercel.app/booking

## The main point: bookings after hours

The booking page takes requests around the clock, so the business keeps
winning work after closing time without anyone answering the phone. A customer
picks a service, describes their space, sees a price estimate and chooses a
date; the request is waiting when the business opens the next morning.

## What's inside

- Pinned 3D hero: a cleaning kit modelled in code (bucket, squeegee, spray bottle, cloths, sponge) that rotates, then unpacks into labelled parts as you scroll
- 3D tilt cards for services, reasons and process steps
- Bubbles that drift toward the cursor in the "Why choose us" and quote sections
- 3D review ring that auto-rotates, drags to spin and steps with arrows
- Booking page (`/booking`) with a multi-step form and a live price estimate
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

- This is a client demo, so it is closed to search engines three ways: `robots.txt` disallows all crawlers (`src/app/robots.ts`), every response carries an `X-Robots-Tag: noindex` header (`next.config.ts`), and every page has a `noindex` robots tag (`src/app/layout.tsx`). It also sets no SEO metadata (description, canonical or social tags). Undo all of this for a real launch.
- The quote and booking forms have no backend: they open the visitor's email app with the request filled in.
- Respects `prefers-reduced-motion`.
