import localFont from "next/font/local";

/**
 * Self-hosted variable fonts (latin subsets, SIL OFL). The design system
 * declared Cormorant Garamond / Inter from day one but nothing ever loaded
 * them — every serif on the site was silently falling back to Georgia.
 * These exports feed the existing --font-display / --font-body variables.
 */
export const displayFont = localFont({
  src: [
    { path: "./fonts/CormorantGaramond-var.woff2", style: "normal", weight: "300 700" },
    { path: "./fonts/CormorantGaramond-var-italic.woff2", style: "italic", weight: "300 700" }
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "serif"]
});

export const bodyFont = localFont({
  src: [{ path: "./fonts/Inter-var.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-body",
  display: "swap",
  fallback: ["Inter", "system-ui", "sans-serif"]
});
