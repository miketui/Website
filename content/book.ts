export const priceConfig = {
  preorderDirect: { label: "Preorder / direct launch", amount: 17.99, cents: 1799 },
  regularDirect: { label: "Regular direct", amount: 19.99, cents: 1999 },
  kindleExternal: { label: "Kindle", amount: 9.99, cents: 999 },
  paperbackExternal: { label: "Paperback / POD placeholder", amount: 29.99, cents: 2999 }
} as const;

export const book = {
  slug: "curls-and-contemplation",
  title: "Curls & Contemplation",
  subtitle: "A Freelance Hairstylist's Guide to Creative Excellence",
  author: "Michael David",
  description:
    "A grounded, premium guide for freelance hairstylists who want steadier creativity, clearer business decisions, and a more sustainable path behind the chair.",
  credibilityNote: "Built from Michael's lived hairstylist and creative practice experience.",
  preorderPrice: priceConfig.preorderDirect.amount,
  regularPrice: priceConfig.regularDirect.amount
} as const;
