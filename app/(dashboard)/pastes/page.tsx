import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import PasteList from '../../../components/paste-list';

const prisma = new PrismaClient();

const PastesPage = () => {
  const { data: session } = useSession();
  const [pastes, setPastes] = useState([]);

  useEffect(() => {
    const fetchPastes = async () => {
      if (session) {
        const response = await fetch('/api/pastes');
        const data = await response.json();
        setPastes(data);
      }
    };

    fetchPastes();
  }, [session]);

  if (!session) {
    return <div>Please log in to view your pastes.</div>;
  }

  return (
    <div>
      <h1>Your Pastes</h1>
      <PasteList pastes={pastes} />
    </div>
  );
};

export default PastesPage;