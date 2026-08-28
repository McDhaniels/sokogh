import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Phone, Lock, User, ShieldCheck, ArrowLeft } from "lucide-react";

export default function Auth() {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

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
            <button key={m} onClick={() => setMode(m)} className="tab-btn flex-1 pb-3 text-center font-display text-sm font-semibold" style={{ color: mode === m ? "var(--text)" : "var(--muted)" }}>
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
          <div className="tab-underline absolute bottom-0 h-0.5 w-1/2" style={{ background: "var(--gold)", transform: mode === "signin" ? "translateX(0%)" : "translateX(100%)" }} />
        </div>

        {mode === "signup" && (
          <div className="field mb-4 flex items-center gap-2 rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
            <User size={16} style={{ color: "var(--muted)" }} />
            <input type="text" placeholder="Full name" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
          </div>
        )}

        <div className="field mb-4 flex items-center gap-2 rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
          <Phone size={16} style={{ color: "var(--muted)" }} />
          <span className="text-sm" style={{ color: "var(--muted)" }}>+233</span>
          <div className="h-4 w-px" style={{ background: "rgba(245,240,232,0.14)" }} />
          <input type="tel" placeholder="24 123 4567" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
        </div>

        <div className="field mb-2 flex items-center gap-2 rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
          <Lock size={16} style={{ color: "var(--muted)" }} />
          <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
          <button onClick={() => setShowPassword((v) => !v)} type="button" aria-label="Toggle password visibility">
            {showPassword ? <EyeOff size={16} style={{ color: "var(--muted)" }} /> : <Eye size={16} style={{ color: "var(--muted)" }} />}
          </button>
        </div>

        {mode === "signin" && (
          <div className="mb-6 text-right"><a href="#" className="text-xs" style={{ color: "var(--gold)" }}>Forgot password?</a></div>
        )}

        {mode === "signup" && (
          <label className="mb-6 mt-3 flex cursor-pointer items-start gap-2 text-xs" style={{ color: "var(--muted)" }}>
            <input type="checkbox" checked={agreed} onChange={() => setAgreed((v) => !v)} className="mt-0.5 accent-[#D4A544]" />
            <span>I agree to SokoGH's Terms and understand SokoGH only advertises listings — it does not process payments or guarantee any deal between buyers and sellers.</span>
          </label>
        )}

        <button className="primary-btn w-full rounded-full py-3 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }} disabled={mode === "signup" && !agreed}>
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>

        <div className="mt-6 flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: "rgba(27,67,50,0.4)", background: "rgba(27,67,50,0.15)" }}>
          <ShieldCheck size={16} style={{ color: "var(--gold)" }} />
          <p className="text-xs" style={{ color: "var(--muted)" }}>Verified accounts get a badge buyers trust — you can verify later from your profile.</p>
        </div>
      </div>
    </div>
  );
}
