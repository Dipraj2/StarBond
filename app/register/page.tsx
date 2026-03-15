"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const data: { error?: string } = await response.json();
      setError(data.error ?? "Registration failed");
      setBusy(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="container">
      <h1>Create account</h1>
      <form onSubmit={handleSubmit}>
        <input className="input" type="text" placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" minLength={8} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error ? <p className="error-text">{error}</p> : null}
        <button className="button" type="submit" disabled={busy}>
          {busy ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}
