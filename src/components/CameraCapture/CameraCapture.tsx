import { useEffect, useRef, useState } from "react";
import styles from "./CameraCapture.module.css";
import { useToast } from "../../context/ToastContext";
import { getBestCameraStream, isIOS } from "../../utils/mobile";

export default function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [active, setActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [photo, setPhoto] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const { show } = useToast();
  const ios = isIOS();

  async function startCamera() {
    try {
      setStatus("Solicitando câmera...");
      setActive(true);
      await new Promise((r) => requestAnimationFrame(() => r(null)));

      stopCamera(false);

      const stream = await getBestCameraStream(facingMode);
      if (!stream) throw new Error("Fluxo de mídia vazio");

      const video = videoRef.current;
      if (!video) throw new Error("Elemento de vídeo não encontrado");

      streamRef.current = stream;
      video.srcObject = stream;
      video.setAttribute("playsinline", "true");
      video.muted = true;

      await new Promise<void>((resolve) => {
        const onReady = () => {
          video.removeEventListener("loadedmetadata", onReady);
          resolve();
        };
        video.addEventListener("loadedmetadata", onReady);
      });

      try {
        await video.play();
      } catch {}

      setPhoto(null);
      setStatus("");
      show("success", "Câmera iniciada.");
    } catch (e: any) {
      const msg = String(e?.message || e);
      setStatus(`Erro ao iniciar: ${msg}`);
      show("error", "Não foi possível acessar a câmera.");
      setActive(false);
      stopCamera();
    }
  }

  function stopCamera(clearStatus: boolean = true) {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.srcObject = null;
      video.removeAttribute("src");
    }
    if (clearStatus) setStatus("");
  }

  function ensurePlaying() {
    const v = videoRef.current;
    if (v && v.paused) v.play().catch(() => {});
  }

  function takePhoto() {
    ensurePlaying();
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    if (!w || !h) {
      show("warn", "Vídeo ainda não carregou. Tente novamente.");
      return;
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/png");
    setPhoto(dataUrl);
    show("success", "Foto capturada.");
  }

  function switchCamera() {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  }

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (active) startCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  return (
    <section id="camera" className={styles.wrapper} aria-labelledby="cameraTitle">
      <h2 id="cameraTitle">Câmera</h2>

      <div className={styles.controls}>
        {!active ? (
          <button className={styles.primary} onClick={startCamera} aria-label="Iniciar câmera">
            Iniciar câmera
          </button>
        ) : (
          <button
            className={styles.secondary}
            onClick={() => {
              setActive(false);
              stopCamera();
            }}
            aria-label="Parar câmera"
          >
            Parar
          </button>
        )}

        <button
          className={styles.ghost}
          onClick={switchCamera}
          aria-label="Alternar câmera frontal e traseira"
          disabled={!active}
        >
          Alternar câmera
        </button>

        <button
          className={styles.primary}
          onClick={takePhoto}
          aria-label="Capturar foto"
          disabled={!active}
        >
          Capturar
        </button>
      </div>

      {status && (
        <p role="status" className={styles.muted} aria-live="polite">
          {status}
        </p>
      )}

      <div className={styles.stage}>
        <div className={styles.videoBox} aria-live="polite" aria-label="Pré-visualização da câmera">
          <video ref={videoRef} className={styles.video} playsInline muted />
          {!active && <div className={styles.placeholder}>Câmera desligada</div>}
        </div>

        <div className={styles.resultBox}>
          <h3 className={styles.subtitle}>Resultado</h3>
          {photo ? (
            <img src={photo} alt="Foto capturada" className={styles.preview} />
          ) : (
            <p className={styles.muted}>Nenhuma foto capturada.</p>
          )}

          <input
            className={styles.fileInput}
            type="file"
            accept="image/*"
            capture={ios ? (facingMode === "environment" ? "environment" : "user") : undefined}
            aria-label="Enviar foto do dispositivo"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setPhoto(String(reader.result));
              reader.readAsDataURL(file);
            }}
          />
        </div>
      </div>

      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </section>
  );
}
