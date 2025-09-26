import { useEffect, useRef, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import AuthForm from "./components/AuthForm/AuthForm";
import Dashboard from "./components/Dashboard/Dashboard";
import Eventos from "./components/Eventos/Eventos";
import MeusIngressos from "./components/MeusIngressos/MeusIngressos";
import Sobre from "./components/Sobre/Sobre";
import Footer from "./components/Footer/Footer";
import Toast from "./components/Toast/Toast";
import SkipLink from "./components/SkipLink/SkipLink";
import SassShowcase from "./components/SassShowcase/SassShowcase";
import CameraCapture from "./components/CameraCapture/CameraCapture";
import Diagnostics from "./components/Diagnostics/Diagnostics";
import CameraModal from "./components/CameraModal/CameraModal";
import ProtectedRoute from "./routes/ProtectedRoute";
import type { Evento } from "./components/EventoForm/EventoForm";

type Ingresso = Evento & { foto?: string };

function seed(tenant: string): Evento[] {
  return [
    { id: 1, nome: "Show de Rock", data: "2025-10-12", local: "Arena Central", tenant, arquivado: false },
    { id: 2, nome: "Festival de Comida", data: "2025-11-05", local: "Praça Verde", tenant, arquivado: false },
    { id: 3, nome: "Peça de Teatro", data: "2025-12-01", local: "Teatro Municipal", tenant, arquivado: false }
  ];
}

function AppShell() {
  const { isAuthenticated, user, tenant, logout } = useAuth();
  const [meusIngressos, setMeusIngressos] = useState<Ingresso[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [attachId, setAttachId] = useState<number | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const { useToast } = require("./context/ToastContext");
  const { show } = useToast();

  useEffect(() => {
    if (tenant) setEventos(seed(tenant));
  }, [tenant]);

  useEffect(() => {
    if (isAuthenticated && mainRef.current) mainRef.current.focus();
  }, [isAuthenticated]);

  function handleComprar(evento: Evento) {
    setMeusIngressos((prev) => [...prev, { ...evento, tenant: tenant || undefined, foto: undefined }]);
    show("success", `Ingresso comprado: ${evento.nome}`);
  }
  function criarEvento(e: Omit<Evento, "id">) {
    setEventos((prev) => {
      const nextId = (prev.reduce((m, it) => Math.max(m, it.id), 0) || 0) + 1;
      const novo = { ...e, id: nextId };
      show("success", `Evento criado: ${novo.nome}`);
      return [...prev, novo];
    });
  }
  function atualizarEvento(e: Evento) {
    setEventos((prev) => prev.map((it) => (it.id === e.id ? { ...it, ...e } : it)));
    show("info", `Evento atualizado: ${e.nome}`);
  }
  function removerEvento(id: number) {
    const alvo = eventos.find((it) => it.id === id);
    setEventos((prev) => prev.filter((it) => it.id !== id));
    show("error", `Evento removido: ${alvo?.nome || id}`);
  }
  function arquivarEvento(id: number) {
    const alvo = eventos.find((it) => it.id === id);
    setEventos((prev) => prev.map((it) => (it.id === id ? { ...it, arquivado: true } : it)));
    show("warn", `Evento arquivado: ${alvo?.nome || id}`);
  }
  function refreshEventos() {
    setEventos((prev) => [...prev].sort(() => Math.random() - 0.5));
    show("info", "Eventos atualizados");
  }
  function openAttachPhoto(id: number) {
    setAttachId(id);
  }
  function onCaptured(photo: string) {
    if (attachId == null) return;
    setMeusIngressos((prev) => prev.map((ing) => (ing.id === attachId ? { ...ing, foto: photo } : ing)));
    setAttachId(null);
    show("success", "Foto anexada ao ingresso.");
  }
  function onRemovePhoto(id: number) {
    setMeusIngressos((prev) => prev.map((ing) => (ing.id === id ? { ...ing, foto: undefined } : ing)));
    show("info", "Foto removida do ingresso.");
  }

  return (
    <>
      <SkipLink />
      {isAuthenticated && user && <Header username={user.displayName || user.email || ""} tenant={tenant || undefined} onLogout={logout} />}
      <main id="main-content" className="container" ref={mainRef} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthForm />}
          />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard eventos={eventos} totalIngressos={meusIngressos.length} />} />
            <Route
              path="/eventos"
              element={
                <Eventos
                  eventos={eventos}
                  onCriar={criarEvento}
                  onAtualizar={atualizarEvento}
                  onRemover={removerEvento}
                  onArquivar={arquivarEvento}
                  onComprar={handleComprar}
                  onRefresh={refreshEventos}
                />
              }
            />
            <Route
              path="/ingressos"
              element={
                <MeusIngressos
                  ingressos={meusIngressos}
                  onAttachPhoto={openAttachPhoto}
                  onRemovePhoto={onRemovePhoto}
                />
              }
            />
            <Route path="/camera" element={<CameraCapture />} />
            <Route path="/sass" element={<SassShowcase />} />
            <Route path="/diagnostico" element={<Diagnostics />} />
            <Route path="/sobre" element={<Sobre />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      {isAuthenticated && <Footer />}
      <Toast />
      {attachId !== null && <CameraModal onClose={() => setAttachId(null)} onCapture={onCaptured} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
