import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from "firebase/auth";

type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  tenant: string | null;
  login: (email: string, senha: string, tenant?: string) => Promise<void>;
  signup: (email: string, senha: string, tenant?: string) => Promise<void>;
  logout: () => Promise<void>;
  setTenant: (t: string | null) => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function login(email: string, senha: string, t?: string) {
    if (t) setTenant(t);
    await signInWithEmailAndPassword(auth, email, senha);
  }
  async function signup(email: string, senha: string, t?: string) {
    if (t) setTenant(t);
    await createUserWithEmailAndPassword(auth, email, senha);
  }
  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, tenant, setTenant, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
