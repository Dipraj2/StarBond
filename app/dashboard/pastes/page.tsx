"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PasteItem = {
  id: number;
  title: string;
  slug: string;
  language: string;
  visibility: string;
  createdAt: string;
  views: number;
};

export default function DashboardPastesPage() {
  const [items, setItems] = useState<PasteItem[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (query = "") => {
    setLoading(true);
    const res = await fetch(`/api/pastes?mine=1&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to load pastes");
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
    const res = await fetch(`/api/pastes?id=${id}`, { method: "DELETE" });
    if (res.ok) setItems((v) => v.filter((item) => item.id !== id));
  };

  const rename = async (id: number) => {
    const title = window.prompt("New title");
    if (!title) return;
    const res = await fetch("/api/pastes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title }),
    });
    if (res.ok) void load(q);
  };

  return (
    <div className="container">
      <h1>My Pastes</h1>
      <div className="toolbar">
        <input className="input" placeholder="Search title/content" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="button" onClick={() => void load(q)}>
          Search
        </button>
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      {loading ? <p>Loading...</p> : null}
      {!loading && items.length === 0 ? <p>No pastes found.</p> : null}
      <ul>
        {items.map((paste) => (
          <li key={paste.id} className="card">
            <h3>{paste.title}</h3>
            <p>
              {paste.visibility} • {paste.language} • {paste.views} views
            </p>
            <div className="toolbar">
              <Link href={`/paste/${paste.slug}`}>Open</Link>
              <Link href={`/api/pastes/raw/${paste.slug}`}>Raw</Link>
              <button className="button ghost" onClick={() => void rename(paste.id)}>
                Edit
              </button>
              <button className="button danger" onClick={() => void remove(paste.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
