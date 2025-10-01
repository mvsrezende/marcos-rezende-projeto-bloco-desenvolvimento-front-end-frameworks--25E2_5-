import React, { createContext, useContext, useMemo, useState } from "react";
import type { Evento, Ingresso } from "../types";
import { useToast } from "./ToastContext";

type Ctx = {
  eventos: Evento[];
  ingressos: Ingresso[];
  criarEvento: (e: Omit<Evento, "id">) => void;
  atualizarEvento: (e: Evento) => void;
  removerEvento: (id: number) => void;
  arquivarEvento: (id: number) => void;
  comprar: (ev: Evento) => void;
  anexarFoto: (ingressoId: number, base64: string) => void;
  removerFoto: (ingressoId: number) => void;
  refreshEventos: () => void;
};

const AppDataContext = createContext<Ctx | undefined>(undefined);

let nextId = 1;
let nextIngId = 1;

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { show } = useToast();
  const [eventos, setEventos] = useState<Evento[]>([
    { id: nextId++, nome: "Rock Fest", data: "2025-10-15", local: "Arena Centro" },
    { id: nextId++, nome: "Tech Summit", data: "2025-11-01", local: "Auditório Infnet" }
  ]);
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);

  function criarEvento(e: Omit<Evento, "id">) {
    setEventos(prev => [...prev, { ...e, id: nextId++ }]);
    show("success", "Evento criado");
  }
  function atualizarEvento(e: Evento) {
    setEventos(prev => prev.map(x => x.id === e.id ? e : x));
    show("success", "Evento atualizado");
  }
  function removerEvento(id: number) {
    setEventos(prev => prev.filter(x => x.id !== id));
    show("info", "Evento removido");
  }
  function arquivarEvento(id: number) {
    setEventos(prev => prev.map(x => x.id === id ? { ...x, arquivado: true } : x));
    show("info", "Evento arquivado");
  }
  function comprar(ev: Evento) {
    setIngressos(prev => [...prev, { id: nextIngId++, eventoId: ev.id, nomeEvento: ev.nome, data: ev.data, local: ev.local }]);
    show("success", "Ingresso adicionado");
  }
  function anexarFoto(ingressoId: number, base64: string) {
    setIngressos(prev => prev.map(i => i.id === ingressoId ? { ...i, foto: base64 } : i));
    show("success", "Foto anexada ao ingresso");
  }
  function removerFoto(ingressoId: number) {
    setIngressos(prev => prev.map(i => i.id === ingressoId ? { ...i, foto: undefined } : i));
    show("info", "Foto removida");
  }
  function refreshEventos() {
    setEventos(prev => [...prev].sort(() => Math.random() - 0.5));
    show("info", "Eventos atualizados");
  }

  const value = useMemo(() => ({ eventos, ingressos, criarEvento, atualizarEvento, removerEvento, arquivarEvento, comprar, anexarFoto, removerFoto, refreshEventos }), [eventos, ingressos]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData deve ser usado dentro de AppDataProvider");
  return ctx;
}
