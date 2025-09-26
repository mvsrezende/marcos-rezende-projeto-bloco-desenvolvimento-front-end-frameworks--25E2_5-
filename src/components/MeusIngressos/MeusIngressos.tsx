import styles from "./MeusIngressos.module.css";
import type { Evento } from "../EventoForm/EventoForm";

type Ingresso = Evento & { foto?: string };
type Props = {
  ingressos: Ingresso[];
  onAttachPhoto: (id: number) => void;
  onRemovePhoto: (id: number) => void;
};

function exportCSV(data: Ingresso[]) {
  const header = ["id", "nome", "data", "local"];
  const rows = data.map((i) => [i.id, i.nome, i.data, i.local]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "meus_ingressos.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function MeusIngressos({ ingressos, onAttachPhoto, onRemovePhoto }: Props) {
  return (
    <section id="meus-ingressos" className={styles.wrap} aria-labelledby="ingTitle">
      <div className={styles.headRow}>
        <h2 id="ingTitle" className={styles.title}>Meus Ingressos</h2>
        <div className={styles.tools}>
          <button
            className={styles.export}
            onClick={() => exportCSV(ingressos)}
            aria-label="Exportar ingressos em CSV"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {ingressos.length === 0 ? (
        <p className={styles.empty}>Você ainda não comprou ingressos.</p>
      ) : (
        <ul className={styles.grid}>
          {ingressos.map((ing) => (
            <li key={ing.id} className={styles.card}>
              <div className={styles.top}>
                <strong className={styles.name}>{ing.nome}</strong>
                <span className={styles.badge}>{ing.data}</span>
              </div>
              <div className={styles.body}>
                <span className={styles.local}>{ing.local}</span>
                {ing.foto ? (
                  <img className={styles.photo} src={ing.foto} alt={`Foto do ingresso ${ing.nome}`} />
                ) : (
                  <div className={styles.noPhoto}>Sem foto</div>
                )}
              </div>
              <div className={styles.actions}>
                <button className={styles.attach} onClick={() => onAttachPhoto(ing.id)}>Anexar foto</button>
                {ing.foto && (
                  <button className={styles.remove} onClick={() => onRemovePhoto(ing.id)}>Remover foto</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
