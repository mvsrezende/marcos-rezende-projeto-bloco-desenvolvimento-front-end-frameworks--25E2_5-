import styles from "./Dashboard.module.css";
import type { Evento } from "../EventoForm/EventoForm";

type Props = {
  eventos: Evento[];
  totalIngressos: number;
};

function proxDatas(eventos: Evento[]) {
  const futuros = eventos
    .filter((e) => !e.arquivado)
    .map((e) => e.data)
    .sort()
    .slice(0, 3);
  return futuros;
}

export default function Dashboard({ eventos, totalIngressos }: Props) {
  const totalEventos = eventos.filter((e) => !e.arquivado).length;
  const arquivados = eventos.filter((e) => e.arquivado).length;
  const proximas = proxDatas(eventos);

  return (
    <section className={styles.dashboard} aria-labelledby="dashTitle">
      <h2 id="dashTitle">Resumo</h2>
      <div className={styles.grid}>
        <div className={styles.card} aria-label="Total de eventos ativos">
          <div className={styles.kpi}>{totalEventos}</div>
          <div className={styles.label}>Eventos ativos</div>
        </div>
        <div className={styles.card} aria-label="Ingressos comprados">
          <div className={styles.kpi}>{totalIngressos}</div>
          <div className={styles.label}>Ingressos comprados</div>
        </div>
        <div className={styles.card} aria-label="Eventos arquivados">
          <div className={styles.kpi}>{arquivados}</div>
          <div className={styles.label}>Arquivados</div>
        </div>
      </div>

      <div className={styles.nextDates}>
        <h3>Próximas datas</h3>
        {proximas.length === 0 ? (
          <p className={styles.empty}>Sem próximas datas.</p>
        ) : (
          <ul>
            {proximas.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
