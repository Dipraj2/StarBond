import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const urlSchema = z.object({
  originalUrl: z.string().url(),
  customSlug: z.string().min(3).max(50).optional(),
  visibility: z.enum(["public", "private"]).default("public"),
});

function generateSlug(): string {
  return Math.random().toString(36).slice(2, 8);
}

export async function GET() {
  const urls = await prisma.url.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(urls);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = urlSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid URL payload" }, { status: 400 });
  }

  const slug = parsed.data.customSlug ?? generateSlug();
  const existing = await prisma.url.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const base = process.env.BASE_URL ?? "http://localhost:3000";
  const record = await prisma.url.create({
    data: {
      originalUrl: parsed.data.originalUrl,
      slug,
      visibility: parsed.data.visibility,
      shortUrl: `${base}/s/${slug}`,
    },
  });

  return NextResponse.json(
    {
      ...record,
      shortenedUrl: `${base}/s/${slug}`,
    },
    { status: 201 }
  );
}
