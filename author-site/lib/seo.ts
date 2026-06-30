import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

const baseUrl = new URL(siteConfig.siteUrl);

type PageMetadataOptions = {
  path?: string;
  noIndex?: boolean;
  image?: string;
  type?: "website" | "article";
};

export function absoluteUrl(path = "/") {
  return new URL(path, baseUrl).toString();
}

export function pageMetadata(title: string, description: string, options: PageMetadataOptions | boolean = {}): Metadata {
  const normalized = typeof options === "boolean" ? { noIndex: options } : options;
  const path = normalized.path ?? "/";
  const fullTitle = `${title} | ${siteConfig.name}`;
  const image = normalized.image ?? "/og-default.png";

  return {
    title,
    description,
    metadataBase: baseUrl,
    alternates: { canonical: absoluteUrl(path) },
    robots: normalized.noIndex ? { index: false, follow: false, googleBot: { index: false, follow: false } } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      type: normalized.type ?? "website",
      images: [{ url: image, alt: `${siteConfig.name} by ${siteConfig.author}` }]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image]
    }
  };
}
