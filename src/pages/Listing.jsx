import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, BadgeCheck, ShieldCheck, MessageCircle, Heart, Share2, Flag, ChevronRight, Star, Clock } from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const THUMBS = [
  "from-amber-500/25 to-amber-900/10",
  "from-emerald-500/20 to-emerald-900/10",
  "from-stone-500/25 to-stone-900/10",
  "from-amber-500/15 to-emerald-900/10",
];

const SIMILAR = [
  { title: "iPhone 12 — 128GB", price: "GH₵ 2,900", location: "Accra", hue: "from-emerald-500/20 to-emerald-900/10" },
  { title: "Samsung Galaxy S22", price: "GH₵ 3,600", location: "Tema", hue: "from-stone-500/25 to-stone-900/10" },
  { title: "iPhone 13 — 128GB", price: "GH₵ 3,700", location: "Kumasi", hue: "from-amber-500/20 to-stone-900/10" },
];

export default function Listing() {
  const [activeThumb, setActiveThumb] = useState(0);
  const [saved, setSaved] = useState(false);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="min-h-screen w-full font-body">
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-5 flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
          <Link to="/" style={{ color: "var(--muted)" }}>Home</Link>
          <ChevronRight size={12} />
          <Link to="/category" style={{ color: "var(--muted)" }}>Electronics</Link>
          <ChevronRight size={12} />
          <span style={{ color: "var(--text)" }}>iPhone 13 Pro — 256GB</span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className={`flex h-80 items-center justify-center rounded-2xl bg-gradient-to-br sm:h-[420px] ${THUMBS[activeThumb]}`}>
              <span className="text-sm" style={{ color: "var(--muted)" }}>Photo {activeThumb + 1}</span>
            </div>
            <div className="mt-3 flex gap-3">
              {THUMBS.map((hue, i) => (
                <button key={i} className={`thumb h-16 w-16 rounded-xl border-2 bg-gradient-to-br ${hue} ${i === activeThumb ? "active" : ""}`} style={{ borderColor: i === activeThumb ? "var(--gold)" : "rgba(245,240,232,0.15)" }} onClick={() => setActiveThumb(i)} />
              ))}
            </div>

            <div className="mt-8 flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-semibold sm:text-3xl">iPhone 13 Pro — 256GB</h1>
                <p className="mt-2 flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}>
                  <MapPin size={14} /> Kumasi, Ashanti Region<span className="mx-2">·</span><Clock size={14} /> Posted 2 days ago
                </p>
              </div>
              <div className="flex gap-2">
                <button className="cta-btn flex h-10 w-10 items-center justify-center rounded-full border" style={{ borderColor: "rgba(245,240,232,0.15)", color: saved ? "var(--gold)" : "var(--muted)" }} onClick={() => setSaved((v) => !v)}>
                  <Heart size={16} fill={saved ? "var(--gold)" : "none"} />
                </button>
                <button className="cta-btn flex h-10 w-10 items-center justify-center rounded-full border" style={{ borderColor: "rgba(245,240,232,0.15)", color: "var(--muted)" }}>
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            <p className="mt-4 font-display text-3xl font-semibold" style={{ color: "var(--gold)" }}>GH₵ 4,200</p>

            <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
              <h2 className="mb-2 font-display text-sm font-semibold">Description</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Clean iPhone 13 Pro, 256GB, Sierra Blue. No cracks, screen in great condition,
                battery health 91%. Comes with original box and charging cable. Genuine reason
                for sale — upgrading. Price is slightly negotiable for serious buyers only.
                Available for inspection in Kumasi before any payment.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs" style={{ color: "var(--muted)" }}>
                {["Condition: Used — like new", "Storage: 256GB", "Colour: Sierra Blue"].map((tag) => (
                  <span key={tag} className="rounded-full border px-3 py-1" style={{ borderColor: "rgba(245,240,232,0.14)" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-semibold" style={{ background: "var(--surface-2)", color: "var(--gold)" }}>KA</div>
                <div>
                  <div className="flex items-center gap-1 font-display text-sm font-semibold">Kwame A. <BadgeCheck size={14} style={{ color: "var(--gold)" }} /></div>
                  <p className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}><Star size={12} fill="var(--gold)" style={{ color: "var(--gold)" }} /> 4.8 · Member since 2024</p>
                </div>
              </div>
              <Link to="/messages" className="cta-btn mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2.5 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>
                <MessageCircle size={16} /> Message seller
              </Link>
              <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border py-2.5 text-sm" style={{ borderColor: "rgba(245,240,232,0.15)", color: "var(--muted)" }} onClick={() => setRevealed(true)}>
                {revealed ? "024 123 4567" : "Reveal phone number"}
              </button>
            </div>

            <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(27,67,50,0.4)", background: "linear-gradient(135deg, rgba(27,67,50,0.3), rgba(15,14,12,0.15))" }}>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} style={{ color: "var(--gold)" }} />
                <h3 className="font-display text-sm font-semibold">Deal safely</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                SokoGH doesn't handle payments. Meet the seller in a public place, inspect the
                item before paying, and never send money in advance to someone you haven't met.
              </p>
              <button className="mt-3 flex items-center gap-1 text-xs" style={{ color: "var(--gold)" }}><Flag size={12} /> Report this listing</button>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="mb-4 font-display text-xl font-semibold">Similar listings</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {SIMILAR.map((item, i) => (
              <Link to="/listing" key={i} className="similar-card overflow-hidden rounded-2xl border block" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
                <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${item.hue}`}>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>Photo</span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-medium">{item.title}</h3>
                  <p className="mt-2 font-display text-sm font-semibold" style={{ color: "var(--gold)" }}>{item.price}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}><MapPin size={12} /> {item.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
