import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createSlug } from "@/lib/utils";
import { hitRateLimit } from "@/lib/rate-limit";

const createUrlSchema = z.object({
  originalUrl: z.string().url(),
  customAlias: z.string().regex(/^[a-zA-Z0-9_-]{3,40}$/).optional(),
  visibility: z.enum(["PUBLIC", "UNLISTED", "PRIVATE"]).default("PUBLIC"),
  redirectType: z.enum(["TEMPORARY", "PERMANENT"]).default("TEMPORARY"),
  expiresAt: z.string().optional(),
  clickLimit: z.number().int().positive().max(1_000_000).optional(),
});

export async function GET(request: Request) {
  const user = await getCurrentUser();
  const { searchParams } = new URL(request.url);
  const mine = searchParams.get("mine") === "1";
  if (mine && !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const where = mine && user ? { userId: user.id } : { visibility: "PUBLIC" as const };
  const urls = await prisma.url.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      analytics: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
  return NextResponse.json({ items: urls });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (hitRateLimit(`url:create:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = createUrlSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid URL payload" }, { status: 400 });

  const slug = parsed.data.customAlias ?? createSlug(7);
  const exists = await prisma.url.findUnique({ where: { slug } });
  if (exists) return NextResponse.json({ error: "Alias already in use" }, { status: 409 });

  const base = process.env.BASE_URL ?? "http://localhost:3000";
  const item = await prisma.url.create({
    data: {
      userId: user.id,
      originalUrl: parsed.data.originalUrl,
      slug,
      visibility: parsed.data.visibility,
      redirectType: parsed.data.redirectType,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      clickLimit: parsed.data.clickLimit,
    },
  });

  return NextResponse.json({ item, shortUrl: `${base}/s/${slug}` }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const schema = z.object({
    id: z.number().int().positive(),
    originalUrl: z.string().url().optional(),
    visibility: z.enum(["PUBLIC", "UNLISTED", "PRIVATE"]).optional(),
    redirectType: z.enum(["TEMPORARY", "PERMANENT"]).optional(),
    expiresAt: z.string().nullable().optional(),
    clickLimit: z.number().int().positive().max(1_000_000).nullable().optional(),
  });
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const found = await prisma.url.findUnique({ where: { id: parsed.data.id } });
  if (!found || found.userId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const item = await prisma.url.update({
    where: { id: found.id },
    data: {
      originalUrl: parsed.data.originalUrl,
      visibility: parsed.data.visibility,
      redirectType: parsed.data.redirectType,
      expiresAt: parsed.data.expiresAt === undefined ? undefined : parsed.data.expiresAt === null ? null : new Date(parsed.data.expiresAt),
      clickLimit: parsed.data.clickLimit,
    },
  });
  return NextResponse.json({ item });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const found = await prisma.url.findUnique({ where: { id } });
  if (!found || found.userId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.url.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
