import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, ChevronRight, BadgeCheck, SlidersHorizontal, ChevronDown } from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const LISTINGS = [
  { title: "iPhone 13 Pro — 256GB", price: "GH₵ 4,200", location: "Kumasi", verified: true, hue: "from-amber-500/25 to-amber-900/10" },
  { title: "iPhone 12 — 128GB", price: "GH₵ 2,900", location: "Accra", verified: true, hue: "from-emerald-500/20 to-emerald-900/10" },
  { title: "Samsung Galaxy S22", price: "GH₵ 3,600", location: "Tema", verified: false, hue: "from-stone-500/25 to-stone-900/10" },
  { title: "Samsung 55\" Smart TV", price: "GH₵ 3,100", location: "Takoradi", verified: true, hue: "from-amber-500/20 to-stone-900/10" },
  { title: "HP Laptop — Core i7", price: "GH₵ 3,800", location: "Accra", verified: true, hue: "from-emerald-500/20 to-stone-900/10" },
  { title: "Dell Laptop — Core i5", price: "GH₵ 2,600", location: "Kumasi", verified: false, hue: "from-amber-500/15 to-emerald-900/10" },
  { title: "Sony Headphones WH-1000", price: "GH₵ 950", location: "Cape Coast", verified: true, hue: "from-stone-500/20 to-amber-900/10" },
  { title: "PlayStation 5", price: "GH₵ 5,200", location: "Accra", verified: true, hue: "from-emerald-500/15 to-amber-900/10" },
  { title: "iPad Air 5th Gen", price: "GH₵ 3,300", location: "Kumasi", verified: false, hue: "from-amber-500/25 to-amber-900/10" },
];

const PRICE_RANGES = ["Any price", "Under GH₵ 500", "GH₵ 500 – 2,000", "GH₵ 2,000 – 5,000", "GH₵ 5,000+"];
const LOCATIONS = ["All regions", "Greater Accra", "Ashanti", "Western", "Central", "Eastern"];
const CONDITIONS = ["Any condition", "Brand new", "Used — like new", "Used — fair"];

function FilterGroup({ label, options }) {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(options[0]);
  return (
    <div className="border-b py-4" style={{ borderColor: "rgba(245,240,232,0.08)" }}>
      <button className="flex w-full items-center justify-between font-display text-sm font-medium" onClick={() => setOpen((v) => !v)}>
        {label}
        <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div className="mt-3 flex flex-col gap-2">
          {options.map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2 font-body text-sm" style={{ color: "var(--muted)" }}>
              <input type="radio" name={label} checked={selected === opt} onChange={() => setSelected(opt)} className="accent-[#D4A544]" />
              <span style={{ color: selected === opt ? "var(--text)" : "var(--muted)" }}>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Category() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen w-full font-body">
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-5 flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
          <Link to="/" style={{ color: "var(--muted)" }}>Home</Link>
          <ChevronRight size={12} />
          <span style={{ color: "var(--text)" }}>Electronics</span>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">Electronics</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>12,400 listings across Ghana</p>
          </div>
          <div className="glow-focus flex items-center gap-2 rounded-full border p-2 pl-4 sm:w-80" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
            <Search size={16} style={{ color: "var(--muted)" }} />
            <input type="text" placeholder="Search in Electronics…" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
          </div>
        </div>

        <button className="mb-4 flex items-center gap-2 rounded-full border px-4 py-2 text-sm md:hidden" style={{ borderColor: "rgba(245,240,232,0.14)", color: "var(--muted)" }} onClick={() => setFiltersOpen((v) => !v)}>
          <SlidersHorizontal size={14} /> Filters
        </button>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
          <aside className={`${filtersOpen ? "block" : "hidden"} md:block`}>
            <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
              <h2 className="mb-1 font-display text-sm font-semibold" style={{ color: "var(--gold)" }}>Filters</h2>
              <FilterGroup label="Price" options={PRICE_RANGES} />
              <FilterGroup label="Region" options={LOCATIONS} />
              <FilterGroup label="Condition" options={CONDITIONS} />
              <button className="mt-4 w-full rounded-full py-2.5 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>Apply filters</button>
            </div>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between text-sm" style={{ color: "var(--muted)" }}>
              <span>Showing {LISTINGS.length} of 12,400</span>
              <div className="flex items-center gap-1">Sort: <span style={{ color: "var(--text)" }}>Newest first</span><ChevronDown size={14} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {LISTINGS.map((item, i) => (
                <Link to="/listing" key={i} className="listing-card overflow-hidden rounded-2xl border block" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
                  <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${item.hue}`}>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>Photo</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-sm font-medium leading-snug">{item.title}</h3>
                      {item.verified && <BadgeCheck size={16} style={{ color: "var(--gold)" }} />}
                    </div>
                    <p className="mt-2 font-display text-base font-semibold" style={{ color: "var(--gold)" }}>{item.price}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}><MapPin size={12} /> {item.location}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-sm">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} className="flex h-9 w-9 items-center justify-center rounded-full font-display" style={n === 1 ? { background: "var(--gold)", color: "#0F0E0C" } : { color: "var(--muted)" }}>{n}</button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
