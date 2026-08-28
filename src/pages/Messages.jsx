import { useState } from "react";
import { Search, Send, ShieldAlert, MoreVertical, ArrowLeft } from "lucide-react";

const CONVERSATIONS = [
  { name: "Ama Boateng", listing: "iPhone 13 Pro — 256GB", price: "GH₵ 4,200", last: "Is it still available?", time: "2m", unread: 2, hue: "from-amber-500/25 to-amber-900/10" },
  { name: "Kojo Mensah", listing: "Toyota Corolla 2016", price: "GH₵ 68,000", last: "Can I come see it Saturday?", time: "1h", unread: 0, hue: "from-emerald-500/20 to-emerald-900/10" },
  { name: "Efua Owusu", listing: "3-Bedroom Self-Contained", price: "GH₵ 2,500/mo", last: "You: Yes, still available", time: "3h", unread: 0, hue: "from-stone-500/25 to-stone-900/10" },
  { name: "Yaw Darko", listing: "PlayStation 5", price: "GH₵ 5,200", last: "Ok thank you!", time: "1d", unread: 0, hue: "from-amber-500/20 to-stone-900/10" },
];

const THREAD = [
  { from: "them", text: "Hi, is the iPhone 13 Pro still available?", time: "10:02 AM" },
  { from: "me", text: "Yes it is! Still in great condition.", time: "10:05 AM" },
  { from: "them", text: "Great. Can I come see it this weekend in Kumasi?", time: "10:06 AM" },
  { from: "me", text: "Sure, Saturday afternoon works for me.", time: "10:08 AM" },
  { from: "them", text: "Is it still available?", time: "10:41 AM" },
];

export default function Messages() {
  const [active, setActive] = useState(0);
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const [draft, setDraft] = useState("");

  return (
    <div className="min-h-screen w-full font-body">
      <header className="border-b px-5 py-4" style={{ borderColor: "rgba(245,240,232,0.08)" }}>
        <div className="mx-auto flex max-w-6xl items-center gap-1">
          <span className="font-display text-lg font-semibold" style={{ color: "var(--gold)" }}>Messages</span>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-[320px_1fr]" style={{ height: "calc(100vh - 65px)" }}>
        <aside className={`${mobileThreadOpen ? "hidden" : "flex"} flex-col border-r md:flex`} style={{ borderColor: "rgba(245,240,232,0.08)" }}>
          <div className="p-4">
            <div className="field flex items-center gap-2 rounded-full border px-4 py-2.5" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
              <Search size={15} style={{ color: "var(--muted)" }} />
              <input placeholder="Search conversations…" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {CONVERSATIONS.map((c, i) => (
              <button key={i} onClick={() => { setActive(i); setMobileThreadOpen(true); }} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--surface-2)]" style={{ background: active === i ? "var(--surface-2)" : "transparent" }}>
                <div className={`h-11 w-11 shrink-0 rounded-full bg-gradient-to-br ${c.hue}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-medium">{c.name}</span>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>{c.time}</span>
                  </div>
                  <p className="truncate text-xs" style={{ color: "var(--muted)" }}>{c.listing}</p>
                  <p className="truncate text-xs" style={{ color: c.unread ? "var(--text)" : "var(--muted)" }}>{c.last}</p>
                </div>
                {c.unread > 0 && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-display text-[10px] font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>{c.unread}</span>}
              </button>
            ))}
          </div>
        </aside>

        <div className={`${mobileThreadOpen ? "flex" : "hidden"} flex-col md:flex`}>
          <div className="flex items-center gap-3 border-b px-5 py-3" style={{ borderColor: "rgba(245,240,232,0.08)" }}>
            <button className="md:hidden" onClick={() => setMobileThreadOpen(false)}><ArrowLeft size={18} /></button>
            <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${CONVERSATIONS[active].hue}`} />
            <div className="flex-1">
              <p className="font-display text-sm font-medium">{CONVERSATIONS[active].name}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{CONVERSATIONS[active].listing} · {CONVERSATIONS[active].price}</p>
            </div>
            <MoreVertical size={18} style={{ color: "var(--muted)" }} />
          </div>

          <div className="flex items-center gap-2 px-5 py-2.5 text-xs" style={{ background: "rgba(27,67,50,0.2)", color: "var(--muted)" }}>
            <ShieldAlert size={14} style={{ color: "var(--gold)" }} />
            Never send money before inspecting the item in person. Report anything that feels off.
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
            {THREAD.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm" style={m.from === "me" ? { background: "var(--gold)", color: "#0F0E0C", borderBottomRightRadius: 4 } : { background: "var(--surface)", color: "var(--text)", borderBottomLeftRadius: 4 }}>
                  {m.text}
                  <div className="mt-1 text-[10px] opacity-60">{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t p-4" style={{ borderColor: "rgba(245,240,232,0.08)" }}>
            <div className="field flex-1 rounded-full border px-4 py-2.5" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
              <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message…" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
            </div>
            <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--gold)", color: "#0F0E0C" }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
