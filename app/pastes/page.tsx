import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PublicPastesPage() {
  const now = new Date();
  const pastes = await prisma.paste.findMany({
    where: {
      visibility: "PUBLIC",
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="container">
      <h1>Recent Public Pastes</h1>
      {pastes.length === 0 ? (
        <p>No public pastes yet.</p>
      ) : (
        <ul>
          {pastes.map((paste) => (
            <li key={paste.id} className="card">
              <h3>{paste.title}</h3>
              <p>{paste.content.slice(0, 180)}</p>
              <small>
                {paste.language} • {paste.visibility}
              </small>
              <div className="toolbar">
                <Link href={`/paste/${paste.slug}`}>Open</Link>
                <Link href={`/api/pastes/raw/${paste.slug}`}>Raw</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
