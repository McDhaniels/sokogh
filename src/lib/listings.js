import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit as fsLimit,
  onSnapshot,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "./firebaseClient.js";

const listingsRef = collection(db, "listings");

export async function createListing({ title, price, description, category, location, condition, hours, photos, contactMethod, businessName, sellerId, sellerName }) {
  const docRef = await addDoc(listingsRef, {
    title,
    price: Number(price),
    description,
    category,
    location,
    condition: condition || null,
    hours: hours || null,
    photos: photos || [],
    contactMethod,
    businessName: businessName || null,
    sellerId,
    sellerName,
    status: "pending",
    rejectionReason: null,
    views: 0,
    messageCount: 0,
    boosted: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getRecentListings(count = 8) {
  const q = query(listingsRef, where("status", "==", "active"), orderBy("createdAt", "desc"), fsLimit(count));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getListingsByCategory(category, count = 24) {
  const base = category
    ? query(listingsRef, where("status", "==", "active"), where("category", "==", category), orderBy("createdAt", "desc"), fsLimit(count))
    : query(listingsRef, where("status", "==", "active"), orderBy("createdAt", "desc"), fsLimit(count));
  const snap = await getDocs(base);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getListingById(id) {
  const snap = await getDoc(doc(db, "listings", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function subscribePendingListings(callback, onError) {
  const q = query(listingsRef, where("status", "==", "pending"), orderBy("createdAt", "asc"));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error("subscribePendingListings error:", err);
      if (onError) onError(err);
    }
  );
}

export function subscribeSellerListings(sellerId, callback, onError) {
  const q = query(listingsRef, where("sellerId", "==", sellerId), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error("subscribeSellerListings error:", err);
      if (onError) onError(err);
    }
  );
}

export async function updateListing(id, data) {
  await updateDoc(doc(db, "listings", id), data);
}

export async function approveListing(id) {
  await updateDoc(doc(db, "listings", id), { status: "active", rejectionReason: null });
}

export async function rejectListing(id, reason) {
  await updateDoc(doc(db, "listings", id), { status: "rejected", rejectionReason: reason });
}

export async function deleteListing(id) {
  await deleteDoc(doc(db, "listings", id));
}

export async function incrementViews(id) {
  await updateDoc(doc(db, "listings", id), { views: increment(1) });
}

export async function incrementMessageCount(id) {
  await updateDoc(doc(db, "listings", id), { messageCount: increment(1) });
}
