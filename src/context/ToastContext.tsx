import React, { createContext, useContext, useMemo, useState } from "react";

export type ToastKind = "success" | "info" | "warn" | "error";
export type Toast = { id: number; kind: ToastKind; message: string };

type ToastCtx = {
  toasts: Toast[];
  show: (kind: ToastKind, message: string, ms?: number) => void;
  remove: (id: number) => void;
};

const ToastContext = createContext<ToastCtx | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function remove(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function show(kind: ToastKind, message: string, ms = 3000) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, kind, message }]);
    if (ms > 0) setTimeout(() => remove(id), ms);
  }

  const value = useMemo(() => ({ toasts, show, remove }), [toasts]);

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return ctx;
}
