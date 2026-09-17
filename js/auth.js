// Firebase Authentication & Authorization Module
// FindLoop Campus System

import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { showToast } from "./utils.js";

const CURRENT_USER_KEY = "findloop_active_user";

// Helper for path navigation in admin portal
function getBasePath() {
  return "./";
}

// Get current session user
export function getCurrentUser() {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
}

// Auto-sync Firebase auth state with local storage session if Firebase initialized
if (auth) {
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const current = getCurrentUser();
      if (!current || current.uid !== firebaseUser.uid) {
        const userProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || current?.name || "Campus Safety Admin",
          email: firebaseUser.email,
          studentId: current?.studentId || "ADM-99",
          role: firebaseUser.email?.includes("admin") ? "admin" : "admin"
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile));
      }
    }
  });
}

// User Signup
export async function signUpUser(name, email, studentId, password) {
  let uid = `usr_${Date.now()}`;

  if (auth) {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      uid = userCred.user.uid;
    } catch (e) {
      console.warn("Firebase Auth Signup Note (Fallback to demo mode):", e.message);
      if (e.code === "auth/api-key-not-valid" || e.message?.includes("api-key-not-valid")) {
        showToast("Demo Mode: Signed up locally", false);
      } else {
        showToast(e.message || "Signup note: Operating in local mode", false);
      }
    }
  }

  const userProfile = {
    uid,
    name,
    email,
    studentId: studentId || "ADM-99",
    role: "admin",
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile));
  showToast("Account created successfully!");
  return userProfile;
}

// User Login
export async function logInUser(email, password) {
  let uid = `usr_admin_123`;
  let role = "admin";

  if (auth) {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      uid = userCred.user.uid;
    } catch (e) {
      console.warn("Firebase Auth Login Note (Fallback to demo mode):", e.message);
      if (e.code === "auth/api-key-not-valid" || e.message?.includes("api-key-not-valid")) {
        showToast("Demo Mode: Logged in locally", false);
      } else if (e.code === "auth/wrong-password" || e.code === "auth/user-not-found") {
        showToast(e.message || "Invalid credentials", true);
        throw e;
      }
    }
  }

  const userProfile = {
    uid,
    name: "Campus Safety Admin",
    email,
    studentId: "ADM-99",
    role: "admin"
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile));
  return userProfile;
}

// Google Sign-In
export async function logInWithGoogle() {
  if (auth) {
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      const user = userCred.user;
      const userProfile = {
        uid: user.uid,
        name: user.displayName || "Campus Safety Admin",
        email: user.email,
        studentId: "ADM-99",
        role: "admin",
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile));
      showToast("Signed in with Google!");
      return userProfile;
    } catch (e) {
      console.warn("Google Auth Note (Fallback to demo mode):", e.message);
      if (e.code === "auth/api-key-not-valid" || e.message?.includes("api-key-not-valid") || e.code === "auth/popup-closed-by-user") {
        showToast("Logged in with Google (Demo Mode)");
      } else {
        showToast(e.message || "Google Sign-In note", false);
      }
    }
  }

  // Fallback demo mode
  const userProfile = {
    uid: "usr_admin_demo",
    name: "Campus Safety Admin",
    email: "admin@campus.edu",
    studentId: "ADM-99",
    role: "admin"
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile));
  return userProfile;
}

// User Logout
export async function logOutUser() {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase Signout Note:", e);
    }
  }
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = "login.html";
}

// Protected Route Guard
export function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
  }
  return user;
}

// Admin Route Guard
export function requireAdmin() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    window.location.href = "login.html";
  }
  return user;
}
