import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, verifyPassword } from "@/lib/auth";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(request: Request, context: Ctx) {
  const { slug } = await context.params;
  const user = await getCurrentUser();
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");

  const paste = await prisma.paste.findUnique({ where: { slug } });
  if (!paste) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (paste.expiresAt && paste.expiresAt.getTime() <= Date.now()) {
    return NextResponse.json({ error: "Paste expired" }, { status: 410 });
  }
  if (paste.visibility === "PRIVATE" && (!user || user.id !== paste.userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (paste.passwordHash && !verifyPassword(password ?? "", paste.passwordHash)) {
    return NextResponse.json({ error: "Password required" }, { status: 401 });
  }

  if (paste.burnAfterRead) {
    await prisma.paste.delete({ where: { id: paste.id } });
  } else {
    await prisma.paste.update({ where: { id: paste.id }, data: { views: { increment: 1 } } });
  }

  return NextResponse.json({ item: paste });
}
