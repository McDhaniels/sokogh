import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <header
      className="sticky top-0 z-30 backdrop-blur border-b"
      style={{ borderColor: "rgba(245,240,232,0.08)", background: "rgba(15,14,12,0.85)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-1">
          <span className="font-mark text-2xl" style={{ color: "var(--gold)" }}>Soko</span>
          <span className="font-display text-2xl font-semibold">GH</span>
        </Link>

        <nav className="hidden items-center gap-8 font-body text-sm md:flex" style={{ color: "var(--muted)" }}>
          <Link to="/category" className="hover:text-[var(--text)] transition-colors">Browse</Link>
          <Link to="/category" className="hover:text-[var(--text)] transition-colors">Categories</Link>
          <Link to="/info?tab=safety" className="hover:text-[var(--text)] transition-colors">Safety Tips</Link>
          <Link to="/info" className="hover:text-[var(--text)] transition-colors">How It Works</Link>
          {user && <Link to="/messages" className="hover:text-[var(--text)] transition-colors">Messages</Link>}
          {user && <Link to="/my-listings" className="hover:text-[var(--text)] transition-colors">My Listings</Link>}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="max-w-[140px] truncate text-sm" style={{ color: "var(--muted)" }}>
                {user.displayName || user.email}
              </span>
              <button onClick={handleSignOut} className="flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}>
                <LogOut size={14} /> Sign out
              </button>
            </>
          ) : (
            <Link to="/auth" className="font-body text-sm" style={{ color: "var(--muted)" }}>Sign in</Link>
          )}
          <Link
            to="/post-ad"
            className="rounded-full px-5 py-2.5 font-display text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--gold)", color: "#0F0E0C" }}
          >
            Post an Ad
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-4 border-t px-5 py-4 font-body text-sm md:hidden" style={{ borderColor: "rgba(245,240,232,0.08)", color: "var(--muted)" }}>
          <Link to="/category" onClick={() => setMenuOpen(false)}>Browse</Link>
          <Link to="/category" onClick={() => setMenuOpen(false)}>Categories</Link>
          <Link to="/info?tab=safety" onClick={() => setMenuOpen(false)}>Safety Tips</Link>
          <Link to="/info" onClick={() => setMenuOpen(false)}>How It Works</Link>
          {user ? (
            <>
              <Link to="/messages" onClick={() => setMenuOpen(false)}>Messages</Link>
              <Link to="/my-listings" onClick={() => setMenuOpen(false)}>My Listings</Link>
              <button onClick={() => { handleSignOut(); setMenuOpen(false); }} className="text-left">Sign out</button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMenuOpen(false)}>Sign in</Link>
          )}
          <Link
            to="/post-ad"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-full px-5 py-2.5 text-center font-display font-semibold"
            style={{ background: "var(--gold)", color: "#0F0E0C" }}
          >
            Post an Ad
          </Link>
        </div>
      )}
    </header>
  );
}
