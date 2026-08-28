export default function Footer() {
  return (
    <footer className="border-t px-5 py-10 font-body text-xs" style={{ borderColor: "rgba(245,240,232,0.08)", color: "var(--muted)" }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-1">
          <span className="font-mark text-lg" style={{ color: "var(--gold)" }}>Soko</span>
          <span className="font-display text-lg font-semibold" style={{ color: "var(--text)" }}>GH</span>
        </div>
        <p>© 2026 SokoGH. Advertising a marketplace, not a party to any deal.</p>
      </div>
    </footer>
  );
}
