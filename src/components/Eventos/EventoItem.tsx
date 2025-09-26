import { useRef, useState } from "react";
import styles from "./EventoItem.module.css";
import type { Evento } from "../EventoForm/EventoForm";

type Props = {
  evento: Evento;
  onComprar: (e: Evento) => void;
  onEditar: (e: Evento) => void;
  onRemover: (id: number) => void;
  onArquivar: (id: number) => void;
  onDetalhe: (e: Evento) => void;
};

export default function EventoItem({
  evento,
  onComprar,
  onEditar,
  onRemover,
  onArquivar,
  onDetalhe,
}: Props) {
  const startX = useRef<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(true);

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (startX.current == null) return;
    const dx = e.touches[0].clientX - startX.current;
    setRevealed(dx < -48);
    if (dx < -8) setShowHint(false);
  }
  function onTouchEnd() {
    startX.current = null;
  }

  function toggleActions() {
    setRevealed((r) => !r);
    setShowHint(false);
  }

  return (
    <li
      className={`${styles.item} ${revealed ? styles.revealed : ""} ${
        evento.arquivado ? styles.archived : ""
      }`}
      role="listitem"
      aria-label={`Evento ${evento.nome}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.mainRow}>
        <button
          className={styles.main}
          onClick={() => onDetalhe(evento)}
          aria-label={`Ver detalhes do evento ${evento.nome}`}
        >
          <div className={styles.info}>
            <strong className={styles.title}>{evento.nome}</strong>
            <div className={styles.meta}>
              <span>Data: {evento.data}</span>
              <span>Local: {evento.local}</span>
            </div>
            {evento.arquivado && (
              <span className={styles.tag} aria-label="Evento arquivado">
                Arquivado
              </span>
            )}
          </div>
          {showHint && (
            <span className={styles.swipeHint} aria-hidden="true">
              ⟵ deslize
            </span>
          )}
        </button>

        <button
          className={styles.reveal}
          aria-expanded={revealed}
          aria-controls={`actions-${evento.id}`}
          onClick={toggleActions}
        >
          Ações
        </button>
      </div>

      <div id={`actions-${evento.id}`} className={styles.actions}>
        <button
          className={styles.btn}
          onClick={() => onComprar(evento)}
          aria-label={`Comprar ingresso para ${evento.nome}`}
        >
          Comprar
        </button>
        <button
          className={styles.btn}
          onClick={() => onEditar(evento)}
          aria-label={`Editar evento ${evento.nome}`}
        >
          Editar
        </button>
        <button
          className={styles.warn}
          onClick={() => onArquivar(evento.id)}
          aria-label={`Arquivar evento ${evento.nome}`}
        >
          Arquivar
        </button>
        <button
          className={styles.danger}
          onClick={() => onRemover(evento.id)}
          aria-label={`Remover evento ${evento.nome}`}
        >
          Remover
        </button>
      </div>
    </li>
  );
}
