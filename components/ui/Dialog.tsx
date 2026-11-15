"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { lockScroll } from "@/lib/scroll";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  variant: "drawer" | "modal";
  children: ReactNode;
  className?: string;
}

/**
 * <dialog> nativo: foco atrapado, Esc y fondo inerte gratis.
 * Las transiciones de entrada/salida viven en globals.css (.ui-drawer / .ui-modal).
 */
export default function Dialog({ open, onClose, labelledBy, variant, children, className = "" }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      lockScroll(true);
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClose = () => {
      lockScroll(false);
      onClose();
    };
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      data-lenis-prevent
      // Clic en el fondo (fuera del contenido) cierra
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`${variant === "drawer" ? "ui-drawer" : "ui-modal"} ${className}`}
    >
      {children}
    </dialog>
  );
}
