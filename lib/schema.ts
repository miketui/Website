import { faqs } from "@/content/faq";
import { book, priceConfig } from "@/content/book";
import { posts } from "@/content/blog";
import { siteConfig } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";
import { resolveLaunchOffer } from "@/config/launchState";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author,
    url: absoluteUrl("/about")
  };
}

/**
 * The offer Google sees, resolved from the same function checkout uses.
 *
 * This block used to hardcode the preorder price and `PreOrder` availability
 * with a `priceValidUntil` of RELEASE_DATE + 15 days — a rule that no longer
 * exists. Structured data that advertises $17.99 after the site has moved to
 * $19.99 is a price mismatch in the one place a buyer cannot see and Google
 * can, so it reads the resolver like every other surface.
 */
function offerJsonLd(url: string) {
  const offer = resolveLaunchOffer();
  return {
    "@type": "Offer" as const,
    price: offer.amountDollars.toFixed(2),
    priceCurrency: "USD",
    // The preorder price is valid up to the release instant, not past it.
    priceValidUntil: offer.state === "PREORDER" ? siteConfig.releaseDate : undefined,
    availability: offer.state === "PREORDER" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
    url: absoluteUrl(url)
  };
}

export function bookJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    image: absoluteUrl("/og-default.png"),
    alternateName: `${book.title}: ${book.subtitle}`,
    author: { "@type": "Person", name: book.author, url: absoluteUrl("/about") },
    description: book.description,
    url: absoluteUrl("/book"),
    inLanguage: "en",
    numberOfPages: book.numberOfPages,
    datePublished: siteConfig.releaseDate,
    bookEdition: "Digital Edition",
    publisher: { "@type": "Organization", name: siteConfig.name },
    audience: { "@type": "Audience", audienceType: "Freelance hairstylists and beauty professionals" },
    potentialAction: { "@type": "ViewAction", target: absoluteUrl("/pricing-kit") },
    offers: offerJsonLd("/preorder")
  };
}

export function productJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${book.title} — Direct Digital Edition`,
    description: book.description,
    image: absoluteUrl("/og-default.png"),
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: offerJsonLd("/buy")
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  };
}

export function blogPostingJsonLd(slug: string) {
  const post = posts.find((item) => item.slug === slug);
  if (!post) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url: absoluteUrl(`/blog/${post.slug}`),
    author: { "@type": "Person", name: siteConfig.author, url: absoluteUrl("/about") },
    publisher: { "@type": "Organization", name: siteConfig.name, url: absoluteUrl("/") }
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}
