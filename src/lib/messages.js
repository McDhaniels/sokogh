import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebaseClient.js";
import { incrementMessageCount } from "./listings.js";
import { incrementCompletedDeals } from "./users.js";

const conversationsRef = collection(db, "conversations");

export async function getOrCreateConversation({ listingId, listingTitle, buyerId, buyerName, sellerId, sellerName }) {
  const q = query(
    conversationsRef,
    where("listingId", "==", listingId),
    where("participants", "array-contains", buyerId)
  );
  const snap = await getDocs(q);
  const existing = snap.docs.find((d) => d.data().sellerId === sellerId);
  if (existing) return existing.id;

  const docRef = await addDoc(conversationsRef, {
    listingId,
    listingTitle,
    buyerId,
    buyerName,
    sellerId,
    sellerName,
    participants: [buyerId, sellerId],
    lastMessage: "",
    lastMessageAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
  await incrementMessageCount(listingId);
  return docRef.id;
}

export function subscribeToConversations(userId, callback, onError) {
  const q = query(
    conversationsRef,
    where("participants", "array-contains", userId),
    orderBy("lastMessageAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error("subscribeToConversations error:", err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToMessages(conversationId, callback, onError) {
  const messagesRef = collection(db, "conversations", conversationId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error("subscribeToMessages error:", err);
      if (onError) onError(err);
    }
  );
}

export async function markDealOutcome(conversationId, outcome, uid) {
  const convRef = doc(db, "conversations", conversationId);
  const convSnap = await getDoc(convRef);
  const data = convSnap.exists() ? convSnap.data() : null;
  const previousOutcome = data?.dealOutcome || null;
  const sellerId = data?.sellerId || null;

  await updateDoc(convRef, {
    dealOutcome: outcome,
    dealOutcomeBy: uid,
    dealOutcomeAt: serverTimestamp(),
  });

  if (sellerId) {
    if (outcome === "completed" && previousOutcome !== "completed") {
      await incrementCompletedDeals(sellerId, 1);
    } else if (outcome !== "completed" && previousOutcome === "completed") {
      await incrementCompletedDeals(sellerId, -1);
    }
  }
}

export function subscribeAllConversationsForAdmin(callback, onError) {
  return onSnapshot(
    conversationsRef,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error("subscribeAllConversationsForAdmin error:", err);
      if (onError) onError(err);
    }
  );
}

export async function sendMessage(conversationId, senderId, text) {
  const messagesRef = collection(db, "conversations", conversationId, "messages");
  await addDoc(messagesRef, {
    senderId,
    text,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "conversations", conversationId), {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
  });
}
