import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const urlSchema = z.object({
  originalUrl: z.string().url(),
  customSlug: z.string().optional(),
  visibility: z.enum(['public', 'private']).default('public'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = urlSchema.parse(body);

    const { originalUrl, customSlug, visibility } = parsedBody;

    const existingUrl = await prisma.url.findUnique({
      where: { slug: customSlug },
    });

    if (customSlug && existingUrl) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 400 });
    }

    const slug = customSlug || generateSlug(originalUrl);

    const newUrl = await prisma.url.create({
      data: {
        originalUrl,
        slug,
        visibility,
      },
    });

    return NextResponse.json(newUrl, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

function generateSlug(originalUrl: string) {
  return originalUrl.split('/').pop()?.split('?')[0] || 'url';
}

export async function GET() {
  const urls = await prisma.url.findMany();
  return NextResponse.json(urls);
}