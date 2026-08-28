import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search, MapPin, ShieldCheck, ChevronRight, Smartphone, Car, Shirt,
  Home as HomeIcon, Briefcase, Sofa, BadgeCheck, MessageCircle,
} from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const TICKER_ITEMS = [
  "New listing: iPhone 13 Pro — Kumasi · 2 min ago",
  "New listing: Toyota Corolla 2016 — Accra · 5 min ago",
  "New listing: 3-Bedroom House, East Legon · 9 min ago",
  "New listing: Samsung 55\" TV — Takoradi · 12 min ago",
  "New listing: Graphic Designer Services — Tema · 15 min ago",
  "New listing: Ankara Fabric Bundle — Kumasi · 21 min ago",
];

const CATEGORIES = [
  { name: "Electronics", icon: Smartphone, count: "12,400" },
  { name: "Vehicles", icon: Car, count: "6,120" },
  { name: "Fashion", icon: Shirt, count: "18,900" },
  { name: "Real Estate", icon: HomeIcon, count: "3,050" },
  { name: "Services", icon: Briefcase, count: "5,600" },
  { name: "Home & Furniture", icon: Sofa, count: "4,300" },
];

const LISTINGS = [
  { title: "iPhone 13 Pro — 256GB", price: "GH₵ 4,200", location: "Kumasi", verified: true, hue: "from-amber-500/25 to-amber-900/10" },
  { title: "Toyota Corolla 2016", price: "GH₵ 68,000", location: "Accra", verified: true, hue: "from-emerald-500/20 to-emerald-900/10" },
  { title: "3-Bedroom Self-Contained", price: "GH₵ 2,500/mo", location: "East Legon", verified: false, hue: "from-stone-500/25 to-stone-900/10" },
  { title: "Samsung 55\" Smart TV", price: "GH₵ 3,100", location: "Takoradi", verified: true, hue: "from-amber-500/20 to-stone-900/10" },
  { title: "Ankara Fabric Bundle (6yd)", price: "GH₵ 180", location: "Kumasi", verified: false, hue: "from-emerald-500/15 to-amber-900/10" },
  { title: "Freelance Graphic Design", price: "From GH₵ 150", location: "Tema", verified: true, hue: "from-stone-500/20 to-amber-900/10" },
  { title: "Bedroom Furniture Set", price: "GH₵ 5,400", location: "Cape Coast", verified: false, hue: "from-amber-500/15 to-emerald-900/10" },
  { title: "HP Laptop — Core i7", price: "GH₵ 3,800", location: "Accra", verified: true, hue: "from-emerald-500/20 to-stone-900/10" },
];

function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) ref.current = requestAnimationFrame(step);
    }
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);
  return value;
}

