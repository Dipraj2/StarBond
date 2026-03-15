"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function PasteEditor() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("text");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [expiresIn, setExpiresIn] = useState("never");
  const [password, setPassword] = useState("");
  const [burnAfterRead, setBurnAfterRead] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    const response = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        language,
        visibility,
        expiresIn,
        password: password || undefined,
        burnAfterRead,
      }),
    });

    if (!response.ok) {
      const data: { error?: string } = await response.json();
      setError(data.error ?? "Failed to create paste");
      setBusy(false);
      return;
    }

    const data: { item: { slug: string } } = await response.json();
    router.push(`/paste/${data.item.slug}`);
    router.refresh();
  };

  return (
    <div className="paste-editor">
      <h2>Create Paste</h2>
      <form onSubmit={handleSubmit}>
        <input suppressHydrationWarning className="input" type="text" id="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea suppressHydrationWarning className="textarea" id="content" placeholder="Paste content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <div className="grid-2">
          <input suppressHydrationWarning className="input" type="text" placeholder="Language (e.g. js, ts, python)" value={language} onChange={(e) => setLanguage(e.target.value)} />
          <select suppressHydrationWarning className="input" id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            <option value="PUBLIC">Public</option>
            <option value="UNLISTED">Unlisted</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>
        <div className="grid-2">
          <select suppressHydrationWarning className="input" value={expiresIn} onChange={(e) => setExpiresIn(e.target.value)}>
            <option value="never">Never expire</option>
            <option value="10m">Expire in 10 minutes</option>
            <option value="1h">Expire in 1 hour</option>
            <option value="1d">Expire in 1 day</option>
          </select>
          <input
            suppressHydrationWarning
            className="input"
            type="password"
            placeholder="Optional password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <label className="checkbox-row">
          <input suppressHydrationWarning type="checkbox" checked={burnAfterRead} onChange={(e) => setBurnAfterRead(e.target.checked)} /> Burn after first read
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button className="button" type="submit" disabled={busy}>
          {busy ? "Creating..." : "Create Paste"}
        </button>
      </form>
    </div>
  );
}
