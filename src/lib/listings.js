import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit as fsLimit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseClient.js";

const listingsRef = collection(db, "listings");

export async function createListing({ title, price, description, category, location, photosCount, contactMethod, sellerId, sellerName }) {
  const docRef = await addDoc(listingsRef, {
    title,
    price: Number(price),
    description,
    category,
    location,
    photosCount,
    contactMethod,
    sellerId,
    sellerName,
    status: "active",
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
