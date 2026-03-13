import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    <Link href="/">StarBond</Link>
                </h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/(auth)/login">Login</Link>
                        </li>
                        <li>
                            <Link href="/(auth)/register">Register</Link>
                        </li>
                        <li>
                            <Link href="/(dashboard)">Dashboard</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;