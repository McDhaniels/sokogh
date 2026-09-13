import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, ShieldAlert, ListChecks, Handshake, MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getUserProfile } from "../lib/users.js";
import { getSellerListingsCount } from "../lib/listings.js";

function memberSince(timestamp) {
  if (!timestamp?.toDate) return "Recently";
  return timestamp.toDate().toLocaleDateString([], { month: "long", year: "numeric" });
}

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [listingsCount, setListingsCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then(setProfile);
    getSellerListingsCount(user.uid).then(setListingsCount);
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen w-full font-body">
      <header className="border-b" style={{ borderColor: "rgba(245,240,232,0.08)" }}>
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}><ArrowLeft size={14} /> Home</Link>
          <div className="flex items-center gap-1">
            <span className="font-mark text-lg" style={{ color: "var(--gold)" }}>Soko</span>
            <span className="font-display text-lg font-semibold">GH</span>
          </div>
          <div className="w-14" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full font-display text-2xl font-semibold" style={{ background: "var(--surface-2)", color: "var(--gold)" }}>
            {(user.displayName || user.email || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold">{user.displayName || "SokoGH user"}</h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>{user.email}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm">
          {user.emailVerified ? (
            <span className="flex items-center gap-1" style={{ color: "var(--gold)" }}><ShieldCheck size={15} /> Verified student email</span>
          ) : (
            <span className="flex items-center gap-1" style={{ color: "#D97066" }}><ShieldAlert size={15} /> Email not verified yet</span>
          )}
        </div>

        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Member since {memberSince(profile?.createdAt)}</p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
            <ListChecks size={18} style={{ color: "var(--gold)" }} className="mb-2" />
            <div className="font-display text-2xl font-semibold">{listingsCount}</div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Listings posted</p>
          </div>
          <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
            <Handshake size={18} style={{ color: "var(--gold)" }} className="mb-2" />
            <div className="font-display text-2xl font-semibold">{profile?.completedDeals || 0}</div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Completed deals</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/my-listings" className="flex flex-1 items-center justify-center gap-2 rounded-full border px-5 py-3 font-display text-sm font-semibold" style={{ borderColor: "rgba(245,240,232,0.15)", color: "var(--text)" }}>
            <ListChecks size={16} /> My Listings
          </Link>
          <Link to="/messages" className="flex flex-1 items-center justify-center gap-2 rounded-full border px-5 py-3 font-display text-sm font-semibold" style={{ borderColor: "rgba(245,240,232,0.15)", color: "var(--text)" }}>
            <MessageCircle size={16} /> Messages
          </Link>
        </div>

        <p className="mt-6 text-xs" style={{ color: "var(--muted)" }}>
          This is your real activity on SokoGH — the same kind of history shown to anyone viewing your listings.
        </p>
      </main>
    </div>
  );
}
