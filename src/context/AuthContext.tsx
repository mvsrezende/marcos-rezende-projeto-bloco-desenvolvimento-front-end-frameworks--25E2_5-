import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../services/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

type UserData = {
  uid: string;
  email: string;
  name?: string | null;
  tenant: string;
};

type AuthCtx = {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (email: string, password: string, tenant: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    tenant: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);
const TENANT_KEY = "ingressos_tenant";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      const savedTenant = localStorage.getItem(TENANT_KEY) || "default";
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          email: fbUser.email || "",
          name: fbUser.displayName,
          tenant: savedTenant,
        });
      } else {
        setUser(null);
      }
      setReady(true);
    });
    return () => unsub();
  }, []);

  async function login(email: string, password: string, tenant: string) {
    await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem(TENANT_KEY, tenant || "default");
    const fbUser = auth.currentUser;
    if (fbUser) {
      setUser({
        uid: fbUser.uid,
        email: fbUser.email || "",
        name: fbUser.displayName,
        tenant: tenant || "default",
      });
    }
  }

  async function signup(
    name: string,
    email: string,
    password: string,
    tenant: string
  ) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
    localStorage.setItem(TENANT_KEY, tenant || "default");
    const fbUser = auth.currentUser;
    if (fbUser) {
      setUser({
        uid: fbUser.uid,
        email: fbUser.email || "",
        name: fbUser.displayName,
        tenant: tenant || "default",
      });
    }
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem(TENANT_KEY);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      isAuthenticated: !!user,
      user,
      login,
      signup,
      logout,
    }),
    [user]
  );

  if (!ready) return null;

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
