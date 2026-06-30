import { AuthForm } from "@/components/AuthForm";
import { UtilityShell } from "@/components/design/UtilityShell";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Signup", "Create a customer account.", { path: "/signup", noIndex: true });
export default function Page() { return <UtilityShell eyebrow="Account" title="Create your direct-edition account." description="Account creation will connect to Supabase Auth during production credential setup."><AuthForm mode="signup" /></UtilityShell>; }
