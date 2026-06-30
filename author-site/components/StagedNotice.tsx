export function StagedNotice({ funnel }: { funnel: string }) {
  return (
    <div role="note" className="mx-auto w-full max-w-6xl px-5 pt-8 md:px-6">
      <p className="rounded-2xl border border-mist/30 bg-jade/20 px-5 py-3 text-sm leading-6 text-mist">
        <strong className="font-semibold">Staged — not live.</strong> {funnel} is scaffolded for a later activation gate: no emails send, nothing is captured, and nothing is charged from this page yet.
      </p>
    </div>
  );
}
