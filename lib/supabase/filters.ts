/**
 * Build a PostgREST `or()` of equality checks with each value double-quoted, so
 * a metacharacter in user-controlled input (e.g. a comma in an email) cannot
 * reshape the filter into matching rows it shouldn't. Empty/nullish values are
 * dropped rather than turned into `col.eq.""`.
 *
 * PostgREST quoting: values may be wrapped in double quotes; an embedded double
 * quote is escaped as \". See https://postgrest.org/en/stable/references/api/tables_views.html
 */
export function orEquals(pairs: Array<[column: string, value: string | null | undefined]>): string {
  return pairs
    .filter(([, value]) => value != null && value !== "")
    .map(([column, value]) => `${column}.eq."${String(value).replace(/"/g, '\\"')}"`)
    .join(",");
}
