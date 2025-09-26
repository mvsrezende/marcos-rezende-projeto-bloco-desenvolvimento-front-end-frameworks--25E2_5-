import styles from "./SassShowcase.module.scss";

export default function SassShowcase() {
  return (
    <section id="sass" className={styles.showcase} aria-labelledby="sassTitle">
      <h2 id="sassTitle">SASS Showcase</h2>
      <p className={styles.lead}>
        Exemplo de variáveis, mixins e utilitários mobile-first.
      </p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.kpi}>Tokens</div>
          <ul className={styles.tokens}>
            <li>
              Primária: <span className={styles.swatchPrimary} />
            </li>
            <li>
              Foco: <span className={styles.swatchFocus} />
            </li>
            <li>
              Borda: <span className={styles.swatchBorder} />
            </li>
          </ul>
        </div>

        <div className={styles.card}>
          <div className={styles.kpi}>Mixins</div>
          <p className={styles.muted}>
            Redimensione a tela para ver colunas em breakpoints.
          </p>
          <div className={styles.cols}>
            <div className={styles.col}>Col 1</div>
            <div className={styles.col}>Col 2</div>
            <div className={styles.col}>Col 3</div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.kpi}>Utilitários</div>
          <div className={styles.utilRow}>
            <button className={styles.btnPrimary}>Primário</button>
            <button className={styles.btnGhost}>Ghost</button>
          </div>
        </div>
      </div>
    </section>
  );
}
