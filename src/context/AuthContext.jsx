import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../lib/firebaseClient.js";

const AuthContext = createContext(null);

const FRIENDLY_ERRORS = {
  "auth/email-already-in-use": "That email already has an account. Try signing in instead.",
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
};

function friendlyError(err) {
  return FRIENDLY_ERRORS[err?.code] || err?.message || "Something went wrong. Please try again.";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signUp(email, password, fullName) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (fullName) {
        await updateProfile(cred.user, { displayName: fullName });
      }
      await sendEmailVerification(cred.user);
      return { user: cred.user, error: null };
    } catch (err) {
      return { user: null, error: friendlyError(err) };
    }
  }

  async function signIn(email, password) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return { user: cred.user, error: null };
    } catch (err) {
      return { user: null, error: friendlyError(err) };
    }
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (err) {
      return { error: friendlyError(err) };
    }
  }

  async function resendVerification() {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  }

  async function refreshUser() {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword, resendVerification, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
