import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, MessageCircle, Trash2, Pencil, Plus, MapPin, Clock, ArrowLeft, Loader2, TrendingUp, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuth } from "../context/AuthContext.jsx";
import { subscribeSellerListings, deleteListing } from "../lib/listings.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const TABS = [
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending review" },
  { key: "rejected", label: "Rejected" },
];

const STATUS_COLOR = {
  active: { bg: "rgba(212,165,68,0.15)", text: "var(--gold)", label: "Active" },
  pending: { bg: "rgba(154,148,136,0.15)", text: "var(--muted)", label: "Pending review" },
  rejected: { bg: "rgba(200,80,80,0.15)", text: "#D97066", label: "Rejected" },
};

function timeAgo(timestamp) {
  if (!timestamp?.toDate) return "";
  const seconds = Math.floor((Date.now() - timestamp.toDate().getTime()) / 1000);
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function MyListings() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("active");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeSellerListings(user.uid, (list) => {
      setListings(list);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  async function handleDelete(id) {
    setDeletingId(id);
    await deleteListing(id);
    setDeletingId(null);
    setConfirmDeleteId(null);
  }

  if (authLoading || !user) return null;

  const filtered = listings.filter((l) => l.status === tab);

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
        {!loading && listings.length > 0 && (
          <div className="mb-8 rounded-2xl border p-5" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp size={16} style={{ color: "var(--gold)" }} />
              <h2 className="font-display text-sm font-semibold">Performance overview</h2>
            </div>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={listings.map((l) => ({ name: l.title.length > 14 ? l.title.slice(0, 14) + "…" : l.title, Views: l.views || 0, Messages: l.messageCount || 0 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,232,0.08)" />
                  <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={{ stroke: "rgba(245,240,232,0.1)" }} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={{ stroke: "rgba(245,240,232,0.1)" }} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "var(--surface-2)", border: "1px solid rgba(245,240,232,0.1)", borderRadius: 12, fontSize: 12 }} labelStyle={{ color: "var(--text)" }} />
                  <Bar dataKey="Views" fill="#D4A544" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Messages" fill="#1B4332" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
              Real views and messages across all your listings — this is engagement, not sales data (SokoGH doesn't process payments, so it can't track orders).
            </p>
          </div>
        )}

        <div className="mb-6 flex gap-6 border-b" style={{ borderColor: "rgba(245,240,232,0.1)" }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className="border-b-2 pb-3 font-display text-sm font-medium" style={{ borderColor: tab === t.key ? "var(--gold)" : "transparent", color: tab === t.key ? "var(--text)" : "var(--muted)" }}>
              {t.label} <span className="ml-1 text-xs" style={{ color: "var(--muted)" }}>({listings.filter((l) => l.status === t.key).length})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16" style={{ color: "var(--muted)" }}><Loader2 className="animate-spin" size={20} /></div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-sm" style={{ color: "var(--muted)" }}>Nothing here yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
                {item.photos?.[0] ? (
                  <img src={item.photos[0]} alt={item.title} className="h-20 w-full shrink-0 rounded-xl object-cover sm:w-28" />
                ) : (
                  <div className="flex h-20 w-full shrink-0 items-center justify-center rounded-xl sm:w-28" style={{ background: "var(--surface-2)" }}>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>No photo</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/listing/${item.id}`} className="font-display text-sm font-semibold hover:underline">{item.title}</Link>
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: STATUS_COLOR[item.status]?.bg, color: STATUS_COLOR[item.status]?.text }}>{STATUS_COLOR[item.status]?.label || item.status}</span>
                  </div>
                  <p className="mt-1 font-display text-sm font-semibold" style={{ color: "var(--gold)" }}>GH₵ {Number(item.price).toLocaleString()}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo(item.createdAt)}</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {item.views || 0} views</span>
                    <span className="flex items-center gap-1"><MessageCircle size={12} /> {item.messageCount || 0} messages</span>
                    {item.boosted && (
                      <span className="flex items-center gap-1" style={{ color: "var(--gold)" }}><Star size={12} fill="var(--gold)" /> Boosted</span>
                    )}
                  </p>
                  {item.status === "rejected" && item.rejectionReason && (
                    <p className="mt-1 text-xs" style={{ color: "#D97066" }}>Reason: {item.rejectionReason}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
                  <Link to={`/edit-listing/${item.id}`} className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
                    <Pencil size={14} /> Edit
                  </Link>
                  <button onClick={() => setConfirmDeleteId(item.id)} disabled={deletingId === item.id} className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
                    {deletingId === item.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={14} />} Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {confirmDeleteId && (
        <ConfirmDialog
          title="Delete this listing?"
          message="This can't be undone — buyers won't be able to find it anymore."
          confirmLabel="Delete"
          danger
          onConfirm={() => handleDelete(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
