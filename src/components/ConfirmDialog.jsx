export default function ConfirmDialog({ title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5" style={{ background: "rgba(15,14,12,0.7)" }} onClick={onCancel}>
      <div
        className="w-full max-w-sm rounded-2xl border p-6 font-body"
        style={{ borderColor: "rgba(245,240,232,0.1)", background: "var(--surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 font-display text-base font-semibold" style={{ color: "var(--text)" }}>{title}</h2>
        <p className="mb-6 text-sm" style={{ color: "var(--muted)" }}>{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: "rgba(245,240,232,0.15)", color: "var(--muted)" }}>
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full px-4 py-2 font-display text-sm font-semibold"
            style={danger ? { background: "#D97066", color: "#0F0E0C" } : { background: "var(--gold)", color: "#0F0E0C" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
