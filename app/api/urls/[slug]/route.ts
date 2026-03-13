import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const url = await prisma.url.findUnique({ where: { slug } });

  if (!url) {
    return NextResponse.json({ error: "Short link not found" }, { status: 404 });
  }

  await prisma.url.update({
    where: { id: url.id },
    data: { clicks: { increment: 1 } },
  });

  return NextResponse.redirect(url.originalUrl, 302);
}
