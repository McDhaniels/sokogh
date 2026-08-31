import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Camera, X, Smartphone, Car, Shirt, Home as HomeIcon, Briefcase, Sofa, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { createListing } from "../lib/listings.js";
import { uploadImages } from "../lib/cloudinary.js";
import VerifyEmailPrompt from "../components/VerifyEmailPrompt.jsx";

const STEPS = ["Category", "Details", "Photos", "Contact"];
const MAX_PHOTOS = 4;

const CATEGORIES = [
  { name: "Electronics", icon: Smartphone },
  { name: "Vehicles", icon: Car },
  { name: "Fashion", icon: Shirt },
  { name: "Real Estate", icon: HomeIcon },
  { name: "Services", icon: Briefcase },
  { name: "Home & Furniture", icon: Sofa },
];

export default function PostAd() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [contactMethod, setContactMethod] = useState("Chat on SokoGH");
  const [businessName, setBusinessName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitLabel, setSubmitLabel] = useState("Submit ad");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  useEffect(() => {
    return () => photoPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [photoPreviews]);

  function handleAddPhotos(e) {
    const files = Array.from(e.target.files || []).slice(0, MAX_PHOTOS - photoFiles.length);
    if (files.length === 0) return;
    setPhotoFiles((prev) => [...prev, ...files]);
    setPhotoPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  }

  function removePhoto(index) {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  const canAdvance =
    (step === 0 && category) ||
    (step === 1 && title && price && location) ||
    step === 2 ||
    step === 3;

  async function handleSubmit() {
    setError("");
    setSubmitting(true);
    try {
      let photoUrls = [];
      if (photoFiles.length > 0) {
        setSubmitLabel("Uploading photos…");
        photoUrls = await uploadImages(photoFiles);
      }
      setSubmitLabel("Posting…");
      const id = await createListing({
        title,
        price,
        description,
        category,
        location,
        photos: photoUrls,
        contactMethod,
        businessName: businessName || null,
        sellerId: user.uid,
        sellerName: user.displayName || user.email,
      });
      navigate(`/listing/${id}`);
    } catch (err) {
      setError("Couldn't post your ad right now. Please try again.");
      setSubmitting(false);
      setSubmitLabel("Submit ad");
    }
  }

  async function handleResend() {
    await resendVerification();
    setResendSent(true);
  }

  async function handleCheckVerified() {
    setCheckingVerified(true);
    await refreshUser();
    setCheckingVerified(false);
  }

  if (loading || !user) return null;

  if (!user.emailVerified) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center px-5 font-body">
        <div className="w-full max-w-md">
          <VerifyEmailPrompt message={`Verify ${user.email} before posting an ad — check your inbox for the link.`} />
          <Link to="/" className="mt-6 block text-center text-sm" style={{ color: "var(--muted)" }}>Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full font-body">
      <header className="border-b" style={{ borderColor: "rgba(245,240,232,0.08)" }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}><ArrowLeft size={14} /> Cancel</Link>
          <div className="flex items-center gap-1">
            <span className="font-mark text-xl" style={{ color: "var(--gold)" }}>Soko</span>
            <span className="font-display text-xl font-semibold">GH</span>
          </div>
          <div className="w-14" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="mb-2 font-display text-2xl font-semibold sm:text-3xl">Post an ad</h1>
        <p className="mb-8 text-sm" style={{ color: "var(--muted)" }}>Takes about 2 minutes. We'll review it before it goes live.</p>

        <div className="mb-10 flex items-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div className="step-dot flex h-8 w-8 items-center justify-center rounded-full font-display text-xs font-semibold" style={{ background: i <= step ? "var(--gold)" : "var(--surface-2)", color: i <= step ? "#0F0E0C" : "var(--muted)" }}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className="hidden text-xs sm:block" style={{ color: i <= step ? "var(--text)" : "var(--muted)" }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className="step-line mx-2 h-0.5 flex-1" style={{ background: i < step ? "var(--gold)" : "rgba(245,240,232,0.1)" }} />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <h2 className="mb-4 font-display text-lg font-semibold">What are you listing?</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CATEGORIES.map(({ name, icon: Icon }) => (
                <button key={name} onClick={() => setCategory(name)} className="cat-tile flex flex-col items-center gap-2 rounded-2xl border px-4 py-6" style={{ borderColor: category === name ? "var(--gold)" : "rgba(245,240,232,0.1)", background: category === name ? "var(--surface-2)" : "var(--surface)" }}>
                  <Icon size={22} style={{ color: "var(--gold)" }} />
                  <span className="font-display text-sm font-medium">{name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block font-display text-sm font-medium">Title</label>
              <div className="field rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. iPhone 13 Pro — 256GB" maxLength={70} className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
              </div>
              <p className="mt-1 text-right text-xs" style={{ color: "var(--muted)" }}>{title.length}/70</p>
            </div>

            <div>
              <label className="mb-2 block font-display text-sm font-medium">Price (GH₵)</label>
              <div className="field rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
                <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))} placeholder="0.00" inputMode="numeric" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
              </div>
              {price && <p className="mt-1 text-xs" style={{ color: "var(--gold)" }}>Buyers will see: GH₵ {Number(price).toLocaleString()}</p>}
            </div>

            <div>
              <label className="mb-2 block font-display text-sm font-medium">Location</label>
              <div className="field rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Kumasi, Ashanti Region" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-display text-sm font-medium">Description</label>
              <div className="field rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Condition, why you're selling, anything a buyer should know…" maxLength={500} rows={4} className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
              </div>
              <p className="mt-1 text-right text-xs" style={{ color: "var(--muted)" }}>{description.length}/500</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-1 font-display text-lg font-semibold">Add photos</h2>
            <p className="mb-4 text-sm" style={{ color: "var(--muted)" }}>
              Listings with clear photos get far more messages. Add up to {MAX_PHOTOS}.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {photoPreviews.map((url, i) => (
                <div key={url} className="group relative aspect-square overflow-hidden rounded-2xl border-2" style={{ borderColor: "var(--gold)" }}>
                  <img src={url} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ background: "rgba(15,14,12,0.75)", color: "var(--text)" }}
                    aria-label="Remove photo"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
              {photoFiles.length < MAX_PHOTOS && (
                <label className="photo-slot flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed" style={{ borderColor: "rgba(245,240,232,0.15)", background: "var(--surface)" }}>
                  <Camera size={20} style={{ color: "var(--muted)" }} />
                  <span className="text-xs" style={{ color: "var(--muted)" }}>Add photo</span>
                  <input type="file" accept="image/*" multiple onChange={handleAddPhotos} className="hidden" />
                </label>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="mb-4 font-display text-lg font-semibold">How should buyers reach you?</h2>
            <div className="flex flex-col gap-3">
              {["Chat on SokoGH", "WhatsApp", "Phone call"].map((opt) => (
                <label key={opt} className="field flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
                  <span className="text-sm">{opt}</span>
                  <input type="radio" name="contact" checked={contactMethod === opt} onChange={() => setContactMethod(opt)} className="accent-[#D4A544]" />
                </label>
              ))}
            </div>

            <div className="mt-5">
              <label className="mb-2 block font-display text-sm font-medium">Business or shop name <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
              <div className="field rounded-xl border px-4 py-3" style={{ borderColor: "rgba(245,240,232,0.14)", background: "var(--surface)" }}>
                <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Kwame's Electronics" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
              </div>
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Shown on your listing instead of your name, if you'd rather sell under a business name.</p>
            </div>

            <div className="mt-6 rounded-xl border p-4 text-xs" style={{ borderColor: "rgba(27,67,50,0.4)", background: "rgba(27,67,50,0.15)", color: "var(--muted)" }}>
              Your exact phone number stays hidden until a buyer taps "Reveal" — you're always in control of who can contact you.
            </div>
            {error && (
              <div className="mt-4 rounded-xl border px-4 py-3 text-xs" style={{ borderColor: "rgba(200,80,80,0.4)", background: "rgba(200,80,80,0.1)", color: "#D97066" }}>
                {error}
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} className="text-sm" style={{ color: "var(--muted)", visibility: step === 0 ? "hidden" : "visible" }}>Back</button>
          {step === STEPS.length - 1 ? (
            <button disabled={submitting} onClick={handleSubmit} className="primary-btn flex items-center gap-2 rounded-full px-8 py-3 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? submitLabel : "Submit ad"}
            </button>
          ) : (
            <button disabled={!canAdvance} onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} className="primary-btn rounded-full px-8 py-3 font-display text-sm font-semibold" style={{ background: "var(--gold)", color: "#0F0E0C" }}>
              Continue
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
