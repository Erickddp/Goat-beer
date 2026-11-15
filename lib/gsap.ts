"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
}

/** Animaciones completas solo si el usuario no pidió reducir movimiento. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
/** Equivalente al ease-brew del design system. */
export const EASE_BREW = "expo.out";

export { gsap, ScrollTrigger, SplitText, useGSAP };
