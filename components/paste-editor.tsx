"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function PasteEditor() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, visibility }),
    });

    if (!response.ok) {
      const data: { error?: string } = await response.json();
      setError(data.error ?? "Failed to create paste");
      return;
    }

    const data: { slug: string } = await response.json();
    router.push(`/paste/${data.slug}`);
  };

  return (
    <div className="paste-editor">
      <h2>Create Paste</h2>
      <form onSubmit={handleSubmit}>
        <input className="input" type="text" id="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="textarea" id="content" placeholder="Paste content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <select className="input" id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value="PUBLIC">Public</option>
          <option value="UNLISTED">Unlisted</option>
          <option value="PRIVATE">Private</option>
        </select>
        {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
        <button className="button" type="submit">
          Create Paste
        </button>
      </form>
    </div>
  );
}
