import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="container" style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>
          <Link href="/">StarBond</Link>
        </strong>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/pastes">Pastes</Link>
          <Link href="/dashboard/urls">Links</Link>
        </nav>
      </div>
    </header>
  );
}
