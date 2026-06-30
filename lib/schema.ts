import { faqs } from "@/content/faq";
import { book, priceConfig } from "@/content/book";
import { posts } from "@/content/blog";
import { siteConfig } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author,
    alternateName: siteConfig.legalAuthor,
    url: absoluteUrl("/about")
  };
}

/** The real tier-flip date: launch price holds through RELEASE_DATE + 15 days. */
export function tierFlipDate() {
  const release = new Date(`${siteConfig.releaseDate}T00:00:00Z`);
  release.setUTCDate(release.getUTCDate() + 15);
  return release.toISOString().slice(0, 10);
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
    workExample: {
      "@type": "Book",
      bookFormat: "https://schema.org/EBook",
      potentialAction: { "@type": "ReadAction", target: absoluteUrl("/free-chapter") }
    },
    offers: {
      "@type": "Offer",
      price: priceConfig.preorderDirect.amount.toFixed(2),
      priceCurrency: "USD",
      priceValidUntil: tierFlipDate(),
      availability: "https://schema.org/PreOrder",
      url: absoluteUrl("/preorder")
    }
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
    offers: {
      "@type": "Offer",
      price: priceConfig.preorderDirect.amount.toFixed(2),
      priceCurrency: "USD",
      priceValidUntil: tierFlipDate(),
      availability: "https://schema.org/PreOrder",
      url: absoluteUrl("/buy")
    }
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
