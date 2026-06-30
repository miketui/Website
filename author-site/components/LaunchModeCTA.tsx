import { getLaunchCta, getLaunchMode } from "@/lib/launch-mode";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";

export function LaunchModeCTA({ className, showHelper = true }: { className?: string; showHelper?: boolean }) {
  const cta = getLaunchCta(getLaunchMode());
  return (
    <div>
      <MagneticCurlButton href={cta.href} className={className}>{cta.label}</MagneticCurlButton>
      {showHelper ? <p className="mt-2 max-w-sm text-sm text-whitegold/70">{cta.helper}</p> : null}
    </div>
  );
}
