import { useEffect, useRef, useState } from "react";
import styles from "./EventoForm.module.css";

export type Evento = {
  id: number;
  nome: string;
  data: string;
  local: string;
  tenant?: string;
  arquivado?: boolean;
};

type Props = {
  initial?: Evento | null;
  onSave: (evento: Omit<Evento, "id"> & { id?: number }) => void;
  onCancel: () => void;
};

export default function EventoForm({ initial, onSave, onCancel }: Props) {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [local, setLocal] = useState("");
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initial) {
      setNome(initial.nome);
      setData(initial.data);
      setLocal(initial.local);
    }
  }, [initial]);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !data || !local.trim()) return;
    onSave({
      id: initial?.id,
      nome: nome.trim(),
      data,
      local: local.trim(),
      tenant: initial?.tenant,
      arquivado: initial?.arquivado ?? false,
    });
  }

  function onBackdrop(e: React.MouseEvent) {
    if (e.target === dialogRef.current) onCancel();
  }

  return (
    <div
      className={styles.backdrop}
      ref={dialogRef}
      onMouseDown={onBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="eventoFormTitle"
    >
      <div className={styles.modal}>
        <h3 id="eventoFormTitle">
          {initial ? "Editar Evento" : "Novo Evento"}
        </h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Nome
            <input
              ref={firstFieldRef}
              className={styles.input}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              aria-required="true"
              aria-invalid={!nome.trim() ? "true" : "false"}
            />
          </label>

          <label className={styles.label}>
            Data
            <input
              className={styles.input}
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
              aria-required="true"
              aria-invalid={!data ? "true" : "false"}
            />
          </label>

          <label className={styles.label}>
            Local
            <input
              className={styles.input}
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              required
              aria-required="true"
              aria-invalid={!local.trim() ? "true" : "false"}
            />
          </label>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancel}
              onClick={onCancel}
              aria-label="Cancelar e fechar formulário"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.save}
              aria-label={
                initial ? "Salvar alterações do evento" : "Criar novo evento"
              }
            >
              {initial ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
