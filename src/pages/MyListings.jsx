import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, MessageCircle, Pencil, Trash2, Rocket, Plus, MapPin, Clock, ArrowLeft } from "lucide-react";

const TABS = ["Active", "Pending review", "Rejected", "Sold"];

const LISTINGS = {
  "Active": [
    { title: "iPhone 13 Pro — 256GB", price: "GH₵ 4,200", location: "Kumasi", views: 342, messages: 12, posted: "5 days ago", hue: "from-amber-500/25 to-amber-900/10" },
    { title: "HP Laptop — Core i7", price: "GH₵ 3,800", location: "Accra", views: 118, messages: 4, posted: "2 weeks ago", hue: "from-emerald-500/20 to-emerald-900/10" },
  ],
  "Pending review": [
    { title: "Bedroom Furniture Set", price: "GH₵ 5,400", location: "Cape Coast", views: 0, messages: 0, posted: "Just now", hue: "from-stone-500/25 to-stone-900/10" },
  ],
  "Rejected": [
    { title: "Unlocked Android Phone", price: "GH₵ 900", location: "Tema", views: 0, messages: 0, posted: "3 days ago", reason: "Photos unclear — please re-upload", hue: "from-amber-500/15 to-emerald-900/10" },
  ],
  "Sold": [
    { title: "PlayStation 5", price: "GH₵ 5,200", location: "Accra", views: 560, messages: 31, posted: "1 month ago", hue: "from-emerald-500/15 to-amber-900/10" },
  ],
};

const STATUS_COLOR = {
  "Active": { bg: "rgba(212,165,68,0.15)", text: "var(--gold)" },
  "Pending review": { bg: "rgba(154,148,136,0.15)", text: "var(--muted)" },
  "Rejected": { bg: "rgba(200,80,80,0.15)", text: "#D97066" },
  "Sold": { bg: "rgba(27,67,50,0.3)", text: "#7FB79A" },
};

export default function MyListings() {
  const [tab, setTab] = useState("Active");

  return (
    <div className="min-h-screen w-full font-body">
      <header className="border-b px-5 py-4" style={{ borderColor: "rgba(245,240,232,0.08)" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}><ArrowLeft size={14} /> Home</Link>
          <span className="font-display text-lg font-semibold" style={{ color: "var(--gold)" }}>My Listings</span>
          <Link to="/post-ad" className="flex items-center gap-1 rounded-full px-4 py-2 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>
            <Plus size={15} /> Post an ad
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        <div className="mb-6 flex gap-6 border-b" style={{ borderColor: "rgba(245,240,232,0.1)" }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className="border-b-2 pb-3 font-display text-sm font-medium" style={{ borderColor: tab === t ? "var(--gold)" : "transparent", color: tab === t ? "var(--text)" : "var(--muted)" }}>
              {t} <span className="ml-1 text-xs" style={{ color: "var(--muted)" }}>({LISTINGS[t].length})</span>
            </button>
          ))}
        </div>

        {LISTINGS[tab].length === 0 ? (
          <p className="py-16 text-center text-sm" style={{ color: "var(--muted)" }}>Nothing here yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {LISTINGS[tab].map((item, i) => (
              <div key={i} className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
                <div className={`h-20 w-full shrink-0 rounded-xl bg-gradient-to-br sm:w-28 ${item.hue}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-sm font-semibold">{item.title}</h3>
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: STATUS_COLOR[tab].bg, color: STATUS_COLOR[tab].text }}>{tab}</span>
                  </div>
                  <p className="mt-1 font-display text-sm font-semibold" style={{ color: "var(--gold)" }}>{item.price}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {item.posted}</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {item.views} views</span>
                    <span className="flex items-center gap-1"><MessageCircle size={12} /> {item.messages} messages</span>
                  </p>
                  {item.reason && <p className="mt-1 text-xs" style={{ color: "#D97066" }}>Reason: {item.reason}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
                  {tab === "Active" && <button className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}><Rocket size={14} /> Boost</button>}
                  <button className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}><Pencil size={14} /> Edit</button>
                  <button className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
