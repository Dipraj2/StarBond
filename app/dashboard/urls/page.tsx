"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UrlClick = { id: number; createdAt: string; referrer: string | null; userAgent: string | null };
type UrlItem = {
  id: number;
  slug: string;
  originalUrl: string;
  redirectType: "TEMPORARY" | "PERMANENT";
  visibility: "PUBLIC" | "UNLISTED" | "PRIVATE";
  clicks: number;
  clickLimit: number | null;
  createdAt: string;
  expiresAt: string | null;
  lastClickedAt: string | null;
  analytics: UrlClick[];
};

export default function DashboardUrlsPage() {
  const [items, setItems] = useState<UrlItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/urls?mine=1");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to load links");
      setLoading(false);
      return;
    }
    setItems(data.items ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const remove = async (id: number) => {
    const res = await fetch(`/api/urls?id=${id}`, { method: "DELETE" });
    if (res.ok) setItems((v) => v.filter((item) => item.id !== id));
  };

  return (
    <div className="container">
      <h1>My Short Links</h1>
      {error ? <p className="error-text">{error}</p> : null}
      {loading ? <p>Loading...</p> : null}
      {!loading && items.length === 0 ? <p>No links yet.</p> : null}
      <ul>
        {items.map((url) => (
          <li key={url.id} className="card">
            <h3>
              <Link href={`/s/${url.slug}`}>{`/s/${url.slug}`}</Link>
            </h3>
            <p>{url.originalUrl}</p>
            <p>
              {url.clicks} clicks • {url.redirectType} • {url.visibility}
            </p>
            <p>
              Last click: {url.lastClickedAt ? new Date(url.lastClickedAt).toLocaleString() : "never"}
              {url.clickLimit ? ` • limit ${url.clickLimit}` : ""}
            </p>
            {url.analytics.length > 0 ? (
              <details>
                <summary>Recent analytics</summary>
                <ul>
                  {url.analytics.map((a) => (
                    <li key={a.id}>
                      {new Date(a.createdAt).toLocaleString()} • {a.referrer || "direct"} • {(a.userAgent || "").slice(0, 70)}
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
            <button className="button danger" onClick={() => void remove(url.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
