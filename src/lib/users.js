import { doc, getDoc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseClient.js";

export async function syncUserProfile(uid, { displayName, email, emailVerified }) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: displayName || null,
      email,
      emailVerified: !!emailVerified,
      createdAt: serverTimestamp(),
      completedDeals: 0,
    });
  } else {
    await setDoc(ref, { displayName: displayName || null, email, emailVerified: !!emailVerified }, { merge: true });
  }
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function incrementCompletedDeals(uid, delta) {
  await setDoc(doc(db, "users", uid), { completedDeals: increment(delta) }, { merge: true });
}
