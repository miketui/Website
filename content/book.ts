export const priceConfig = {
  preorderDirect: { label: "Preorder / direct launch", amount: 17.99, cents: 1799 },
  regularDirect: { label: "Regular direct", amount: 19.99, cents: 1999 }
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
