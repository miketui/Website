export const priceConfig = {
  preorderDirect: { label: "Preorder (before release)", amount: 17.99, cents: 1799 },
  regularDirect: { label: "Direct, from release day", amount: 19.99, cents: 1999 },
  /**
   * Separate SKU with its own Stripe price (STRIPE_PRICE_ID_WORKBOOK). It
   * happens to match regularDirect today, which is exactly why it needs its
   * own entry — copy that derived the workbook price from the *book's* price
   * would have silently followed a book price change.
   */
  workbook: { label: "Idea-to-Action Workbook", amount: 19.99, cents: 1999 }
} as const;

export const book = {
  slug: "curls-and-contemplation",
  title: "Curls & Contemplation",
  subtitle: "A Stylist’s Interactive Journey",
  author: "Michael David",
  description:
    "A 467-page interactive guide for hairstylists who want stronger creative identity, clearer business decisions, intentional visibility, principled leadership, and a more sustainable career.",
  credibilityNote: "Built from Michael's lived hairstylist and creative practice experience.",
  numberOfPages: 467,
  preorderPrice: priceConfig.preorderDirect.amount,
  regularPrice: priceConfig.regularDirect.amount
} as const;
