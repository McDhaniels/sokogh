import { useState } from "react";
import { MailWarning, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function VerifyEmailPrompt({ message }) {
  const { user, resendVerification, refreshUser } = useAuth();
  const [resendSent, setResendSent] = useState(false);
  const [checking, setChecking] = useState(false);

  async function handleResend() {
    await resendVerification();
    setResendSent(true);
  }

  async function handleCheck() {
    setChecking(true);
    await refreshUser();
    setChecking(false);
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border p-6 text-center" style={{ borderColor: "rgba(212,165,68,0.4)", background: "rgba(212,165,68,0.08)" }}>
      <MailWarning size={26} style={{ color: "var(--gold)" }} />
      <p className="max-w-sm text-sm" style={{ color: "var(--text)" }}>
        {message || `Verify ${user?.email} first.`}
      </p>
      <p className="max-w-sm text-xs" style={{ color: "var(--muted)" }}>
        Check your inbox — and your spam or junk folder, just in case — for an email from Firebase.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={handleCheck} disabled={checking} className="flex items-center justify-center gap-2 rounded-full px-5 py-2 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>
          {checking && <Loader2 size={14} className="animate-spin" />} I've verified — check again
        </button>
        <button onClick={handleResend} disabled={resendSent} className="rounded-full border px-5 py-2 text-sm" style={{ borderColor: "rgba(245,240,232,0.15)", color: "var(--muted)" }}>
          {resendSent ? "Link resent" : "Resend link"}
        </button>
      </div>
    </div>
  );
}
