import Link from "next/link";
import { siteConfig } from "@/content/site";
import { NewsletterForm } from "@/components/NewsletterForm";

const readLinks = [
  { href: "/free-chapter", label: "Free Chapter" },
  { href: "/chapters", label: "Chapters" },
  { href: "/blog", label: "Blog" },
  { href: "/worksheets", label: "Worksheets" }
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-policy", label: "Refunds" },
  { href: "/preorder-policy", label: "Preorder Policy" },
  { href: "/digital-delivery-policy", label: "Digital Delivery" },
  { href: "/cookies", label: "Cookies" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/contact", label: "Contact" }
];

export function Footer() {
  return (
    <footer className="border-t border-whitegold/10 px-6 py-12">
      <div className="mx-auto mb-12 max-w-6xl">
        <NewsletterForm source="footer" tone="footer" />
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <p className="font-display text-2xl text-white">Curls &amp; Contemplation</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-whitegold/70">A freelance hairstylist&rsquo;s guide to creative excellence — written, priced, and delivered directly by the author.</p>
        </div>
        <nav aria-label="Read and explore" className="text-sm">
          <p className="editorial-kicker">Read</p>
          <ul className="mt-4 space-y-2">
            {readLinks.map((link) => <li key={link.href}><Link href={link.href} className="text-whitegold/70 transition hover:text-antique">{link.label}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label="Legal and support" className="text-sm">
          <p className="editorial-kicker">Legal &amp; support</p>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {legalLinks.map((link) => <li key={link.href}><Link href={link.href} className="text-whitegold/70 transition hover:text-antique">{link.label}</Link></li>)}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-whitegold/10 pt-6 text-xs text-whitegold/70">
        <p>© {new Date().getFullYear()} {siteConfig.legalAuthor}, writing as {siteConfig.author}. All rights reserved.</p>
      </div>
    </footer>
  );
}
