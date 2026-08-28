import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, MessageCircle, Handshake, ShieldCheck, MapPin, Eye,
  Ban, PhoneOff, AlertTriangle, Flag, ArrowLeft,
} from "lucide-react";

const HOW_IT_WORKS = [
  { icon: Search, title: "Browse or search", text: "Find what you need by category, location, or a quick search — no account needed to look around." },
  { icon: MessageCircle, title: "Message the seller", text: "Reach out directly on SokoGH, or via WhatsApp/phone if the seller allows it. Ask your questions before agreeing to anything." },
  { icon: Handshake, title: "Meet and deal directly", text: "Inspect the item in person, agree a price, and pay the seller directly. SokoGH never touches your money." },
];

const DO_LIST = [
  { icon: MapPin, text: "Meet in a public, well-lit place — a mall, a busy shop, a police station forecourt." },
  { icon: Eye, text: "Inspect the item fully before paying anything — test it, check for damage." },
  { icon: ShieldCheck, text: "Prefer sellers with a verified badge and good ratings when you can." },
];

const DONT_LIST = [
  { icon: PhoneOff, text: "Don't send money, momo, or deposits before you've seen the item in person." },
  { icon: Ban, text: "Don't deal with anyone who pressures you to hurry or avoid meeting face-to-face." },
  { icon: AlertTriangle, text: "Don't ignore your instincts — if a price feels too good to be true, it usually is." },
];

export default function Info() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") === "safety" ? "safety" : "how");

  return (
    <div className="min-h-screen w-full font-body">
      <header className="border-b px-5 py-4" style={{ borderColor: "rgba(245,240,232,0.08)" }}>
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/" className="flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}><ArrowLeft size={14} /> Back to SokoGH</Link>
          <div className="flex items-center gap-1">
            <span className="font-mark text-lg" style={{ color: "var(--gold)" }}>Soko</span>
            <span className="font-display text-lg font-semibold">GH</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10">
        <h1 className="mb-2 text-center font-display text-3xl font-semibold">How SokoGH works</h1>
        <p className="mb-8 text-center text-sm" style={{ color: "var(--muted)" }}>We connect buyers and sellers — you handle the deal, we help you do it safely.</p>

        <div className="mx-auto mb-10 flex w-fit gap-1 rounded-full border p-1" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
          {[{ id: "how", label: "How it works" }, { id: "safety", label: "Safety tips" }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="rounded-full px-5 py-2 font-display text-sm font-medium" style={{ background: tab === t.id ? "var(--gold)" : "transparent", color: tab === t.id ? "#0F0E0C" : "var(--muted)" }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "how" && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="rounded-2xl border p-6" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl font-display text-sm font-semibold" style={{ background: "rgba(212,165,68,0.15)", color: "var(--gold)" }}>{i + 1}</div>
                <Icon size={20} style={{ color: "var(--gold)" }} className="mb-3" />
                <h3 className="mb-2 font-display text-base font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{text}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "safety" && (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 font-display text-lg font-semibold" style={{ color: "var(--gold)" }}>Do</h2>
                <div className="flex flex-col gap-3">
                  {DO_LIST.map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-2xl border p-4" style={{ borderColor: "rgba(27,67,50,0.4)", background: "rgba(27,67,50,0.15)" }}>
                      <Icon size={18} style={{ color: "var(--gold)" }} className="mt-0.5 shrink-0" />
                      <p className="text-sm" style={{ color: "var(--text)" }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="mb-4 font-display text-lg font-semibold" style={{ color: "#D97066" }}>Don't</h2>
                <div className="flex flex-col gap-3">
                  {DONT_LIST.map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-2xl border p-4" style={{ borderColor: "rgba(200,80,80,0.3)", background: "rgba(200,80,80,0.08)" }}>
                      <Icon size={18} style={{ color: "#D97066" }} className="mt-0.5 shrink-0" />
                      <p className="text-sm" style={{ color: "var(--text)" }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border p-4 text-sm" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)", color: "var(--muted)" }}>
              <Flag size={15} style={{ color: "var(--gold)" }} />
              See something suspicious? Use "Report this listing" on any ad — every report is reviewed by our team.
            </div>
          </>
        )}
      </main>
    </div>
  );
}
