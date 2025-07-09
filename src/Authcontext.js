import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeApp }          from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import firebaseConfig from "../firebaseConfig";

/* Init Firebase only once */
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* Context boilerplate */
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // null = not logged in yet
  const [loading, setLoading] = useState(true); // true until first auth state arrives

  /* Listen once on mount */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* Helper methods */
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  /* Provide everything */
  const value = { user, loading, login, signup, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* nice hook so you can just do  const {user} = useAuth() */
export function useAuth() {
  return useContext(AuthContext);
}