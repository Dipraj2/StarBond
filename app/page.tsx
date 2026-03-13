import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container">
      <h1>StarBond</h1>
      <p>Professional pastebin + URL shortener.</p>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}
