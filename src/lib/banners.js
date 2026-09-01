import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseClient.js";

const bannersRef = collection(db, "banners");

export async function createBanner({ imageUrl, linkUrl }) {
  await addDoc(bannersRef, {
    imageUrl,
    linkUrl: linkUrl || null,
    active: true,
    createdAt: serverTimestamp(),
  });
}

export function subscribeBanners(callback, onError) {
  const q = query(bannersRef, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error("subscribeBanners error:", err);
      if (onError) onError(err);
    }
  );
}

export async function getActiveBanners() {
  const q = query(bannersRef, where("active", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function setBannerActive(id, active) {
  await updateDoc(doc(db, "banners", id), { active });
}

export async function deleteBanner(id) {
  await deleteDoc(doc(db, "banners", id));
}
