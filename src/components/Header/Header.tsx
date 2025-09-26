import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

interface HeaderProps {
  username?: string;
  tenant?: string;
  onLogout?: () => void;
}

export default function Header({ username, tenant, onLogout }: HeaderProps) {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <h1 className={styles.title}>Ingressos Online</h1>

        <button
          className={styles.burger}
          aria-label="Abrir menu de navegação"
          aria-controls="main-nav"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.burgerBar} />
          <span className={styles.burgerBar} />
          <span className={styles.burgerBar} />
        </button>
      </div>

      <nav
        id="main-nav"
        className={`${styles.nav} ${open ? styles.open : ""}`}
        aria-label="Navegação principal"
        role="navigation"
      >
        <NavLink to="/dashboard" className={styles.link} onClick={closeMenu}>
          Dashboard
        </NavLink>
        <NavLink to="/eventos" className={styles.link} onClick={closeMenu}>
          Eventos
        </NavLink>
        <NavLink to="/ingressos" className={styles.link} onClick={closeMenu}>
          Meus Ingressos
        </NavLink>
        <NavLink to="/camera" className={styles.link} onClick={closeMenu}>
          Câmera
        </NavLink>
        <NavLink to="/sass" className={styles.link} onClick={closeMenu}>
          SASS
        </NavLink>
        <NavLink to="/diagnostico" className={styles.link} onClick={closeMenu}>
          Diagnóstico
        </NavLink>
        <NavLink to="/sobre" className={styles.link} onClick={closeMenu}>
          Sobre
        </NavLink>

        <div className={styles.userBox}>
          {username && (
            <span className={styles.username} aria-live="polite">
              Olá, {username}!{tenant ? ` · ${tenant}` : ""}
            </span>
          )}
          {onLogout && (
            <button
              className={styles.logout}
              onClick={onLogout}
              aria-label="Sair da conta"
            >
              Sair
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
