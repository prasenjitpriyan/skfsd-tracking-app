/**
 * Shared ordering helpers.
 *
 * Every list of offices or delivery centres in the app — dropdowns, tables,
 * and chart series — MUST be ordered through these helpers so the order is
 * consistent everywhere (alphabetical by name, case-insensitive, locale-aware).
 *
 * Hooks that fetch related rows (e.g. daily_office_data joined with offices)
 * use `sortByOfficeName` / `sortByCentreName` so consumers don't have to
 * re-sort. When you write a new component that renders a list of offices or
 * centres, pass the array through the matching helper instead of relying on
 * the order returned by the database.
 */

const compare = (a: string | null | undefined, b: string | null | undefined) =>
  (a || '').localeCompare(b || '', undefined, { sensitivity: 'base' });

export const sortByName = <T extends { name?: string | null }>(items: T[] | undefined | null): T[] =>
  [...(items || [])].sort((a, b) => compare(a.name, b.name));

export const sortByOfficeName = <T extends { offices?: { name?: string | null } | null }>(
  items: T[] | undefined | null,
): T[] => [...(items || [])].sort((a, b) => compare(a.offices?.name, b.offices?.name));

export const sortByCentreName = <T extends { delivery_centres?: { name?: string | null } | null }>(
  items: T[] | undefined | null,
): T[] => [...(items || [])].sort((a, b) => compare(a.delivery_centres?.name, b.delivery_centres?.name));