export default function Home() {
  const sellers = useCountUp(24700);
  const listings = useCountUp(58200);
  const regions = useCountUp(16);

  return (
    <div className="min-h-screen w-full">
      {/* Live ticker */}
      <div className="w-full overflow-hidden border-b font-body text-xs tracking-wide" style={{ borderColor: "rgba(212,165,68,0.18)", background: "var(--surface)" }}>
        <div className="flex whitespace-nowrap py-2 ticker-track" style={{ width: "200%" }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center px-6" style={{ color: "var(--muted)" }}>
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--gold)" }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-14 text-center">
        <p className="rise-in mb-4 font-body text-xs uppercase tracking-[0.25em]" style={{ color: "var(--gold)" }}>
          Ghana's marketplace, one search away
        </p>
        <h1 className="rise-in font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl" style={{ animationDelay: "0.08s" }}>
          Find it. Message the seller.
          <br />
          <span className="font-mark italic" style={{ color: "var(--gold)" }}>Deal directly.</span>
        </h1>
        <p className="rise-in mx-auto mt-5 max-w-xl font-body text-base" style={{ color: "var(--muted)", animationDelay: "0.16s" }}>
          Thousands of sellers across every region. No middleman, no platform fees on your deal —
          just a faster way to find what you're looking for.
        </p>

        <div className="glow-focus rise-in mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-full border p-2 pl-5" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)", animationDelay: "0.24s" }}>
          <Search size={18} style={{ color: "var(--muted)" }} />
          <input type="text" placeholder="Search phones, cars, apartments, services…" className="w-full bg-transparent font-body text-sm outline-none placeholder:text-[var(--muted)]" />
          <Link to="/category" className="flex items-center gap-1 whitespace-nowrap rounded-full px-5 py-2.5 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>
            Search
          </Link>
        </div>

        <div className="rise-in mx-auto mt-10 flex max-w-xl items-center justify-center gap-10 font-body text-sm" style={{ color: "var(--muted)", animationDelay: "0.32s" }}>
          <div><div className="font-display text-xl font-semibold" style={{ color: "var(--text)" }}>{listings.toLocaleString()}+</div>active listings</div>
          <div className="h-8 w-px" style={{ background: "rgba(245,240,232,0.14)" }} />
          <div><div className="font-display text-xl font-semibold" style={{ color: "var(--text)" }}>{sellers.toLocaleString()}+</div>sellers</div>
          <div className="h-8 w-px" style={{ background: "rgba(245,240,232,0.14)" }} />
          <div><div className="font-display text-xl font-semibold" style={{ color: "var(--text)" }}>{regions}</div>regions covered</div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold">Browse categories</h2>
          <Link to="/category" className="flex items-center gap-1 font-body text-sm" style={{ color: "var(--gold)" }}>See all <ChevronRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {CATEGORIES.map(({ name, icon: Icon, count }) => (
            <Link to="/category" key={name} className="cat-chip flex cursor-pointer flex-col items-center gap-2 rounded-2xl border px-4 py-6 text-center" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
              <Icon size={22} style={{ color: "var(--gold)" }} />
              <span className="font-display text-sm font-medium">{name}</span>
              <span className="font-body text-xs" style={{ color: "var(--muted)" }}>{count} ads</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold">Trending near you</h2>
          <Link to="/category" className="flex items-center gap-1 font-body text-sm" style={{ color: "var(--gold)" }}>See all <ChevronRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {LISTINGS.map((item, i) => (
            <Link to="/listing" key={i} className="listing-card overflow-hidden rounded-2xl border block" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
              <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${item.hue}`}>
                <span className="font-body text-xs" style={{ color: "var(--muted)" }}>Photo</span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-sm font-medium leading-snug">{item.title}</h3>
                  {item.verified && <BadgeCheck size={16} style={{ color: "var(--gold)" }} />}
                </div>
                <p className="mt-2 font-display text-base font-semibold" style={{ color: "var(--gold)" }}>{item.price}</p>
                <p className="mt-1 flex items-center gap-1 font-body text-xs" style={{ color: "var(--muted)" }}><MapPin size={12} /> {item.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ad banner placeholder */}
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="flex items-center justify-between rounded-2xl border border-dashed px-6 py-8 font-body text-sm" style={{ borderColor: "rgba(245,240,232,0.18)", color: "var(--muted)" }}>
          <span>Advertisement space — banner rotates here</span>
          <span className="rounded-full px-3 py-1 text-xs" style={{ background: "var(--surface-2)" }}>728×90</span>
        </div>
      </section>

      {/* Safety */}
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="flex flex-col gap-6 rounded-3xl border p-8 sm:flex-row sm:items-center" style={{ borderColor: "rgba(27,67,50,0.4)", background: "linear-gradient(135deg, rgba(27,67,50,0.35), rgba(15,14,12,0.2))" }}>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl" style={{ background: "rgba(212,165,68,0.15)" }}>
            <ShieldCheck size={26} style={{ color: "var(--gold)" }} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Deal safely</h3>
            <p className="mt-1 max-w-2xl font-body text-sm" style={{ color: "var(--muted)" }}>
              We connect buyers and sellers — we don't handle payments. Meet in a public place, inspect
              before you pay, and never send money to someone you haven't verified. Report anything that feels off.
            </p>
          </div>
          <button className="flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 font-display text-sm font-semibold sm:ml-auto" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>
            <MessageCircle size={16} /> Read safety tips
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
