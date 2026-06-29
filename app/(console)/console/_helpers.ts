export function parsePage(sp: Record<string, string | string[] | undefined>) {
  const raw = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const n = Number(raw ?? "1");
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}
export function parseQ(sp: Record<string, string | string[] | undefined>) {
  const raw = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  return (raw ?? "").trim();
}
export const PAGE_SIZE = 25;