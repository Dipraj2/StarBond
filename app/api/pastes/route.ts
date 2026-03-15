import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { createSlug, parseExpiry } from "@/lib/utils";
import { hitRateLimit } from "@/lib/rate-limit";

const createPasteSchema = z.object({
  title: z.string().min(1).max(160),
  content: z.string().min(1),
  language: z.string().min(1).max(40).default("text"),
  visibility: z.enum(["PUBLIC", "UNLISTED", "PRIVATE"]).default("PUBLIC"),
  expiresIn: z.enum(["never", "10m", "1h", "1d"]).default("never"),
  password: z.string().min(4).max(64).optional(),
  burnAfterRead: z.boolean().default(false),
});

export async function GET(request: Request) {
  const user = await getCurrentUser();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const mine = searchParams.get("mine") === "1";

  if (mine && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const where: Record<string, unknown> = {};
  if (mine && user) where.userId = user.id;
  if (!mine) where.visibility = "PUBLIC";
  const and: object[] = [{ OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }];
  if (q) and.push({ OR: [{ title: { contains: q, mode: "insensitive" } }, { content: { contains: q, mode: "insensitive" } }] });
  where.AND = and;

  const pastes = await prisma.paste.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      slug: true,
      language: true,
      visibility: true,
      expiresAt: true,
      burnAfterRead: true,
      createdAt: true,
      views: true,
      userId: true,
    },
  });
  return NextResponse.json({ items: pastes });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (hitRateLimit(`paste:create:${ip}`, 25, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = createPasteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid paste payload" }, { status: 400 });
  }

  let slug = createSlug(8);
  while (await prisma.paste.findUnique({ where: { slug } })) slug = createSlug(8);

  const paste = await prisma.paste.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      language: parsed.data.language,
      visibility: parsed.data.visibility,
      expiresAt: parseExpiry(parsed.data.expiresIn),
      passwordHash: parsed.data.password ? hashPassword(parsed.data.password) : null,
      burnAfterRead: parsed.data.burnAfterRead,
      slug,
      userId: user.id,
    },
  });

  return NextResponse.json({ item: paste }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updateSchema = z.object({
    id: z.number().int().positive(),
    title: z.string().min(1).max(160).optional(),
    content: z.string().min(1).optional(),
    language: z.string().min(1).max(40).optional(),
    visibility: z.enum(["PUBLIC", "UNLISTED", "PRIVATE"]).optional(),
    expiresIn: z.enum(["never", "10m", "1h", "1d"]).optional(),
    password: z.string().min(4).max(64).nullable().optional(),
    burnAfterRead: z.boolean().optional(),
  });
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const found = await prisma.paste.findUnique({ where: { id: parsed.data.id } });
  if (!found || found.userId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const item = await prisma.paste.update({
    where: { id: found.id },
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      language: parsed.data.language,
      visibility: parsed.data.visibility,
      expiresAt: parsed.data.expiresIn ? parseExpiry(parsed.data.expiresIn) : undefined,
      passwordHash:
        parsed.data.password === undefined ? undefined : parsed.data.password === null ? null : hashPassword(parsed.data.password),
      burnAfterRead: parsed.data.burnAfterRead,
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
  const found = await prisma.paste.findUnique({ where: { id } });
  if (!found || found.userId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.paste.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export function validatePastePassword(password: string | null, hash: string | null): boolean {
  if (!hash) return true;
  if (!password) return false;
  return verifyPassword(password, hash);
}
