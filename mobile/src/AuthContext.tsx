// src/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, firebaseInitError } from './firebase';

type UserLike = { uid: string; email: string | null } | null;

type Ctx = {
  user: UserLike;
  isAuthenticated: boolean;
  loading: boolean;
  tenant: string | null;
  error: string | null;
  login: (email: string, password: string, tenant?: string) => Promise<void>;
  signup: (email: string, password: string, tenant?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<Ctx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserLike>(null);
  const [tenant, setTenant] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(firebaseInitError ?? null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setError(prev => prev ?? 'Auth não inicializou');
      return;
    }
    try {
      const unsub = auth.onAuthStateChanged((u: any) => {
        setUser(u ? { uid: u.uid, email: u.email ?? null } : null);
        setLoading(false);
      }, (e: any) => {
        setError(`onAuthStateChanged erro: ${e?.message ?? String(e)}`);
        setLoading(false);
      });
      return unsub;
    } catch (e: any) {
      setError(`Falha ao registrar listener: ${e?.message ?? String(e)}`);
      setLoading(false);
    }
  }, []);

  async function login(email: string, password: string, t?: string) {
    if (!auth) throw new Error('Auth indisponível');
    setTenant(t ?? null);
    await auth.signInWithEmailAndPassword(email, password);
  }

  async function signup(email: string, password: string, t?: string) {
    if (!auth) throw new Error('Auth indisponível');
    setTenant(t ?? null);
    await auth.createUserWithEmailAndPassword(email, password);
  }

  async function logout() {
    if (!auth) return;
    await auth.signOut();
  }

  const value: Ctx = { user, isAuthenticated: !!user, loading, tenant, error, login, signup, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
