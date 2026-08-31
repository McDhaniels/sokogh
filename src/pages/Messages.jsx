import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Search, Send, ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { subscribeToConversations, subscribeToMessages, sendMessage } from "../lib/messages.js";

function formatTime(timestamp) {
  if (!timestamp?.toDate) return "";
  const d = timestamp.toDate();
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function Messages() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [conversationsError, setConversationsError] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [mobileThreadOpen, setMobileThreadOpen] = useState(!!conversationId);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToConversations(
      user.uid,
      (list) => {
        setConversations(list);
        setConversationsLoading(false);
      },
      () => {
        setConversationsError(true);
        setConversationsLoading(false);
      }
    );
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    const unsub = subscribeToMessages(conversationId, setMessages);
    return unsub;
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConversation = conversations.find((c) => c.id === conversationId);

  async function handleSend(e) {
    e.preventDefault();
    if (!draft.trim() || !conversationId) return;
    const text = draft.trim();
    setDraft("");
    await sendMessage(conversationId, user.uid, text);
  }

  function otherPartyName(c) {
    return c.buyerId === user.uid ? c.sellerName : c.buyerName;
  }

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen w-full font-body">
      <header className="border-b px-5 py-4" style={{ borderColor: "rgba(245,240,232,0.08)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="font-display text-lg font-semibold" style={{ color: "var(--gold)" }}>Messages</span>
          <Link to="/" className="flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}><ArrowLeft size={14} /> Home</Link>
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
            {conversationsLoading ? (
              <div className="flex items-center justify-center py-12" style={{ color: "var(--muted)" }}><Loader2 className="animate-spin" size={18} /></div>
            ) : conversationsError ? (
              <p className="px-4 py-8 text-center text-sm" style={{ color: "#D97066" }}>
                Couldn't load conversations. Check the browser console for details.
              </p>
            ) : conversations.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm" style={{ color: "var(--muted)" }}>
                No conversations yet. Message a seller from a listing to start one.
              </p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { navigate(`/messages/${c.id}`); setMobileThreadOpen(true); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--surface-2)]"
                  style={{ background: conversationId === c.id ? "var(--surface-2)" : "transparent" }}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold" style={{ background: "var(--surface-2)", color: "var(--gold)" }}>
                    {(otherPartyName(c) || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-medium">{otherPartyName(c)}</span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>{formatTime(c.lastMessageAt)}</span>
                    </div>
                    <p className="truncate text-xs" style={{ color: "var(--muted)" }}>{c.listingTitle}</p>
                    <p className="truncate text-xs" style={{ color: "var(--muted)" }}>{c.lastMessage || "Say hello…"}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className={`${mobileThreadOpen ? "flex" : "hidden"} flex-col md:flex`}>
          {!activeConversation ? (
            <div className="flex flex-1 items-center justify-center text-sm" style={{ color: "var(--muted)" }}>
              Select a conversation to start chatting.
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b px-5 py-3" style={{ borderColor: "rgba(245,240,232,0.08)" }}>
                <button className="md:hidden" onClick={() => setMobileThreadOpen(false)}><ArrowLeft size={18} /></button>
                <div className="flex h-9 w-9 items-center justify-center rounded-full font-display text-xs font-semibold" style={{ background: "var(--surface-2)", color: "var(--gold)" }}>
                  {(otherPartyName(activeConversation) || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-display text-sm font-medium">{otherPartyName(activeConversation)}</p>
                  <Link to={`/listing/${activeConversation.listingId}`} className="text-xs hover:underline" style={{ color: "var(--muted)" }}>{activeConversation.listingTitle}</Link>
                </div>
              </div>

              <div className="flex items-center gap-2 px-5 py-2.5 text-xs" style={{ background: "rgba(27,67,50,0.2)", color: "var(--muted)" }}>
                <ShieldAlert size={14} style={{ color: "var(--gold)" }} />
                Never send money before inspecting the item in person. Report anything that feels off.
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                {messages.length === 0 ? (
                  <p className="text-center text-sm" style={{ color: "var(--muted)" }}>No messages yet — say hello.</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`flex ${m.senderId === user.uid ? "justify-end" : "justify-start"}`}>
                      <div className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm" style={m.senderId === user.uid ? { background: "var(--gold)", color: "#0F0E0C", borderBottomRightRadius: 4 } : { background: "var(--surface)", color: "var(--text)", borderBottomLeftRadius: 4 }}>
                        {m.text}
                        <div className="mt-1 text-[10px] opacity-60">{formatTime(m.createdAt)}</div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-2 border-t p-4" style={{ borderColor: "rgba(245,240,232,0.08)" }}>
                <div className="field flex-1 rounded-full border px-4 py-2.5" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
                  <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message…" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
                </div>
                <button type="submit" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--gold)", color: "#0F0E0C" }}>
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
