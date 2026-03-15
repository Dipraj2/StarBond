"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PasteEditor from "@/components/paste-editor";
import UrlShortenerForm from "@/components/url-shortener-form";

export default function DashboardPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (!active || !response.ok) return;
      const data: { user?: { name?: string | null; email: string } } = await response.json();
      const fullName = data.user?.name?.trim();
      const fallback = data.user?.email?.split("@")[0] ?? null;
      setDisplayName(fullName || fallback);
    };
    void loadUser();
    return () => {
      active = false;
    };
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="container">
      <div className="toolbar">
        <h1>{displayName ? `Dashboard — ${displayName}` : "Dashboard"}</h1>
        <button className="button ghost" onClick={() => void logout()}>
          Logout
        </button>
      </div>
      <p style={{ marginBottom: "1rem" }}>
        <Link href="/dashboard/pastes">My Pastes</Link> | <Link href="/dashboard/urls">My Links</Link>
      </p>

      <div className="card">
        <PasteEditor />
      </div>

      <div className="card">
        <UrlShortenerForm />
      </div>
    </div>
  );
}
