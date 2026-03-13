import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./lib/auth";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "user1@example.com" },
    update: {},
    create: {
      email: "user1@example.com",
      password: hashPassword("password123"),
    },
  });

  await prisma.paste.createMany({
    data: [
      {
        title: "First Paste",
        content: "This is the content of the first paste.",
        slug: "first-paste",
        visibility: "PUBLIC",
        userId: user.id,
      },
      {
        title: "Second Paste",
        content: "This is the content of the second paste.",
        slug: "second-paste",
        visibility: "PRIVATE",
        userId: user.id,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.url.createMany({
    data: [
      {
        originalUrl: "https://example.com",
        slug: "exmpl1",
        shortUrl: "http://localhost:3000/s/exmpl1",
        userId: user.id,
      },
      {
        originalUrl: "https://anotherexample.com",
        slug: "anex22",
        shortUrl: "http://localhost:3000/s/anex22",
        userId: user.id,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
