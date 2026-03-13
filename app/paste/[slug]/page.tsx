import { GetServerSideProps } from 'next';
import { prisma } from '../../../lib/prisma';

interface PasteProps {
  content: string;
  title: string;
}

const PastePage = ({ content, title }: PasteProps) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <pre className="bg-gray-100 p-4 rounded">{content}</pre>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  const paste = await prisma.paste.findUnique({
    where: { slug: String(slug) },
  });

  if (!paste) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      content: paste.content,
      title: paste.title,
    },
  };
};

export default PastePage;