export const legalOutlines = {
  privacy: [
    "Draft pending attorney review. This outline explains the intended privacy posture for accounts, purchases, support, consent, analytics, and protected digital delivery.",
    "The site may collect contact details, account identifiers, checkout/session metadata, entitlement status, support messages, consent preferences, and operational security events needed to deliver the book and protect downloads.",
    "Paid EPUB/PDF files are not public assets. Delivery is intended through authenticated account access and server-side entitlement checks that create short-lived signed URLs from private Supabase Storage.",
    "Marketing analytics and pixels must honor consent choices. Operational fulfillment, fraud-prevention, and security events may be recorded server-side without storing secrets, signed URLs, full card data, or unnecessary personal details.",
    "Production privacy language, retention periods, data-rights instructions, processor list, and jurisdiction-specific disclosures require human/attorney approval before launch."
  ],
  terms: [
    "Draft pending attorney review. These terms are a scaffold for site use, customer accounts, digital purchases, protected downloads, and support expectations.",
    "Customers are responsible for using accurate account and contact information so preorder, receipt, and download messages can be delivered.",
    "The direct digital edition is for personal use by the purchaser unless Michael approves another license in writing. Redistribution of protected EPUB/PDF files is not permitted.",
    "The site does not promise a specific business, income, client, health, or career outcome. The book teaches craft, business rhythm, and creative reflection; it does not guarantee results.",
    "Final limitations, dispute terms, governing law, and consumer disclosures require human/attorney approval before production."
  ],
  refund: [
    "Draft pending attorney review. Refund handling must be plain, humane, and consistent with the approved final policy.",
    "If a digital purchase is refunded, the matching entitlement should be revoked so future protected downloads are denied.",
    "Support should use the configured support email to review duplicate purchases, delivery problems, failed access, and other good-faith refund requests.",
    "No copy should imply unlimited access after refund, guaranteed approval, or a policy Michael has not approved.",
    "Final refund window, exceptions, payment-processor timing, and customer notices require human/attorney approval before launch."
  ],
  preorder: [
    "Draft pending attorney review. Preorder language must state the direct preorder / launch price, expected delivery timing, what customers receive, and how to contact support.",
    "The locked direct preorder / launch price is $17.99. The regular direct price is $19.99 after launch mode changes, unless Michael approves a documented change.",
    "The expected release date currently comes from configuration and must be confirmed by Michael before any public preorder campaign runs.",
    "Preorder buyers should receive access through the protected downloads area after entitlement creation and deliverable availability.",
    "Final preorder terms, tax/payment language, cancellation handling, and launch-date disclosures require human/attorney approval before production."
  ],
  delivery: [
    "Draft pending attorney review. Digital delivery is designed around private Supabase Storage, server-side entitlement checks, and short-lived signed URLs.",
    "The locked private bucket is curls-deliverables. The locked object path is the v13 EPUB path documented in the handoff and sandbox runbook; the POD interior PDF is a print-only artifact and is not delivered by the site.",
    "Paid EPUB/PDF artifacts must never be copied into public/, linked directly from public pages, committed as website assets, or exposed through static URLs.",
    "Unauthorized users, expired/revoked entitlements, refunded orders, and missing provider configuration should fail closed with a clear support path.",
    "Final delivery timing, download limits, customer support SLA, and replacement-link policy require human/attorney approval before launch."
  ],
  cookies: [
    "Draft pending attorney review. Cookie and analytics language must clearly explain necessary site behavior, consent choices, and optional marketing/product analytics.",
    "Necessary cookies/storage may support authentication, security, checkout continuity, consent state, and protected delivery.",
    "GA4/PostHog or similar marketing analytics should not run until the user grants the relevant consent, while server-side operational events remain minimized and sanitized.",
    "Customers should be able to decline non-essential tracking without losing checkout, account, or download functionality.",
    "Final cookie categories, vendor list, opt-out mechanism, and regional notices require human/attorney approval before production."
  ],
  accessibility: [
    "Draft pending accessibility and legal review. The site aims for readable editorial typography, strong contrast, keyboard-friendly navigation, and understandable form states.",
    "Immersive motion must honor prefers-reduced-motion and must never block checkout, authentication, downloads, legal pages, or readable copy.",
    "The app should keep protected-download and checkout errors clear, actionable, and available without relying only on animation, color, or hover states.",
    "Known issues discovered in preview QA should be logged before launch and prioritized by customer impact.",
    "Final accessibility statement, feedback process, and remediation commitments require human review before production."
  ]
} as const;
