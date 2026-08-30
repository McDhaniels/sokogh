import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, ChevronRight, SlidersHorizontal, ChevronDown, Loader2 } from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { getListingsByCategory } from "../lib/listings.js";

const HUES = [
  "from-amber-500/25 to-amber-900/10",
  "from-emerald-500/20 to-emerald-900/10",
  "from-stone-500/25 to-stone-900/10",
  "from-amber-500/20 to-stone-900/10",
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
  const [searchParams] = useSearchParams();
  const category = searchParams.get("cat") || "";
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getListingsByCategory(category || null)
      .then(setListings)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen w-full font-body">
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-5 flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
          <Link to="/" style={{ color: "var(--muted)" }}>Home</Link>
          <ChevronRight size={12} />
          <span style={{ color: "var(--text)" }}>{category || "All categories"}</span>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">{category || "All categories"}</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{listings.length} listing{listings.length === 1 ? "" : "s"}</p>
          </div>
          <div className="glow-focus flex items-center gap-2 rounded-full border p-2 pl-4 sm:w-80" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
            <Search size={16} style={{ color: "var(--muted)" }} />
            <input type="text" placeholder={`Search${category ? ` in ${category}` : ""}…`} className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
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
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>Filters are visual for now — real filtering comes in a later step.</p>
            </div>
          </aside>

          <div>
            {loading ? (
              <div className="flex items-center justify-center py-16" style={{ color: "var(--muted)" }}><Loader2 className="animate-spin" size={20} /></div>
            ) : listings.length === 0 ? (
              <div className="rounded-2xl border border-dashed px-6 py-12 text-center text-sm" style={{ borderColor: "rgba(245,240,232,0.15)", color: "var(--muted)" }}>
                No listings here yet — be the first to <Link to="/post-ad" style={{ color: "var(--gold)" }}>post an ad</Link>.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {listings.map((item, i) => (
                  <Link to={`/listing/${item.id}`} key={item.id} className="listing-card overflow-hidden rounded-2xl border block" style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}>
                    <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${HUES[i % HUES.length]}`}>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>Photo</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-sm font-medium leading-snug">{item.title}</h3>
                      <p className="mt-2 font-display text-base font-semibold" style={{ color: "var(--gold)" }}>GH₵ {Number(item.price).toLocaleString()}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}><MapPin size={12} /> {item.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
