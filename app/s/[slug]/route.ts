import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const url = await prisma.url.findUnique({ where: { slug } });

  if (!url) {
    return NextResponse.redirect(new URL("/", process.env.BASE_URL ?? "http://localhost:3000"));
  }

  if (url.expiresAt && url.expiresAt.getTime() <= Date.now()) {
    return NextResponse.json({ error: "Short link expired" }, { status: 410 });
  }
  if (url.clickLimit !== null && url.clicks >= (url.clickLimit ?? 0)) {
    return NextResponse.json({ error: "Click limit reached" }, { status: 410 });
  }

  await prisma.url.update({
    where: { id: url.id },
    data: {
      clicks: { increment: 1 },
      lastClickedAt: new Date(),
    },
  });

  await prisma.urlClick.create({
    data: {
      urlId: url.id,
      referrer: request.headers.get("referer"),
      userAgent: request.headers.get("user-agent"),
    },
  });

  return NextResponse.redirect(url.originalUrl, url.redirectType === "PERMANENT" ? 301 : 302);
}
