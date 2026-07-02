import Link from "next/link";
import { LaunchModeCTA } from "@/components/LaunchModeCTA";
import { MobileNav } from "@/components/MobileNav";

const nav = [
  { href: "/book", label: "The Book" },
  { href: "/chapters", label: "Chapters" },
  { href: "/free-chapter", label: "Free Chapter" },
  { href: "/resources", label: "Resources", memberOnly: true },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-whitegold/10 bg-obsidian/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-6">
        <Link href="/" className="font-display text-xl leading-none text-white sm:text-2xl">Curls &<span className="block text-antique sm:inline"> Contemplation</span></Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-5 text-sm text-whitegold/80 md:flex">
          {nav.map((item) => <Link key={item.href} href={item.href} className="transition hover:text-antique focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique">{item.label}</Link>)}
        </nav>
        <div className="hidden md:block"><LaunchModeCTA showHelper={false} /></div>
        <div className="flex items-center gap-3 md:hidden">
          <Link href="/preorder" className="inline-flex min-h-11 items-center rounded-full border border-antique/70 px-3 py-2 text-xs font-semibold text-whitegold">Preorder</Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
