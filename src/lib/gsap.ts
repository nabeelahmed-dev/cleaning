import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Follow the wall clock even when frames are slow or throttled, so content
// that starts hidden is never left waiting on the intro animation.
gsap.ticker.lagSmoothing(0);

export { gsap, ScrollTrigger, useGSAP };
