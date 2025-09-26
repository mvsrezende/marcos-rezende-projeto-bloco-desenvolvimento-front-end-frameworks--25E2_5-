import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  User
} from "firebase/auth";
import { auth } from "../services/firebase";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  tenant: string | null;
  login: (email: string, password: string, tenant?: string) => Promise<void>;
  signup: (email: string, password: string, tenant?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<string | null>(() => {
    try {
      return localStorage.getItem("tenant") || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    try {
      if (tenant) localStorage.setItem("tenant", tenant);
    } catch {}
  }, [tenant]);

  async function login(email: string, password: string, t?: string) {
    await signInWithEmailAndPassword(auth, email, password);
    if (t) setTenant(t);
  }

  async function signup(email: string, password: string, t?: string) {
    await createUserWithEmailAndPassword(auth, email, password);
    if (t) setTenant(t);
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, tenant, login, signup, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
