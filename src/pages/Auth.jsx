import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Phone, Lock, User, Mail, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Auth() {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetSending, setResetSending] = useState(false);

  const { signUp, signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (mode === "signup" && !agreed) {
      setError("Please agree to the terms to continue.");
      return;
    }

    setSubmitting(true);
    const result = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password, fullName);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else if (mode === "signup") {
      setInfo("Account created! We've sent a verification link to your email — you'll need to verify it before posting an ad or messaging a seller.");
      navigate("/");
    } else {
      navigate("/");
    }
  }

  async function handleForgotPassword() {
    setError("");
    setInfo("");
    if (!email) {
      setError("Type your email above first, then tap \"Forgot password?\" again.");
      return;
    }
    setResetSending(true);
    const result = await resetPassword(email);
    setResetSending(false);
    if (result.error) {
      setError(result.error);
    } else {
      setInfo("Password reset link sent — check your email.");
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-5 py-10 font-body">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}>
          <ArrowLeft size={14} /> Back to SokoGH
        </Link>

        <div className="mb-8 flex items-center gap-1">
          <span className="font-mark text-2xl" style={{ color: "var(--gold)" }}>Soko</span>
          <span className="font-display text-2xl font-semibold">GH</span>
        </div>

        <div className="relative mb-8 flex border-b" style={{ borderColor: "rgba(245,240,232,0.1)" }}>
          {["signin", "signup"].map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); setError(""); }} className="tab-btn flex-1 pb-3 text-center font-display text-sm font-semibold" style={{ color: mode === m ? "var(--text)" : "var(--muted)" }}>
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
          <div className="tab-underline absolute bottom-0 h-0.5 w-1/2" style={{ background: "var(--gold)", transform: mode === "signin" ? "translateX(0%)" : "translateX(100%)" }} />
        </div>

        {error && (
          <div className="mb-4 rounded-xl border px-4 py-3 text-xs" style={{ borderColor: "rgba(200,80,80,0.4)", background: "rgba(200,80,80,0.1)", color: "#D97066" }}>
            {error}
          </div>
        )}
        {info && (
          <div className="mb-4 rounded-xl border px-4 py-3 text-xs" style={{ borderColor: "rgba(27,67,50,0.4)", background: "rgba(27,67,50,0.15)", color: "var(--text)" }}>
            {info}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="field mb-4 flex items-center gap-2 rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
              <User size={16} style={{ color: "var(--muted)" }} />
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Full name" required className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
            </div>
          )}

          {mode === "signup" && (
            <div className="field mb-4 flex items-center gap-2 rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
              <Phone size={16} style={{ color: "var(--muted)" }} />
              <span className="text-sm" style={{ color: "var(--muted)" }}>+233</span>
              <div className="h-4 w-px" style={{ background: "rgba(245,240,232,0.14)" }} />
              <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))} type="tel" placeholder="24 123 4567" required className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
            </div>
          )}

          <div className="field mb-4 flex items-center gap-2 rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
            <Mail size={16} style={{ color: "var(--muted)" }} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" required className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
          </div>

          <div className="field mb-2 flex items-center gap-2 rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
            <Lock size={16} style={{ color: "var(--muted)" }} />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="Password (min. 6 characters)" minLength={6} required className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
            <button onClick={() => setShowPassword((v) => !v)} type="button" aria-label="Toggle password visibility">
              {showPassword ? <EyeOff size={16} style={{ color: "var(--muted)" }} /> : <Eye size={16} style={{ color: "var(--muted)" }} />}
            </button>
          </div>

          {mode === "signin" && (
            <div className="mb-6 text-right">
              <button type="button" onClick={handleForgotPassword} disabled={resetSending} className="text-xs" style={{ color: "var(--gold)" }}>
                {resetSending ? "Sending…" : "Forgot password?"}
              </button>
            </div>
          )}

          {mode === "signup" && (
            <label className="mb-6 mt-3 flex cursor-pointer items-start gap-2 text-xs" style={{ color: "var(--muted)" }}>
              <input type="checkbox" checked={agreed} onChange={() => setAgreed((v) => !v)} className="mt-0.5 accent-[#D4A544]" />
              <span>I agree to SokoGH's Terms and understand SokoGH only advertises listings — it does not process payments or guarantee any deal between buyers and sellers.</span>
            </label>
          )}

          <button type="submit" disabled={submitting} className="primary-btn flex w-full items-center justify-center gap-2 rounded-full py-3 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: "rgba(27,67,50,0.4)", background: "rgba(27,67,50,0.15)" }}>
          <ShieldCheck size={16} style={{ color: "var(--gold)" }} />
          <p className="text-xs" style={{ color: "var(--muted)" }}>Verified accounts get a badge buyers trust — you can verify later from your profile.</p>
        </div>
      </div>
    </div>
  );
}
