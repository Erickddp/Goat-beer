import type { ReactNode } from "react";

interface SectionHeaderProps {
  index: string;
  eyebrow: string;
  title: ReactNode;
  /** Id del h2, para aria-labelledby de la sección */
  id: string;
  className?: string;
  titleClassName?: string;
}

/** Eyebrow numerado + titular display. Cada sección anima su propio titular. */
export default function SectionHeader({
  index,
  eyebrow,
  title,
  id,
  className = "",
  titleClassName = "",
}: SectionHeaderProps) {
  return (
    <header className={className}>
      <p data-eyebrow className="mb-5 flex items-center gap-3 text-eyebrow uppercase text-gold">
        <span className="font-display tabular-nums">{index}</span>
        <span aria-hidden className="h-px w-10 bg-gold-deep" />
        {eyebrow}
      </p>
      <h2
        id={id}
        data-title
        className={`font-display text-display-lg font-light text-balance text-foam ${titleClassName}`}
      >
        {title}
      </h2>
    </header>
  );
}
