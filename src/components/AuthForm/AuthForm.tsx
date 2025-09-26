import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./AuthForm.module.css";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

function mapError(err: any) {
  const code = String(err?.code || "");
  if (code.includes("auth/email-already-in-use")) return "E-mail já cadastrado.";
  if (code.includes("auth/invalid-email")) return "E-mail inválido.";
  if (code.includes("auth/weak-password")) return "Senha muito fraca (mín. 6).";
  if (code.includes("auth/user-not-found")) return "Usuário não encontrado.";
  if (code.includes("auth/wrong-password")) return "Senha incorreta.";
  if (code.includes("auth/too-many-requests")) return "Muitas tentativas. Tente novamente em alguns minutos.";
  return err?.message || "Falha na autenticação.";
}

export default function AuthForm() {
  const { isAuthenticated, login, signup } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [tenant, setTenant] = useState("acme");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    firstRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    if (isAuthenticated) {
      const to = location?.state?.from || "/dashboard";
      navigate(to, { replace: true });
    }
  }, [isAuthenticated, navigate, location?.state?.from]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
        show("success", "Login realizado.");
      } else {
        await signup(email.trim(), password);
        show("success", "Cadastro realizado.");
      }
    } catch (err: any) {
      show("error", mapError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container" aria-labelledby="authTitle">
      <div className={styles.auth}>
        <h2 id="authTitle">{mode === "login" ? "Entrar" : "Criar conta"}</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Espaço/Empresa
            <input
              ref={mode === "login" ? firstRef : undefined}
              className={styles.input}
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
              aria-label="Espaço ou empresa"
              required
            />
          </label>
          <label className={styles.label}>
            E-mail
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="E-mail"
              required
            />
          </label>
          <label className={styles.label}>
            Senha
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Senha"
              required
              minLength={6}
            />
          </label>
          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.primary}
              disabled={busy}
              aria-label={mode === "login" ? "Entrar" : "Cadastrar"}
            >
              {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
            </button>
            <button
              type="button"
              className={styles.ghost}
              onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
              aria-label="Alternar entre login e cadastro"
            >
              {mode === "login" ? "Criar conta" : "Já tenho conta"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
