import React, { createContext, useContext, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

export type Evento = {
  id: number;
  nome: string;
  data: string;   // ISO ou texto
  local: string;
  tenant?: string | null;
  arquivado?: boolean;
};

export type Ingresso = {
  id: number;
  eventoId: number;
  nomeEvento: string;
  data: string;
  local: string;
  foto?: string; // base64
};

type Ctx = {
  eventos: Evento[];
  ingressos: Ingresso[];
  criar: (e: Omit<Evento, 'id' | 'tenant' | 'arquivado'>) => void;
  atualizar: (e: Evento) => void;
  remover: (id: number) => void;
  arquivar: (id: number) => void;
  comprar: (evento: Evento) => void;
  refresh: () => void;
  anexarFoto: (ingressoId: number, base64: string) => void;
  removerFoto: (ingressoId: number) => void;
};

const EventsContext = createContext<Ctx | undefined>(undefined);

let _nextId = 1;
const nextId = () => _nextId++;

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tenant } = useAuth();

  const [eventos, setEventos] = useState<Evento[]>([
    { id: nextId(), nome: 'Show Indie Night', data: '2025-10-08 20:00', local: 'Casa da Música', tenant, arquivado: false },
    { id: nextId(), nome: 'Tech Conference', data: '2025-11-02 09:00', local: 'Expo Center', tenant, arquivado: false },
    { id: nextId(), nome: 'Stand-up Friday', data: '2025-10-18 21:30', local: 'Teatro Central', tenant, arquivado: false },
  ]);

  const [ingressos, setIngressos] = useState<Ingresso[]>([]);

  function criar(e: Omit<Evento, 'id' | 'tenant' | 'arquivado'>) {
    setEventos((prev) => [{ id: nextId(), tenant, arquivado: false, ...e }, ...prev]);
  }

  function atualizar(e: Evento) {
    setEventos(prev => prev.map(x => (x.id === e.id ? { ...e } : x)));
  }

  function remover(id: number) {
    setEventos(prev => prev.filter(x => x.id !== id));
    setIngressos(prev => prev.filter(i => i.eventoId !== id));
  }

  function arquivar(id: number) {
    setEventos(prev => prev.map(x => (x.id === id ? { ...x, arquivado: !x.arquivado } : x)));
  }

  function comprar(evento: Evento) {
    setIngressos(prev => [
      {
        id: nextId(),
        eventoId: evento.id,
        nomeEvento: evento.nome,
        data: evento.data,
        local: evento.local,
      },
      ...prev,
    ]);
  }

  function refresh() {
    setEventos(prev => [...prev].sort(() => Math.random() - 0.5));
  }

  function anexarFoto(ingressoId: number, base64: string) {
    setIngressos(prev => prev.map(i => (i.id === ingressoId ? { ...i, foto: base64 } : i)));
  }

  function removerFoto(ingressoId: number) {
    setIngressos(prev => prev.map(i => (i.id === ingressoId ? { ...i, foto: undefined } : i)));
  }

  const value = useMemo(
    () => ({ eventos, ingressos, criar, atualizar, remover, arquivar, comprar, refresh, anexarFoto, removerFoto }),
    [eventos, ingressos, tenant]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
};

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents must be used within EventsProvider');
  return ctx;
}
