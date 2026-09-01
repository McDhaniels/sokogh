import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MapPin, ShieldCheck, MessageCircle, Heart, Share2, Flag, ChevronRight, Clock, Loader2 } from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import VerifyEmailPrompt from "../components/VerifyEmailPrompt.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getListingById, getListingsByCategory } from "../lib/listings.js";
import { getOrCreateConversation } from "../lib/messages.js";

const HUES = [
  "from-amber-500/25 to-amber-900/10",
  "from-emerald-500/20 to-emerald-900/10",
  "from-stone-500/25 to-stone-900/10",
  "from-amber-500/15 to-emerald-900/10",
];

function timeAgo(timestamp) {
  if (!timestamp?.toDate) return "";
  const seconds = Math.floor((Date.now() - timestamp.toDate().getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function Listing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeThumb, setActiveThumb] = useState(0);
  const [saved, setSaved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    setLoading(true);
    getListingById(id).then((data) => {
      setListing(data);
      setLoading(false);
      if (data?.category) {
        getListingsByCategory(data.category, 6).then((list) =>
          setSimilar(list.filter((l) => l.id !== id).slice(0, 3))
        );
      }
    });
  }, [id]);

  async function handleMessageSeller() {
    if (!user) {
      navigate("/auth");
      return;
    }
    setStartingChat(true);
    const conversationId = await getOrCreateConversation({
      listingId: listing.id,
      listingTitle: listing.title,
      buyerId: user.uid,
      buyerName: user.displayName || user.email,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
    });
    navigate(`/messages/${conversationId}`);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ color: "var(--muted)" }}>
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen w-full font-body">
        <Header />
        <div className="mx-auto max-w-2xl px-5 py-24 text-center">
          <h1 className="mb-2 font-display text-xl font-semibold">Listing not found</h1>
          <p className="mb-6 text-sm" style={{ color: "var(--muted)" }}>It may have been removed or the link is incorrect.</p>
          <Link to="/" className="rounded-full px-5 py-2.5 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full font-body">
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-8">
        {user?.uid === listing.sellerId && listing.status !== "active" && (
          <div className="mb-6 rounded-2xl border px-5 py-3 text-sm" style={{
            borderColor: listing.status === "rejected" ? "rgba(200,80,80,0.4)" : "rgba(212,165,68,0.4)",
            background: listing.status === "rejected" ? "rgba(200,80,80,0.1)" : "rgba(212,165,68,0.1)",
            color: listing.status === "rejected" ? "#D97066" : "var(--gold)",
          }}>
            {listing.status === "rejected"
              ? `This listing was rejected${listing.rejectionReason ? `: ${listing.rejectionReason}` : "."} It's only visible to you.`
              : "This listing is pending review and only visible to you until it's approved."}
          </div>
        )}
        <div className="mb-5 flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
          <Link to="/" style={{ color: "var(--muted)" }}>Home</Link>
          <ChevronRight size={12} />
          <Link to={`/category?cat=${encodeURIComponent(listing.category)}`} style={{ color: "var(--muted)" }}>{listing.category}</Link>
          <ChevronRight size={12} />
          <span style={{ color: "var(--text)" }}>{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            {listing.photos?.length > 0 ? (
              <>
                <div className="h-80 overflow-hidden rounded-2xl sm:h-[420px]">
                  <img src={listing.photos[activeThumb] || listing.photos[0]} alt={listing.title} className="h-full w-full object-cover" />
                </div>
                {listing.photos.length > 1 && (
                  <div className="mt-3 flex gap-3">
                    {listing.photos.map((url, i) => (
                      <button
                        key={url}
                        className="thumb h-16 w-16 overflow-hidden rounded-xl border-2"
                        style={{ borderColor: i === activeThumb ? "var(--gold)" : "rgba(245,240,232,0.15)" }}
                        onClick={() => setActiveThumb(i)}
                      >
                        <img src={url} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className={`flex h-80 items-center justify-center rounded-2xl bg-gradient-to-br sm:h-[420px] ${HUES[0]}`}>
                <span className="text-sm" style={{ color: "var(--muted)" }}>No photo added</span>
              </div>
            )}

            <div className="mt-8 flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-semibold sm:text-3xl">{listing.title}</h1>
                <p className="mt-2 flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}>
                  <MapPin size={14} /> {listing.location}<span className="mx-2">·</span><Clock size={14} /> Posted {timeAgo(listing.createdAt)}
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

            <p className="mt-4 font-display text-3xl font-semibold" style={{ color: "var(--gold)" }}>GH₵ {Number(listing.price).toLocaleString()}</p>

            <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
              <h2 className="mb-2 font-display text-sm font-semibold">Description</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{listing.description || "No description provided."}</p>
              {listing.category === "Services" && listing.hours ? (
                <div className="mt-4 flex flex-wrap gap-2 text-xs" style={{ color: "var(--muted)" }}>
                  <span className="rounded-full border px-3 py-1" style={{ borderColor: "rgba(245,240,232,0.14)" }}>Hours: {listing.hours}</span>
                </div>
              ) : listing.condition ? (
                <div className="mt-4 flex flex-wrap gap-2 text-xs" style={{ color: "var(--muted)" }}>
                  <span className="rounded-full border px-3 py-1" style={{ borderColor: "rgba(245,240,232,0.14)" }}>Condition: {listing.condition}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-semibold" style={{ background: "var(--surface-2)", color: "var(--gold)" }}>
                  {(listing.sellerName || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-display text-sm font-semibold">{listing.businessName || listing.sellerName}</div>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>Prefers: {listing.contactMethod || "Chat on SokoGH"}</p>
                </div>
              </div>
              {user?.uid === listing.sellerId ? (
                <div className="mt-4 rounded-full py-2.5 text-center text-sm" style={{ background: "var(--surface-2)", color: "var(--muted)" }}>
                  This is your listing
                </div>
              ) : user && !user.emailVerified ? (
                <div className="mt-4">
                  <VerifyEmailPrompt message="Verify your email before messaging a seller." />
                </div>
              ) : (
                <button onClick={handleMessageSeller} disabled={startingChat} className="cta-btn mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2.5 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>
                  {startingChat ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />}
                  {startingChat ? "Opening chat…" : "Message seller"}
                </button>
              )}
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

        {similar.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-4 font-display text-xl font-semibold">Similar listings</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {similar.map((item, i) => (
                <Link to={`/listing/${item.id}`} key={item.id} className="similar-card overflow-hidden rounded-2xl border block" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
                  {item.photos?.[0] ? (
                    <img src={item.photos[0]} alt={item.title} className="h-28 w-full object-cover" />
                  ) : (
                    <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${HUES[(i + 1) % HUES.length]}`}>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>No photo</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-display text-sm font-medium">{item.title}</h3>
                    <p className="mt-2 font-display text-sm font-semibold" style={{ color: "var(--gold)" }}>GH₵ {Number(item.price).toLocaleString()}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}><MapPin size={12} /> {item.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
