"use client";

import { FormEvent, useState } from "react";

export default function UrlShortenerForm() {
  const [url, setUrl] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await fetch("/api/urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl: url, visibility }),
    });

    if (!response.ok) {
      const data: { error?: string } = await response.json();
      setError(data.error ?? "Failed to shorten URL");
      return;
    }

    const data: { shortenedUrl: string } = await response.json();
    setShortenedUrl(data.shortenedUrl);
  };

  return (
    <div className="url-shortener-form">
      <h2>Shorten URL</h2>
      <form onSubmit={handleSubmit}>
        <input className="input" type="url" id="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
        <select className="input" id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <button className="button" type="submit">
          Shorten
        </button>
      </form>
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
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
