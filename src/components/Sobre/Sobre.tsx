import styles from "./Sobre.module.css";

export default function Sobre() {
  return (
    <section id="sobre" className={styles.sobre}>
      <h2>Sobre</h2>
      <p>
        Este sistema foi desenvolvido para facilitar a{" "}
        <strong>compra de ingressos online</strong> para eventos diversos, de
        forma prática, rápida e segura. Nosso objetivo é oferecer uma
        experiência simples, especialmente para quem utiliza o celular.
      </p>
      <p>
        Projeto desenvolvido como parte de estudos em{" "}
        <strong>desenvolvimento Front-end Mobile-First</strong> com React.
      </p>
    </section>
  );
}
