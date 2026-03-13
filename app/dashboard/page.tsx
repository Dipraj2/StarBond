import Link from "next/link";
import PasteEditor from "@/components/paste-editor";
import UrlShortenerForm from "@/components/url-shortener-form";

export default function DashboardPage() {
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p style={{ marginBottom: "1rem" }}>
        <Link href="/dashboard/pastes">View Pastes</Link> |{" "}
        <Link href="/dashboard/urls">View Links</Link>
      </p>

      <div className="card">
        <PasteEditor />
      </div>

      <div className="card">
        <UrlShortenerForm />
      </div>
    </div>
  );
}
