import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardUrlsPage() {
  const urls = await prisma.url.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="container">
      <h1>Short Links</h1>
      {urls.length === 0 ? (
        <p>No short links yet.</p>
      ) : (
        <ul>
          {urls.map((url) => (
            <li key={url.id} className="card">
              <div>
                <strong>Original:</strong> {url.originalUrl}
              </div>
              <div>
                <strong>Short:</strong>{" "}
                <Link href={`/s/${url.slug}`}>{`/s/${url.slug}`}</Link>
              </div>
              <div>
                <strong>Clicks:</strong> {url.clicks}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
