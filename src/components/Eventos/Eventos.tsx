import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Eventos.module.css";
import type { Evento } from "../EventoForm/EventoForm";
import { useToast } from "../../context/ToastContext";

type Props = {
  eventos: Evento[];
  onCriar: (e: Omit<Evento, "id">) => void;
  onAtualizar: (e: Evento) => void;
  onRemover: (id: number) => void;
  onArquivar: (id: number) => void;
  onComprar: (evento: Evento) => void;
  onRefresh: () => void;
};

export default function Eventos({
  eventos,
  onCriar,
  onAtualizar,
  onRemover,
  onArquivar,
  onComprar,
  onRefresh
}: Props) {
  const [query, setQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [pull, setPull] = useState(0);
  const pulling = useRef(false);
  const startY = useRef(0);
  const { show } = useToast();

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return eventos.filter((e) => !e.arquivado);
    return eventos.filter(
      (e) =>
        !e.arquivado &&
        (e.nome.toLowerCase().includes(q) ||
          e.local.toLowerCase().includes(q) ||
          e.data.includes(q))
    );
  }, [eventos, query]);

  function handleTouchStart(e: React.TouchEvent) {
    if (!scrollRef.current) return;
    if (scrollRef.current.scrollTop === 0) {
      pulling.current = true;
      startY.current = e.touches[0].clientY;
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!pulling.current) return;
    const delta = e.touches[0].clientY - startY.current;
    const amt = Math.max(0, Math.min(80, delta));
    setPull(amt);
  }

  function handleTouchEnd() {
    if (!pulling.current) return;
    if (pull > 60) {
      setPull(60);
      setTimeout(() => {
        onRefresh();
        setPull(0);
      }, 250);
    } else {
      setPull(0);
    }
    pulling.current = false;
  }

  useEffect(() => {
    if (pull === 0) return;
  }, [pull]);

  return (
    <section id="eventos" className={styles.eventos} aria-labelledby="eventosTitle">
      <div className={styles.headRow}>
        <h2 id="eventosTitle" className={styles.title}>Eventos</h2>
        <div className={styles.tools}>
          <label className={styles.searchLabel}>
            Buscar
            <input
              className={styles.search}
              placeholder="Nome, local ou data"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar eventos"
            />
          </label>
          <button
            className={styles.create}
            onClick={() => {
              const nome = prompt("Nome do evento:");
              if (!nome) return;
              const data = prompt("Data (YYYY-MM-DD):", "2025-12-01") || "";
              const local = prompt("Local:", "Local padrão") || "";
              onCriar({ nome, data, local, tenant: "", arquivado: false });
              show("success", "Evento criado.");
            }}
          >
            Novo evento
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={styles.scrollArea}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.ptr} style={{ height: pull }}>
          <div className={styles.ptrInner}>
            {pull >= 60 ? <div className={styles.spinner} /> : <div className={styles.ptrText}>Puxe para atualizar</div>}
          </div>
        </div>

        {filtrados.length === 0 ? (
          <p className={styles.empty}>Nenhum evento encontrado.</p>
        ) : (
          <ul className={styles.grid}>
            {filtrados.map((e) => (
              <li key={e.id} className={styles.card} aria-label={`Evento ${e.nome}`}>
                <div className={styles.cardHeader}>
                  <strong className={styles.cardTitle}>{e.nome}</strong>
                  <span className={styles.badge}>{e.data}</span>
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.local}>{e.local}</span>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.buy} onClick={() => onComprar(e)} aria-label={`Comprar ingresso para ${e.nome}`}>
                    Comprar
                  </button>
                  <button
                    className={styles.edit}
                    onClick={() => {
                      const nome = prompt("Novo nome:", e.nome) || e.nome;
                      const data = prompt("Nova data:", e.data) || e.data;
                      const local = prompt("Novo local:", e.local) || e.local;
                      onAtualizar({ ...e, nome, data, local });
                    }}
                  >
                    Editar
                  </button>
                  <button className={styles.archive} onClick={() => onArquivar(e.id)}>Arquivar</button>
                  <button className={styles.remove} onClick={() => onRemover(e.id)}>Remover</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
