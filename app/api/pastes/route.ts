import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const pasteSchema = z.object({
  title: z.string().min(1).max(120),
  content: z.string().min(1),
  visibility: z.enum(["PUBLIC", "UNLISTED", "PRIVATE"]).default("PUBLIC"),
});

function generateSlug(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function GET() {
  const pastes = await prisma.paste.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(pastes);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = pasteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid paste payload" }, { status: 400 });
  }

  const slug = generateSlug();
  const paste = await prisma.paste.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      visibility: parsed.data.visibility,
      slug,
    },
  });

  return NextResponse.json(paste, { status: 201 });
}
