import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PastePage({ params }: PageProps) {
  const { slug } = await params;
  const paste = await prisma.paste.findUnique({ where: { slug } });

  if (!paste) {
    notFound();
  }

  return (
    <div className="container">
      <h1>{paste.title}</h1>
      <pre className="card">{paste.content}</pre>
      <small>{paste.visibility}</small>
    </div>
  );
}
