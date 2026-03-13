import React from 'react';
import { useSession } from 'next-auth/react';
import Header from '../../components/header';
import PasteList from '../../components/paste-list';
import UrlList from '../../components/url-shortener-form';

const DashboardPage: React.FC = () => {
    const { data: session } = useSession();

    return (
        <div className="dashboard-container">
            <Header />
            <h1>Welcome, {session?.user?.name || 'User'}!</h1>
            <div className="dashboard-content">
                <section className="pastes-section">
                    <h2>Your Pastes</h2>
                    <PasteList />
                </section>
                <section className="urls-section">
                    <h2>Your Shortened URLs</h2>
                    <UrlList />
                </section>
            </div>
        </div>
    );
};

export default DashboardPage;