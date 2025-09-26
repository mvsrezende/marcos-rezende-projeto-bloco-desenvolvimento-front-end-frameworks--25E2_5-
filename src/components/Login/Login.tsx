import { useState } from "react";
import styles from "./Login.module.css";

interface Props {
  onLogin: (username: string) => void;
}

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === "admin" && password === "1234") {
      onLogin(username);
    } else {
      setError("Usuário ou senha inválidos.");
    }
  }

  return (
    <section className={styles.loginBox}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Usuário:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
          />
        </label>
        <label>
          Senha:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.btn}>
          Entrar
        </button>
      </form>
      <p className={styles.demoHint}>
        <b>Dica:</b> admin / 1234
      </p>
    </section>
  );
}
