import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container">
      <section className="hero">
        <h1>StarBond</h1>
        <p>
          A professional Pastebin + URL shortener with visibility controls, expiry options, burn-after-read,
          analytics, and secure account ownership.
        </p>
        <div className="toolbar">
          <Link className="button" href="/register">
            Get Started
          </Link>
          <Link className="button ghost" href="/dashboard">
            Open Dashboard
          </Link>
        </div>
      </section>
      <section className="grid-3">
        <article className="card">
          <h3>Pastebin</h3>
          <p>Create code/text pastes with raw view, password lock, expiry, and burn-after-read.</p>
        </article>
        <article className="card">
          <h3>URL Shortener</h3>
          <p>Short links with custom aliases, limits, expiry, and 301/302 redirects.</p>
        </article>
        <article className="card">
          <h3>Analytics</h3>
          <p>Track clicks, last activity, referrer, and user agent summary per link.</p>
        </article>
      </section>
      <div className="toolbar">
        <Link href="/pastes">Recent Public Pastes</Link>
        <Link href="/urls">Recent Public Links</Link>
      </div>
    </div>
  );
}
