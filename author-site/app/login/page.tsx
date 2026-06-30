import { AuthForm } from "@/components/AuthForm";
import { UtilityShell } from "@/components/design/UtilityShell";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Login", "Customer login.", { path: "/login", noIndex: true });
export default function Page() { return <UtilityShell eyebrow="Account" title="Log in to your library." description="Protected routes stay low-motion and noindex while Supabase Auth is configured."><AuthForm mode="login" /></UtilityShell>; }
