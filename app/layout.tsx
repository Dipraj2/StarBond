import React from "react";
import Header from "../components/header";
import "../styles/globals.css";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header />
        <main className="main-shell">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
