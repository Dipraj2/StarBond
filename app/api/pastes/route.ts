import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession(req);
    
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    switch (req.method) {
        case 'POST':
            const { title, content, visibility } = req.body;
            const newPaste = await prisma.paste.create({
                data: {
                    title,
                    content,
                    visibility,
                    userId: session.userId,
                },
            });
            return res.status(201).json(newPaste);

        case 'GET':
            const pastes = await prisma.paste.findMany({
                where: {
                    userId: session.userId,
                },
            });
            return res.status(200).json(pastes);

        case 'PUT':
            const { id, updatedContent } = req.body;
            const updatedPaste = await prisma.paste.update({
                where: { id },
                data: { content: updatedContent },
            });
            return res.status(200).json(updatedPaste);

        case 'DELETE':
            const { pasteId } = req.body;
            await prisma.paste.delete({
                where: { id: pasteId },
            });
            return res.status(204).end();

        default:
            res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}