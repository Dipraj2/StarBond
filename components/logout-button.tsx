"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const onLogout = async () => {
    if (busy) return;
    setBusy(true);
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      router.push("/login");
      router.refresh();
      return;
    }
    setBusy(false);
  };

  return (
    <button className="button ghost logout-btn" disabled={busy} onClick={() => void onLogout()}>
      {busy ? "Logging out..." : "Logout"}
    </button>
  );
}
