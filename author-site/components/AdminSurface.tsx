import Link from "next/link";

export function AdminSurface({ title, description }: { title: string; description: string }) {
  const cards = ["orders", "subscribers", "claims", "content", "analytics"];
  return (
    <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
      <section className="editorial-panel rounded-[2rem] p-6">
        <h2 className="font-display text-3xl text-white">{title}</h2>
        <p className="mt-4 text-whitegold/75">{description}</p>
        <p className="mt-4 rounded-2xl border border-antique/25 p-4 text-sm text-whitegold/70">Scaffold only: admin data must stay behind service-role server routes and allowlisted administrators.</p>
      </section>
      <nav aria-label="Admin sections" className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => <Link key={card} href={`/admin/${card}`} className="rounded-2xl border border-whitegold/15 bg-white/5 p-5 text-whitegold transition hover:border-antique/60 hover:text-white">{card}</Link>)}
      </nav>
    </div>
  );
}
