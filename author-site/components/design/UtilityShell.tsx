import type { ReactNode } from "react";

export function UtilityShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-14 md:px-6 md:py-16">
      <p className="editorial-kicker">{eyebrow}</p>
      <h1 className="mt-4 font-display text-4xl leading-tight text-white md:text-6xl">{title}</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-whitegold/78 md:text-lg">{description}</p>
      <div className="mt-8">{children}</div>
    </main>
  );
}
