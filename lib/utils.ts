export function createSlug(size = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < size; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function parseExpiry(option: string): Date | null {
  const now = Date.now();
  if (option === "10m") return new Date(now + 10 * 60 * 1000);
  if (option === "1h") return new Date(now + 60 * 60 * 1000);
  if (option === "1d") return new Date(now + 24 * 60 * 60 * 1000);
  return null;
}
