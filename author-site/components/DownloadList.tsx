import { deliverables } from "@/lib/downloads";

const itemNotes: Record<string, string> = {
  epub: "Private signed URL after entitlement check. 3 downloads / 7 days.",
  pdf: "Private signed URL after entitlement check. 3 downloads / 7 days.",
  card_deck: "Included with the Affirmation Card Deck order bump. 3 downloads / 7 days."
};

export function DownloadList() { return <div className="space-y-4">{Object.values(deliverables).map((item) => <form key={item.slug} action="/api/downloads/sign" method="post" className="rounded-[1.5rem] border border-whitegold/15 bg-white/5 p-5"><input type="hidden" name="deliverable" value={item.slug} /><div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><h2 className="font-display text-2xl text-white">{item.label}</h2><p className="text-sm leading-6 text-whitegold/70">{itemNotes[item.slug]}</p></div><button className="min-h-11 rounded-full bg-antique px-4 py-2 text-sm font-semibold text-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian">Download</button></div></form>)}</div>; }
