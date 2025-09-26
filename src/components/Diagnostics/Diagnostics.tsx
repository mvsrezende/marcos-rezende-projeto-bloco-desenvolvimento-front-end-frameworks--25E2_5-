import { useEffect, useState } from "react";
import styles from "./Diagnostics.module.css";
import { isSecureSite, hasMediaDevices } from "../../utils/env";
import { useToast } from "../../context/ToastContext";

type Status = "granted" | "denied" | "prompt" | "unsupported";
type CheckResult = {
  secure: boolean;
  media: boolean;
  cam: Status;
  mic: Status;
  error?: string;
};

export default function Diagnostics() {
  const [res, setRes] = useState<CheckResult>({
    secure: false,
    media: false,
    cam: "unsupported",
    mic: "unsupported",
  });
  const [testing, setTesting] = useState(false);
  const { show } = useToast();

  async function queryPermission(
    name: "camera" | "microphone"
  ): Promise<Status> {
    try {
      if (!("permissions" in navigator)) return "unsupported";
      // @ts-ignore
      const status = await navigator.permissions.query({ name });
      return status.state as Status;
    } catch {
      return "unsupported";
    }
  }

  async function runChecks() {
    const secure = isSecureSite();
    const media = hasMediaDevices();
    const cam = await queryPermission("camera");
    const mic = await queryPermission("microphone");
    setRes({ secure, media, cam, mic });
  }

  async function testAccess(kind: "video" | "audio") {
    if (!hasMediaDevices()) {
      show("error", "MediaDevices não disponível.");
      return;
    }
    setTesting(true);
    try {
      const constraints =
        kind === "video"
          ? { video: true, audio: false }
          : { video: false, audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach((t) => t.stop());
      show(
        "success",
        kind === "video" ? "Câmera acessível." : "Microfone acessível."
      );
      await runChecks();
    } catch (e: any) {
      setRes((prev) => ({ ...prev, error: String(e?.message || e) }));
      show(
        "error",
        kind === "video"
          ? "Falha ao acessar a câmera."
          : "Falha ao acessar o microfone."
      );
    } finally {
      setTesting(false);
    }
  }

  useEffect(() => {
    runChecks();
  }, []);

  return (
    <section
      id="diagnostico"
      className={styles.wrap}
      aria-labelledby="diagTitle"
    >
      <h2 id="diagTitle">Diagnóstico de Ambiente</h2>

      {!res.secure && (
        <div className={styles.banner} role="alert">
          O site não está em contexto seguro. Use HTTPS ou CodeSandbox com HTTPS
          para habilitar câmera/microfone.
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.card} aria-label="Contexto de segurança">
          <div className={styles.label}>Contexto Seguro (HTTPS)</div>
          <div className={res.secure ? styles.ok : styles.bad}>
            {res.secure ? "Ativo" : "Inativo"}
          </div>
        </div>

        <div className={styles.card} aria-label="APIs de mídia">
          <div className={styles.label}>APIs de Mídia</div>
          <div className={res.media ? styles.ok : styles.bad}>
            {res.media ? "Disponível" : "Indisponível"}
          </div>
        </div>

        <div className={styles.card} aria-label="Permissão de câmera">
          <div className={styles.label}>Permissão Câmera</div>
          <div className={styles.status}>{res.cam}</div>
          <button
            className={styles.btn}
            onClick={() => testAccess("video")}
            disabled={testing || !res.media}
            aria-label="Testar acesso à câmera"
          >
            Testar Câmera
          </button>
        </div>

        <div className={styles.card} aria-label="Permissão de microfone">
          <div className={styles.label}>Permissão Microfone</div>
          <div className={styles.status}>{res.mic}</div>
          <button
            className={styles.btn}
            onClick={() => testAccess("audio")}
            disabled={testing || !res.media}
            aria-label="Testar acesso ao microfone"
          >
            Testar Microfone
          </button>
        </div>
      </div>

      {res.error && (
        <div className={styles.errorBox} role="alert">
          {res.error}
        </div>
      )}

      <div className={styles.hints}>
        <h3>Como habilitar</h3>
        <ul>
          <li>Acesse o app por HTTPS.</li>
          <li>Permita câmera e microfone quando solicitado pelo navegador.</li>
          <li>
            No iOS, use Safari ou WebView com permissões ativas. No Android, use
            Chrome.
          </li>
          <li>
            Se negou a permissão, reabra pelas configurações do site no
            navegador.
          </li>
        </ul>
      </div>
    </section>
  );
}
