import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Seed users
    const user1 = await prisma.user.create({
        data: {
            username: 'user1',
            email: 'user1@example.com',
            password: 'password123', // In a real application, ensure to hash passwords
        },
    });

    const user2 = await prisma.user.create({
        data: {
            username: 'user2',
            email: 'user2@example.com',
            password: 'password123', // In a real application, ensure to hash passwords
        },
    });

    // Seed pastes
    await prisma.paste.createMany({
        data: [
            {
                title: 'First Paste',
                content: 'This is the content of the first paste.',
                visibility: 'public',
                userId: user1.id,
            },
            {
                title: 'Second Paste',
                content: 'This is the content of the second paste.',
                visibility: 'private',
                userId: user1.id,
            },
        ],
    });

    // Seed URLs
    await prisma.url.createMany({
        data: [
            {
                originalUrl: 'https://example.com',
                shortUrl: 'exmpl',
                userId: user1.id,
            },
            {
                originalUrl: 'https://anotherexample.com',
                shortUrl: 'anex',
                userId: user2.id,
            },
        ],
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });