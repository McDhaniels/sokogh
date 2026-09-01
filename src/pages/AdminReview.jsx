import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, X, MapPin, Clock, ShieldCheck, ArrowLeft, Loader2, Star, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { ADMIN_EMAIL } from "../lib/admin.js";
import { subscribePendingListings, approveListing, rejectListing, subscribeActiveListings, setBoosted } from "../lib/listings.js";

const REJECT_REASONS = ["Unclear photos", "Suspicious / scam wording", "Wrong category", "Prohibited item", "Duplicate listing"];

function timeAgo(timestamp) {
  if (!timestamp?.toDate) return "";
  const seconds = Math.floor((Date.now() - timestamp.toDate().getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function AdminReview() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("pending");

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const [activeListings, setActiveListings] = useState([]);
  const [activeLoading, setActiveLoading] = useState(true);
  const [activeError, setActiveError] = useState(false);
  const [boostSearch, setBoostSearch] = useState("");
  const [boostBusyId, setBoostBusyId] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;
    const unsub = subscribePendingListings(
      (list) => { setQueue(list); setLoading(false); },
      () => { setError(true); setLoading(false); }
    );
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL || tab !== "boosts") return;
    const unsub = subscribeActiveListings(
      (list) => { setActiveListings(list); setActiveLoading(false); },
      () => { setActiveError(true); setActiveLoading(false); }
    );
    return unsub;
  }, [user, tab]);

  async function handleApprove(id) {
    setBusyId(id);
    await approveListing(id);
    setBusyId(null);
  }

  async function handleReject(id, reason) {
    setBusyId(id);
    await rejectListing(id, reason);
    setRejectingId(null);
    setBusyId(null);
  }

  async function handleToggleBoost(id, current) {
    setBoostBusyId(id);
    await setBoosted(id, !current);
    setBoostBusyId(null);
  }

  const filteredActiveListings = useMemo(() => {
    if (!boostSearch.trim()) return activeListings;
    const q = boostSearch.toLowerCase();
    return activeListings.filter((l) => l.title?.toLowerCase().includes(q) || l.sellerName?.toLowerCase().includes(q));
  }, [activeListings, boostSearch]);

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen w-full font-body">
      <header className="border-b px-5 py-4" style={{ borderColor: "rgba(245,240,232,0.08)" }}>
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/" className="flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}><ArrowLeft size={14} /> Home</Link>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} style={{ color: "var(--gold)" }} />
            <span className="font-display text-lg font-semibold">Admin</span>
          </div>
          <span className="rounded-full px-3 py-1 font-display text-xs font-semibold" style={{ background: "var(--surface-2)", color: "var(--gold)" }}>{queue.length} pending</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8">
        {user.email !== ADMIN_EMAIL ? (
          <p className="py-24 text-center text-sm" style={{ color: "var(--muted)" }}>
            This page is only available to SokoGH's admin account.
          </p>
        ) : (
          <>
            <div className="mb-6 flex gap-6 border-b" style={{ borderColor: "rgba(245,240,232,0.1)" }}>
              <button onClick={() => setTab("pending")} className="border-b-2 pb-3 font-display text-sm font-medium" style={{ borderColor: tab === "pending" ? "var(--gold)" : "transparent", color: tab === "pending" ? "var(--text)" : "var(--muted)" }}>
                Pending Review <span className="ml-1 text-xs" style={{ color: "var(--muted)" }}>({queue.length})</span>
              </button>
              <button onClick={() => setTab("boosts")} className="border-b-2 pb-3 font-display text-sm font-medium" style={{ borderColor: tab === "boosts" ? "var(--gold)" : "transparent", color: tab === "boosts" ? "var(--text)" : "var(--muted)" }}>
                Manage Boosts
              </button>
            </div>

            {tab === "pending" && (
              loading ? (
                <div className="flex items-center justify-center py-24" style={{ color: "var(--muted)" }}><Loader2 className="animate-spin" size={22} /></div>
              ) : error ? (
                <p className="py-24 text-center text-sm" style={{ color: "#D97066" }}>
                  Couldn't load the queue. This may mean Firestore rules need updating. Check the browser console for details.
                </p>
              ) : queue.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-24 text-center">
                  <Check size={32} style={{ color: "var(--gold)" }} />
                  <p className="font-display text-lg font-semibold">Queue clear</p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>No listings waiting for review right now.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {queue.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
                      <div className="flex flex-col gap-4 p-4 sm:flex-row">
                        {item.photos?.[0] ? (
                          <img src={item.photos[0]} alt={item.title} className="h-24 w-full shrink-0 rounded-xl object-cover sm:w-32" />
                        ) : (
                          <div className="flex h-24 w-full shrink-0 items-center justify-center rounded-xl sm:w-32" style={{ background: "var(--surface-2)" }}>
                            <span className="text-xs" style={{ color: "var(--muted)" }}>No photo</span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link to={`/listing/${item.id}`} className="font-display text-sm font-semibold hover:underline">{item.title}</Link>
                            <span className="rounded-full border px-2 py-0.5 text-xs" style={{ borderColor: "rgba(245,240,232,0.14)", color: "var(--muted)" }}>{item.category}</span>
                          </div>
                          <p className="mt-1 font-display text-sm font-semibold" style={{ color: "var(--gold)" }}>GH₵ {Number(item.price).toLocaleString()}</p>
                          <p className="mt-1 flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo(item.createdAt)}</span>
                            <span>by {item.sellerName}</span>
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2 sm:flex-col">
                          <button onClick={() => handleApprove(item.id)} disabled={busyId === item.id} className="flex flex-1 items-center justify-center gap-1 rounded-full px-4 py-2 font-display text-xs font-semibold sm:flex-none" style={{ background: "var(--gold)", color: "#0F0E0C" }}>
                            {busyId === item.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />} Approve
                          </button>
                          <button onClick={() => setRejectingId(rejectingId === item.id ? null : item.id)} className="flex flex-1 items-center justify-center gap-1 rounded-full border px-4 py-2 font-display text-xs font-semibold sm:flex-none" style={{ borderColor: "rgba(245,240,232,0.2)", color: "var(--muted)" }}>
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </div>

                      {rejectingId === item.id && (
                        <div className="border-t p-4" style={{ borderColor: "rgba(245,240,232,0.08)", background: "var(--surface-2)" }}>
                          <p className="mb-2 text-xs" style={{ color: "var(--muted)" }}>Reason for rejection (seller will see this):</p>
                          <div className="flex flex-wrap gap-2">
                            {REJECT_REASONS.map((reason) => (
                              <button key={reason} onClick={() => handleReject(item.id, reason)} className="rounded-full border px-3 py-1.5 text-xs" style={{ borderColor: "rgba(245,240,232,0.14)", color: "var(--text)" }}>{reason}</button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}

            {tab === "boosts" && (
              <div>
                <p className="mb-4 text-sm" style={{ color: "var(--muted)" }}>
                  Boosted listings show a "Featured" badge and appear first in Home and category browsing. Grant this manually to sellers you've arranged it with directly — SokoGH doesn't process payments for it.
                </p>
                <div className="glow-focus mb-5 flex items-center gap-2 rounded-full border px-4 py-2.5" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
                  <Search size={15} style={{ color: "var(--muted)" }} />
                  <input value={boostSearch} onChange={(e) => setBoostSearch(e.target.value)} placeholder="Search by listing title or seller…" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
                </div>

                {activeLoading ? (
                  <div className="flex items-center justify-center py-16" style={{ color: "var(--muted)" }}><Loader2 className="animate-spin" size={20} /></div>
                ) : activeError ? (
                  <p className="py-16 text-center text-sm" style={{ color: "#D97066" }}>Couldn't load listings. Check the browser console for details.</p>
                ) : filteredActiveListings.length === 0 ? (
                  <p className="py-16 text-center text-sm" style={{ color: "var(--muted)" }}>No matching listings.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredActiveListings.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 rounded-2xl border p-4" style={{ borderColor: item.boosted ? "rgba(212,165,68,0.4)" : "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
                        {item.photos?.[0] ? (
                          <img src={item.photos[0]} alt={item.title} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--surface-2)" }}>
                            <span className="text-[10px]" style={{ color: "var(--muted)" }}>No photo</span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <Link to={`/listing/${item.id}`} className="font-display text-sm font-medium hover:underline">{item.title}</Link>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>by {item.sellerName} · GH₵ {Number(item.price).toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => handleToggleBoost(item.id, item.boosted)}
                          disabled={boostBusyId === item.id}
                          className="flex shrink-0 items-center gap-1 rounded-full px-4 py-2 font-display text-xs font-semibold"
                          style={item.boosted ? { borderColor: "rgba(245,240,232,0.2)", color: "var(--muted)", border: "1px solid" } : { background: "var(--gold)", color: "#0F0E0C" }}
                        >
                          {boostBusyId === item.id ? <Loader2 size={13} className="animate-spin" /> : <Star size={13} fill={item.boosted ? "none" : "#0F0E0C"} />}
                          {item.boosted ? "Remove boost" : "Boost"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
