"use client";

import dynamic from "next/dynamic";
import { useDeferredMount } from "@/lib/useDeferredMount";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });

/** El cursor personalizado es decorativo: se carga después del primer pintado. */
export default function DeferredCursor() {
  const ready = useDeferredMount();
  return ready ? <CustomCursor /> : null;
}
