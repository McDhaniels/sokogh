import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck, ListChecks, Handshake, MapPin, Loader2 } from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { getUserProfile } from "../lib/users.js";
import { getActiveListingsBySeller } from "../lib/listings.js";

const HUES = [
  "from-amber-500/25 to-amber-900/10",
  "from-emerald-500/20 to-emerald-900/10",
  "from-stone-500/25 to-stone-900/10",
  "from-amber-500/20 to-stone-900/10",
];

function memberSince(timestamp) {
  if (!timestamp?.toDate) return "Recently";
  return timestamp.toDate().toLocaleDateString([], { month: "long", year: "numeric" });
}

export default function SellerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([getUserProfile(id), getActiveListingsBySeller(id)]).then(([p, l]) => {
      if (!p) { setNotFound(true); }
      setProfile(p);
      setListings(l);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ color: "var(--muted)" }}>
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen w-full font-body">
        <Header />
        <div className="mx-auto max-w-2xl px-5 py-24 text-center">
          <h1 className="mb-2 font-display text-xl font-semibold">Seller not found</h1>
          <Link to="/" className="rounded-full px-5 py-2.5 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const displayName = listings[0]?.businessName || profile.displayName || profile.email;

  return (
    <div className="min-h-screen w-full font-body">
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <Link to="/" className="mb-6 flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}><ArrowLeft size={14} /> Home</Link>

        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full font-display text-2xl font-semibold" style={{ background: "var(--surface-2)", color: "var(--gold)" }}>
            {(displayName || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold">{displayName}</h1>
            {profile.emailVerified ? (
              <p className="flex items-center gap-1 text-sm" style={{ color: "var(--gold)" }}><ShieldCheck size={14} /> Verified student</p>
            ) : (
              <p className="text-sm" style={{ color: "var(--muted)" }}>Not yet verified</p>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>Member since {memberSince(profile.createdAt)}</p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
            <ListChecks size={18} style={{ color: "var(--gold)" }} className="mb-2" />
            <div className="font-display text-2xl font-semibold">{listings.length}</div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Active listings</p>
          </div>
          <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
            <Handshake size={18} style={{ color: "var(--gold)" }} className="mb-2" />
            <div className="font-display text-2xl font-semibold">{profile.completedDeals || 0}</div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Completed deals</p>
          </div>
        </div>

        <h2 className="mb-4 mt-10 font-display text-lg font-semibold">Other listings from this seller</h2>
        {listings.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>No active listings right now.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {listings.map((item, i) => (
              <Link to={`/listing/${item.id}`} key={item.id} className="listing-card overflow-hidden rounded-2xl border block" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
                {item.photos?.[0] ? (
                  <img src={item.photos[0]} alt={item.title} className="h-28 w-full object-cover" />
                ) : (
                  <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${HUES[i % HUES.length]}`}>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>No photo</span>
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-display text-xs font-medium leading-snug">{item.title}</h3>
                  <p className="mt-1 font-display text-sm font-semibold" style={{ color: "var(--gold)" }}>GH₵ {Number(item.price).toLocaleString()}</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px]" style={{ color: "var(--muted)" }}><MapPin size={10} /> {item.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
