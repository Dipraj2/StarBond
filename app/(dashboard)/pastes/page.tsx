import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PastesPage() {
  const pastes = await prisma.paste.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="container">
      <h1>Pastes</h1>
      {pastes.length === 0 ? (
        <p>No pastes yet.</p>
      ) : (
        <ul>
          {pastes.map((paste) => (
            <li key={paste.id} className="card">
              <h3>{paste.title}</h3>
              <p>{paste.content.slice(0, 180)}</p>
              <small>{paste.visibility}</small>
              <div style={{ marginTop: "0.5rem" }}>
                <Link href={`/paste/${paste.slug}`}>Open paste</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
