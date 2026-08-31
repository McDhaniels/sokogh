import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ChevronDown, MessageCircle, ListChecks, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { ADMIN_EMAIL } from "../lib/admin.js";
import ConfirmDialog from "./ConfirmDialog.jsx";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const accountRef = useRef(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    await signOut();
    setAccountOpen(false);
    setConfirmSignOut(false);
    navigate("/");
  }

  const isAdmin = user?.email === ADMIN_EMAIL;

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
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm"
                style={{ borderColor: "rgba(245,240,232,0.14)", color: "var(--text)" }}
              >
                <span className="max-w-[120px] truncate">{user.displayName || user.email}</span>
                <ChevronDown size={14} style={{ transform: accountOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>

              {accountOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border"
                  style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}
                >
                  <Link to="/messages" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-[var(--surface-2)]" style={{ color: "var(--text)" }}>
                    <MessageCircle size={15} /> Messages
                  </Link>
                  <Link to="/my-listings" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-[var(--surface-2)]" style={{ color: "var(--text)" }}>
                    <ListChecks size={15} /> My Listings
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-[var(--surface-2)]" style={{ color: "var(--gold)" }}>
                      <ShieldCheck size={15} /> Admin
                    </Link>
                  )}
                  <button onClick={() => { setConfirmSignOut(true); setAccountOpen(false); }} className="flex w-full items-center gap-2 border-t px-4 py-3 text-left text-sm hover:bg-[var(--surface-2)]" style={{ borderColor: "rgba(245,240,232,0.08)", color: "var(--muted)" }}>
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              )}
            </div>
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
              <div className="my-1 border-t" style={{ borderColor: "rgba(245,240,232,0.08)" }} />
              <span style={{ color: "var(--text)" }}>{user.displayName || user.email}</span>
              <Link to="/messages" onClick={() => setMenuOpen(false)}>Messages</Link>
              <Link to="/my-listings" onClick={() => setMenuOpen(false)}>My Listings</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ color: "var(--gold)" }}>Admin</Link>}
              <button onClick={() => { setConfirmSignOut(true); setMenuOpen(false); }} className="text-left">Sign out</button>
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

      {confirmSignOut && (
        <ConfirmDialog
          title="Sign out of SokoGH?"
          message="You'll need to sign in again to post an ad or message a seller."
          confirmLabel="Sign out"
          onConfirm={handleSignOut}
          onCancel={() => setConfirmSignOut(false)}
        />
      )}
    </header>
  );
}
