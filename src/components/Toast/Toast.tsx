import { useToast } from "../../context/ToastContext";
import styles from "./Toast.module.css";

export default function Toast() {
  const { toasts, remove } = useToast();

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${styles.toast} ${styles[t.kind]}`}
          role="status"
        >
          <span>{t.message}</span>
          <button
            className={styles.close}
            onClick={() => remove(t.id)}
            aria-label="Fechar notificação"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
