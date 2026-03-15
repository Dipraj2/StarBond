"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

type PasteItem = {
  id: number;
  title: string;
  content: string;
  language: string;
  slug: string;
  visibility: string;
  burnAfterRead: boolean;
  createdAt: string;
};

export default function PastePage() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const [item, setItem] = useState<PasteItem | null>(null);
  const [password, setPassword] = useState(searchParams.get("password") ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const rawUrl = useMemo(
    () => `/api/pastes/raw/${params.slug}${password ? `?password=${encodeURIComponent(password)}` : ""}`,
    [params.slug, password]
  );

  const load = async () => {
    setLoading(true);
    const url = `/api/pastes/slug/${params.slug}${password ? `?password=${encodeURIComponent(password)}` : ""}`;
    const res = await fetch(url);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Failed to load paste");
      setLoading(false);
      return;
    }
    setItem(data.item ?? null);
    setError("");
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const copy = async () => {
    if (!item) return;
    await navigator.clipboard.writeText(item.content);
  };

  return (
    <div className="container">
      {item ? <h1>{item.title}</h1> : <h1>Paste</h1>}
      {error ? (
        <div className="card">
          <p className="error-text">{error}</p>
          <input className="input" placeholder="Password (if protected)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="button" onClick={() => void load()}>
            Unlock
          </button>
        </div>
      ) : null}
      {loading ? <p>Loading...</p> : null}
      {item ? (
        <div className="card">
          <div className="toolbar">
            <span>
              {item.language} • {item.visibility} • {item.burnAfterRead ? "Burn after read" : "Persistent"}
            </span>
            <div className="toolbar">
              <button className="button ghost" onClick={() => void copy()}>
                Copy
              </button>
              <Link href={rawUrl}>Raw</Link>
            </div>
          </div>
          <pre className={`code-block language-${item.language}`}>{item.content}</pre>
        </div>
      ) : null}
    </div>
  );
}
