"use client";

import { FormEvent, useState } from "react";

export default function UrlShortenerForm() {
  const [url, setUrl] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [customAlias, setCustomAlias] = useState("");
  const [redirectType, setRedirectType] = useState("TEMPORARY");
  const [expiresAt, setExpiresAt] = useState("");
  const [clickLimit, setClickLimit] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const response = await fetch("/api/urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalUrl: url,
        customAlias: customAlias || undefined,
        visibility,
        redirectType,
        expiresAt: expiresAt || undefined,
        clickLimit: clickLimit ? Number(clickLimit) : undefined,
      }),
    });

    if (!response.ok) {
      const data: { error?: string } = await response.json();
      setError(data.error ?? "Failed to shorten URL");
      setBusy(false);
      return;
    }

    const data: { shortUrl: string } = await response.json();
    setShortenedUrl(data.shortUrl);
    setBusy(false);
  };

  return (
    <div className="url-shortener-form">
      <h2>Shorten URL</h2>
      <form onSubmit={handleSubmit}>
        <input suppressHydrationWarning className="input" type="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
        <div className="grid-2">
          <input suppressHydrationWarning className="input" placeholder="Custom alias (optional)" value={customAlias} onChange={(e) => setCustomAlias(e.target.value)} />
          <select suppressHydrationWarning className="input" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            <option value="PUBLIC">Public</option>
            <option value="UNLISTED">Unlisted</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>
        <div className="grid-2">
          <select suppressHydrationWarning className="input" value={redirectType} onChange={(e) => setRedirectType(e.target.value)}>
            <option value="TEMPORARY">302 Temporary</option>
            <option value="PERMANENT">301 Permanent</option>
          </select>
          <input suppressHydrationWarning className="input" type="number" min={1} placeholder="Click limit (optional)" value={clickLimit} onChange={(e) => setClickLimit(e.target.value)} />
        </div>
        <input suppressHydrationWarning className="input" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
        <button className="button" type="submit" disabled={busy}>
          {busy ? "Creating..." : "Shorten"}
        </button>
      </form>
      {error ? <p className="error-text">{error}</p> : null}
      {shortenedUrl ? (
        <p>
          Shortened URL:{" "}
          <a href={shortenedUrl} target="_blank" rel="noreferrer">
            {shortenedUrl}
          </a>
        </p>
      ) : null}
    </div>
  );
}
