export function BookMockup() {
  return (
    <div className="book-mockup relative mx-auto w-64 max-w-[72vw] sm:w-72" aria-label="Layered book cover mockup for Curls & Contemplation">
      <div aria-hidden="true" className="absolute -right-5 top-7 h-[92%] w-full rounded-r-[2rem] border border-antique/20 bg-jade/35 blur-[1px]" />
      <div aria-hidden="true" className="absolute -right-2 top-3 h-[96%] w-full rounded-r-[2rem] border border-whitegold/10 bg-whitegold/10" />
      <div className="relative aspect-[3/4] overflow-hidden rounded-r-[2rem] border border-antique/45 bg-gradient-to-br from-obsidian via-jade to-obsidian p-6 shadow-gold">
        <div aria-hidden="true" className="absolute inset-x-8 top-8 h-24 rounded-full border border-antique/20" />
        <div aria-hidden="true" className="absolute -bottom-12 -right-10 h-40 w-40 rounded-full border border-mist/20" />
        <div className="relative flex h-full flex-col rounded-r-[1.4rem] border border-whitegold/20 p-5">
          <p className="editorial-kicker">Curls</p>
          <h2 className="mt-8 font-display text-3xl leading-[1.04] text-white sm:text-4xl">Curls &amp;<br />Contemplation</h2>
          <p className="mt-5 max-w-36 text-sm leading-5 text-whitegold/75">A Freelance Hairstylist&apos;s Guide to Creative Excellence</p>
          <p className="mt-auto text-sm font-semibold uppercase tracking-[0.18em] text-antique">Michael David</p>
        </div>
      </div>
    </div>
  );
}
