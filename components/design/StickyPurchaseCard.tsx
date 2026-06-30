import { LaunchModeCTA } from "@/components/LaunchModeCTA";
import { priceConfig } from "@/content/book";
export function StickyPurchaseCard() { return <aside className="sticky top-24 rounded-3xl border border-antique/40 bg-obsidian/90 p-6"><p className="editorial-kicker">Direct edition</p><p className="mt-3 text-3xl font-semibold text-white">${priceConfig.preorderDirect.amount.toFixed(2)}</p><p className="mt-2 text-sm text-whitegold/70">Regular direct price ${priceConfig.regularDirect.amount.toFixed(2)} after launch.</p><LaunchModeCTA className="mt-5 w-full" /></aside>; }
