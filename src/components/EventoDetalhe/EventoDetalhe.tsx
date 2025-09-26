import { useEffect, useRef } from "react";
import styles from "./EventoDetalhe.module.css";
import type { Evento } from "../EventoForm/EventoForm";

type Props = {
  evento: Evento;
  onClose: () => void;
};

export default function EventoDetalhe({ evento, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  function onBackdrop(e: React.MouseEvent) {
    if (e.target === dialogRef.current) onClose();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
  }

  return (
    <div
      className={styles.backdrop}
      ref={dialogRef}
      onMouseDown={onBackdrop}
      onKeyDown={onKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detTitle"
      aria-describedby="detBody"
    >
      <div className={styles.modal}>
        <h3 id="detTitle">Detalhes do Evento</h3>
        <div id="detBody" className={styles.content}>
          <div>
            <strong>Nome:</strong> {evento.nome}
          </div>
          <div>
            <strong>Data:</strong> {evento.data}
          </div>
          <div>
            <strong>Local:</strong> {evento.local}
          </div>
          {evento.tenant && (
            <div>
              <strong>Espaço/Empresa:</strong> {evento.tenant}
            </div>
          )}
          {evento.arquivado && (
            <div className={styles.badge} aria-label="Evento arquivado">
              Arquivado
            </div>
          )}
        </div>
        <div className={styles.actions}>
          <button
            ref={closeRef}
            className={styles.close}
            onClick={onClose}
            aria-label="Fechar detalhes do evento"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
