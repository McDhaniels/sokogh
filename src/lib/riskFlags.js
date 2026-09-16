const SUSPICIOUS_PHRASES = [
  "advance payment", "advance fee", "processing fee", "reservation fee",
  "booking fee", "transport fee", "fuel fee", "insurance fee",
  "western union", "money gram", "moneygram", "double your money",
  "investment opportunity", "send money first", "trust me", "urgent sale",
  "no time to inspect", "traveling tonight", "another buyer is coming",
  "pay before delivery",
];

const PHONE_PATTERN = /\b0\d{9}\b|\b\+?233\d{9}\b/;
const EMAIL_PATTERN = /[\w.-]+@[\w.-]+\.\w+/;

export function getRiskFlags(listing) {
  const flags = [];
  const text = `${listing.title || ""} ${listing.description || ""}`.toLowerCase();

  const matchedPhrase = SUSPICIOUS_PHRASES.find((phrase) => text.includes(phrase));
  if (matchedPhrase) {
    flags.push(`Suspicious wording: "${matchedPhrase}"`);
  }

  if (PHONE_PATTERN.test(text)) {
    flags.push("Contains a phone number in the text (bypassing chat)");
  }

  if (EMAIL_PATTERN.test(text)) {
    flags.push("Contains an email address in the text (bypassing chat)");
  }

  if (Number(listing.price) === 0) {
    flags.push("Price is GH₵ 0");
  }

  return flags;
}
