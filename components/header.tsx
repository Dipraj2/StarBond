"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/logout-button";
import ThemeToggle from "@/components/theme-toggle";

type HeaderUser = { id: number; email: string; name?: string | null } | null;

export default function Header() {
  const [user, setUser] = useState<HeaderUser | undefined>(undefined);

  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (!active) return;
      if (!response.ok) {
        setUser(null);
        return;
      }
      const data = await response.json();
      setUser(data.user ?? null);
    };
    void loadUser();
    return () => {
      active = false;
    };
  }, []);

  const displayName =
    user && (user.name?.trim() || user.email.split("@")[0]);

  return (
    <header className="header">
      <div className="container header-inner">
        <strong className="brand">
          <Link href="/" className="logo-wordmark" aria-label="StarBond">
            <span className="logo-star">Star</span>
            <span className="logo-bond">Bond</span>
          </Link>
        </strong>
        <nav className="header-nav">
          <ThemeToggle />
          {user ? (
            <>
              <span className="header-user">Hi, {displayName}</span>
              <Link className="header-link" href="/dashboard">
                Dashboard
              </Link>
              <Link className="header-link" href="/dashboard/pastes">
                My Pastes
              </Link>
              <Link className="header-link" href="/dashboard/urls">
                My Links
              </Link>
              <LogoutButton />
            </>
          ) : user === null ? (
            <>
              <Link className="header-link" href="/login">
                Login
              </Link>
              <Link className="header-link" href="/register">
                Register
              </Link>
            </>
          ) : (
            <span className="header-loading">...</span>
          )}
        </nav>
      </div>
    </header>
  );
}
