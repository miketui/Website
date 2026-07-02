import { ProductCard } from "@/components/ProductCard";

export function PricingCard({ showCta = true }: { showCta?: boolean }) {
  return <ProductCard title="Direct digital edition" price="$17.99 preorder / $19.99 regular" description="EPUB edition. Your download appears in your account right after checkout." href={showCta ? "/preorder" : undefined} />;
}
