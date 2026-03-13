import React from 'react';
import Header from '../../components/header';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <Header />
            <main>{children}</main>
        </div>
    );
};

export default DashboardLayout;