import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, X, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getListingById, updateListing } from "../lib/listings.js";
import { uploadImages } from "../lib/cloudinary.js";
import VerifyEmailPrompt from "../components/VerifyEmailPrompt.jsx";

const MAX_PHOTOS = 4;
const CONDITIONS = ["Brand new", "Used — like new", "Used — fair"];

export default function EditListing() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("Used — like new");
  const [businessName, setBusinessName] = useState("");
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState("Save changes");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    getListingById(id).then((data) => {
      if (!data) { setNotFound(true); setLoading(false); return; }
      setListing(data);
      setTitle(data.title || "");
      setPrice(String(data.price ?? ""));
      setDescription(data.description || "");
      setLocation(data.location || "");
      setCondition(data.condition || "Used — like new");
      setBusinessName(data.businessName || "");
      setExistingPhotos(data.photos || []);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [newPreviews]);

  const totalPhotoCount = existingPhotos.length + newFiles.length;

  function handleAddPhotos(e) {
    const files = Array.from(e.target.files || []).slice(0, MAX_PHOTOS - totalPhotoCount);
    if (files.length === 0) return;
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  }

  function removeExisting(index) {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNew(index) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      let uploadedUrls = [];
      if (newFiles.length > 0) {
        setSubmitLabel("Uploading photos…");
        uploadedUrls = await uploadImages(newFiles);
      }
      setSubmitLabel("Saving…");
      await updateListing(id, {
        title,
        price: Number(price),
        description,
        location,
        condition,
        businessName: businessName || null,
        photos: [...existingPhotos, ...uploadedUrls],
        status: "pending",
        rejectionReason: null,
      });
      navigate(`/listing/${id}`);
    } catch (err) {
      setError("Couldn't save your changes right now. Please try again.");
      setSubmitting(false);
      setSubmitLabel("Save changes");
    }
  }

  if (authLoading || loading || !user) return null;

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center font-body">
        <h1 className="mb-2 font-display text-xl font-semibold">Listing not found</h1>
        <Link to="/my-listings" className="rounded-full px-5 py-2.5 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>Back to My Listings</Link>
      </div>
    );
  }

  if (listing.sellerId !== user.uid) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center font-body">
        <h1 className="mb-2 font-display text-xl font-semibold">You can't edit this listing</h1>
        <p className="mb-6 text-sm" style={{ color: "var(--muted)" }}>This listing belongs to someone else.</p>
        <Link to="/" className="rounded-full px-5 py-2.5 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>Back to Home</Link>
      </div>
    );
  }

  if (!user.emailVerified) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-5 font-body">
        <div className="w-full max-w-md">
          <VerifyEmailPrompt message="Verify your email before editing a listing." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full font-body">
      <header className="border-b" style={{ borderColor: "rgba(245,240,232,0.08)" }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link to={`/listing/${id}`} className="flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}><ArrowLeft size={14} /> Cancel</Link>
          <div className="flex items-center gap-1">
            <span className="font-mark text-xl" style={{ color: "var(--gold)" }}>Soko</span>
            <span className="font-display text-xl font-semibold">GH</span>
          </div>
          <div className="w-14" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="mb-2 font-display text-2xl font-semibold sm:text-3xl">Edit listing</h1>
        <p className="mb-8 text-sm" style={{ color: "var(--muted)" }}>
          Saving changes sends this listing back for review before it's visible to buyers again.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block font-display text-sm font-medium">Title</label>
            <div className="field rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
              <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={70} required className="w-full bg-transparent text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-display text-sm font-medium">Price (GH₵)</label>
            <div className="field rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
              <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" required className="w-full bg-transparent text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-display text-sm font-medium">Location</label>
            <div className="field rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
              <input value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full bg-transparent text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-display text-sm font-medium">Condition</label>
            <div className="grid grid-cols-3 gap-2">
              {CONDITIONS.map((opt) => (
                <button type="button" key={opt} onClick={() => setCondition(opt)} className="rounded-xl border px-3 py-2.5 text-xs font-medium" style={{ borderColor: condition === opt ? "var(--gold)" : "rgba(245,240,232,0.14)", background: condition === opt ? "var(--surface-2)" : "var(--surface)", color: condition === opt ? "var(--text)" : "var(--muted)" }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block font-display text-sm font-medium">Description</label>
            <div className="field rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} rows={4} className="w-full resize-none bg-transparent text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-display text-sm font-medium">Business or shop name <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
            <div className="field rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
              <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full bg-transparent text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-display text-sm font-medium">Photos</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {existingPhotos.map((url, i) => (
                <div key={url} className="relative aspect-square overflow-hidden rounded-2xl border-2" style={{ borderColor: "var(--gold)" }}>
                  <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeExisting(i)} className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "rgba(15,14,12,0.75)", color: "var(--text)" }}>
                    <X size={13} />
                  </button>
                </div>
              ))}
              {newPreviews.map((url, i) => (
                <div key={url} className="relative aspect-square overflow-hidden rounded-2xl border-2" style={{ borderColor: "var(--gold)" }}>
                  <img src={url} alt={`New ${i + 1}`} className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeNew(i)} className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "rgba(15,14,12,0.75)", color: "var(--text)" }}>
                    <X size={13} />
                  </button>
                </div>
              ))}
              {totalPhotoCount < MAX_PHOTOS && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed" style={{ borderColor: "rgba(245,240,232,0.15)", background: "var(--surface)" }}>
                  <Camera size={20} style={{ color: "var(--muted)" }} />
                  <span className="text-xs" style={{ color: "var(--muted)" }}>Add photo</span>
                  <input type="file" accept="image/*" multiple onChange={handleAddPhotos} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border px-4 py-3 text-xs" style={{ borderColor: "rgba(200,80,80,0.4)", background: "rgba(200,80,80,0.1)", color: "#D97066" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting} className="primary-btn mt-2 flex items-center justify-center gap-2 rounded-full py-3 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? submitLabel : "Save changes"}
          </button>
        </form>
      </main>
    </div>
  );
}
