import React from 'react';
import { ThemeProvider } from '../components/theme-provider';
import Header from '../components/header';
import '../styles/globals.css';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <html lang="en">
            <body>
                <ThemeProvider>
                    <Header />
                    <main>{children}</main>
                </ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;