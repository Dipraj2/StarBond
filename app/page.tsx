import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const HomePage: React.FC = () => {
    return (
        <div className={styles.container}>
            <h1>Welcome to StarBond</h1>
            <p>Your one-stop solution for pasting and shortening URLs.</p>
            <div className={styles.links}>
                <Link href="/(auth)/login">Login</Link>
                <Link href="/(auth)/register">Register</Link>
                <Link href="/(dashboard)">Dashboard</Link>
            </div>
        </div>
    );
};

export default HomePage;