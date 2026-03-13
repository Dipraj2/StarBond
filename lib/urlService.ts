const urls = new Map<string, string>();

function randomSlug(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function createShortUrl(originalUrl: string): Promise<string> {
  let slug = randomSlug();
  while (urls.has(slug)) {
    slug = randomSlug();
  }
  urls.set(slug, originalUrl);
  return slug;
}

export async function getShortUrl(slug: string): Promise<string | null> {
  return urls.get(slug) ?? null;
}
