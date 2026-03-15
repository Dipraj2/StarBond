"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data: { error?: string } = await res.json();
      setError(data.error ?? "Login failed");
      setBusy(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="container">
      <h1>Welcome back</h1>
      <form onSubmit={handleLogin}>
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" minLength={8} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error ? <p className="error-text">{error}</p> : null}
        <button className="button" type="submit" disabled={busy}>
          {busy ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
