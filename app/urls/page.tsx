import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PublicUrlsPage() {
  const now = new Date();
  const urls = await prisma.url.findMany({
    where: {
      visibility: "PUBLIC",
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="container">
      <h1>Recent Public Short Links</h1>
      {urls.length === 0 ? (
        <p>No public short links yet.</p>
      ) : (
        <ul>
          {urls.map((url) => (
            <li key={url.id} className="card">
              <p>{url.originalUrl}</p>
              <p>
                <Link href={`/s/${url.slug}`}>{`/s/${url.slug}`}</Link>
              </p>
              <small>
                {url.clicks} clicks • {url.redirectType}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
