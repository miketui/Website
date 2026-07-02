import { priceConfig } from "@/content/book";

/** Quiet companion panel beside the checkout card: the schedule and terms in writing, no competing CTA. */
export function PurchaseSummary() {
  return (
    <aside aria-label="Price schedule and delivery terms" className="rounded-3xl border border-whitegold/15 bg-white/5 p-6">
      <p className="editorial-kicker">The schedule, in writing</p>
      <dl className="mt-5 space-y-4 text-sm leading-6">
        <div className="flex items-baseline justify-between gap-4 border-b border-whitegold/10 pb-4">
          <dt className="text-whitegold/75">Launch price (through release + 15 days)</dt>
          <dd className="text-xl text-antique">${priceConfig.preorderDirect.amount.toFixed(2)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-whitegold/10 pb-4">
          <dt className="text-whitegold/75">Regular price after that — permanently</dt>
          <dd className="text-xl text-whitegold">${priceConfig.regularDirect.amount.toFixed(2)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-whitegold/75">Format</dt>
          <dd className="text-whitegold">EPUB, in your account</dd>
        </div>
      </dl>
      <p className="mt-6 text-sm leading-6 text-whitegold/70">Delivered by private signed link — 3 downloads per file over 7 days, fresh links any time you sign in. Refunds close download access.</p>
    </aside>
  );
}
