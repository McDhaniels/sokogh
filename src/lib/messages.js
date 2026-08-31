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
} from "firebase/firestore";
import { db } from "./firebaseClient.js";

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
  return docRef.id;
}

export function subscribeToConversations(userId, callback) {
  const q = query(
    conversationsRef,
    where("participants", "array-contains", userId),
    orderBy("lastMessageAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeToMessages(conversationId, callback) {
  const messagesRef = collection(db, "conversations", conversationId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
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
