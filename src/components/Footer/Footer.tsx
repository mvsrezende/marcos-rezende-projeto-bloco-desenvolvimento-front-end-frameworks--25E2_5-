import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>
        &copy; {new Date().getFullYear()} Ingressos Online. Projeto acadêmico
        para estudos em Front-end.
      </span>
      <span>Feito por Marcos Rezende</span>
    </footer>
  );
}
