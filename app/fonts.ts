import localFont from "next/font/local";
import { Libre_Baskerville } from "next/font/google";

/**
 * Type system for the immersive redesign (ACISS).
 *   --font-display : Libre Baskerville  (headings; Cinzel retired)
 *   --font-accent  : Cormorant Garamond (italic accents — the gold "&", pull lines)
 *   --font-body    : Inter               (UI / body)
 *
 * Libre Baskerville is fetched + self-hosted by next/font/google at build time
 * (no runtime request → CSP-safe). Cormorant & Inter stay self-hosted locally.
 */
export const displayFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "serif"]
});

export const accentFont = localFont({
  src: [
    { path: "./fonts/CormorantGaramond-var.woff2", style: "normal", weight: "300 700" },
    { path: "./fonts/CormorantGaramond-var-italic.woff2", style: "italic", weight: "300 700" }
  ],
  variable: "--font-accent",
  display: "swap",
  fallback: ["Georgia", "serif"]
});

export const bodyFont = localFont({
  src: [{ path: "./fonts/Inter-var.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-body",
  display: "swap",
  fallback: ["Inter", "system-ui", "sans-serif"]
});
