import { useState } from "react";
import { Check, X, MapPin, Clock, ShieldCheck, AlertTriangle } from "lucide-react";

const INITIAL_QUEUE = [
  { id: 1, title: "Bedroom Furniture Set", price: "GH₵ 5,400", location: "Cape Coast", seller: "Nana Yeboah", posted: "3 min ago", category: "Home & Furniture", flag: null, hue: "from-amber-500/25 to-amber-900/10" },
  { id: 2, title: "Unlocked Android Phone", price: "GH₵ 900", location: "Tema", seller: "Kwesi Appiah", posted: "20 min ago", category: "Electronics", flag: "Photo looks blurry", hue: "from-emerald-500/20 to-emerald-900/10" },
  { id: 3, title: "2019 Honda Civic", price: "GH₵ 92,000", location: "Accra", seller: "Abena Frimpong", posted: "1 hour ago", category: "Vehicles", flag: null, hue: "from-stone-500/25 to-stone-900/10" },
  { id: 4, title: "Investment opportunity — double your money", price: "GH₵ 500", location: "Kumasi", seller: "New account", posted: "2 hours ago", category: "Services", flag: "Possible scam wording", hue: "from-amber-500/15 to-emerald-900/10" },
];

const REJECT_REASONS = ["Unclear photos", "Suspicious / scam wording", "Wrong category", "Prohibited item", "Duplicate listing"];

export default function AdminReview() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [rejectingId, setRejectingId] = useState(null);

  function approve(id) { setQueue((q) => q.filter((item) => item.id !== id)); }
  function reject(id) { setQueue((q) => q.filter((item) => item.id !== id)); setRejectingId(null); }

  return (
    <div className="min-h-screen w-full font-body">
      <header className="border-b px-5 py-4" style={{ borderColor: "rgba(245,240,232,0.08)" }}>
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} style={{ color: "var(--gold)" }} />
            <span className="font-display text-lg font-semibold">Admin — Review Queue</span>
          </div>
          <span className="rounded-full px-3 py-1 font-display text-xs font-semibold" style={{ background: "var(--surface-2)", color: "var(--gold)" }}>{queue.length} pending</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <Check size={32} style={{ color: "var(--gold)" }} />
            <p className="font-display text-lg font-semibold">Queue clear</p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>No listings waiting for review right now.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {queue.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-2xl border" style={{ borderColor: item.flag ? "rgba(200,80,80,0.4)" : "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
                <div className="flex flex-col gap-4 p-4 sm:flex-row">
                  <div className={`h-24 w-full shrink-0 rounded-xl bg-gradient-to-br sm:w-32 ${item.hue}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-sm font-semibold">{item.title}</h3>
                      <span className="rounded-full border px-2 py-0.5 text-xs" style={{ borderColor: "rgba(245,240,232,0.14)", color: "var(--muted)" }}>{item.category}</span>
                    </div>
                    <p className="mt-1 font-display text-sm font-semibold" style={{ color: "var(--gold)" }}>{item.price}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {item.posted}</span>
                      <span>by {item.seller}</span>
                    </p>
                    {item.flag && <p className="mt-2 flex items-center gap-1 text-xs" style={{ color: "#D97066" }}><AlertTriangle size={12} /> Auto-flagged: {item.flag}</p>}
                  </div>
                  <div className="flex shrink-0 gap-2 sm:flex-col">
                    <button onClick={() => approve(item.id)} className="flex flex-1 items-center justify-center gap-1 rounded-full px-4 py-2 font-display text-xs font-semibold sm:flex-none" style={{ background: "var(--gold)", color: "#0F0E0C" }}><Check size={14} /> Approve</button>
                    <button onClick={() => setRejectingId(rejectingId === item.id ? null : item.id)} className="flex flex-1 items-center justify-center gap-1 rounded-full border px-4 py-2 font-display text-xs font-semibold sm:flex-none" style={{ borderColor: "rgba(245,240,232,0.2)", color: "var(--muted)" }}><X size={14} /> Reject</button>
                  </div>
                </div>

                {rejectingId === item.id && (
                  <div className="border-t p-4" style={{ borderColor: "rgba(245,240,232,0.08)", background: "var(--surface-2)" }}>
                    <p className="mb-2 text-xs" style={{ color: "var(--muted)" }}>Reason for rejection (seller will see this):</p>
                    <div className="flex flex-wrap gap-2">
                      {REJECT_REASONS.map((reason) => (
                        <button key={reason} onClick={() => reject(item.id)} className="rounded-full border px-3 py-1.5 text-xs" style={{ borderColor: "rgba(245,240,232,0.14)", color: "var(--text)" }}>{reason}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
