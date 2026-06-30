declare module "../scripts/*.mjs" {
  export const providerRequirements: Record<string, string[]>;
  export const lockedStorage: { bucket: string; epub: string; pdf: string };
  export function parseDotenv(source: string): Record<string, string>;
  export function loadSandboxEnv(cwd?: string, baseEnv?: Record<string, string | undefined>): Record<string, string | undefined>;
  export function isLiveStripeValue(value?: string): boolean;
  export function detectDangerousSandboxEnv(env: Record<string, string | undefined>, options?: Record<string, unknown>): string[];
  export function providerStatus(env: Record<string, string | undefined>): Record<string, { present: number; total: number; missing: string[] }>;
  export function runSandboxEnvCheck(options?: Record<string, unknown>): { ok: boolean; issues: string[] };
  export function checkPublicDeliverables(options?: { appDir?: string }): { ok: boolean; offenders: string[] };
  export function verifyLockedPathStrings(options?: { repoRoot?: string; appDir?: string }): { ok: boolean; matches: Record<string, string[]>; missing: string[]; publicOffenders: string[] };
  export function runSupabaseStorageCheck(options?: { repoRoot?: string; appDir?: string; env?: Record<string, string | undefined> }): Promise<{ ok: boolean; staticResult: unknown; remote: { skipped?: boolean; ok?: boolean; reason?: string } }>;
  export const stripeEnvNames: string[];
  export function stripeTestModeStatus(env?: Record<string, string | undefined>): { ok: boolean; skipped?: boolean; missing?: string[]; reason?: string };
}
