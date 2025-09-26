import { useEffect, useRef, useState } from "react";
import styles from "./CameraModal.module.css";
import { useToast } from "../../context/ToastContext";
import { getBestCameraStream, isIOS } from "../../utils/mobile";

type Props = {
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
};

export default function CameraModal({ onClose, onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  );
  const { show } = useToast();
  const ios = isIOS();

  async function start() {
    try {
      stop();
      const stream = await getBestCameraStream(facingMode);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      show("error", "Não foi possível acessar a câmera.");
    }
  }

  function stop() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  function capture() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/png");
    onCapture(dataUrl);
  }

  useEffect(() => {
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="camTitle"
    >
      <div className={styles.modal}>
        <h3 id="camTitle">Anexar foto ao ingresso</h3>
        <div className={styles.stage}>
          <div className={styles.videoBox}>
            <video ref={videoRef} className={styles.video} playsInline muted />
          </div>
          <div className={styles.actions}>
            <button
              className={styles.switch}
              onClick={() =>
                setFacingMode((m) =>
                  m === "environment" ? "user" : "environment"
                )
              }
              aria-label="Alternar câmera"
            >
              Alternar
            </button>
            <button
              className={styles.capture}
              onClick={capture}
              aria-label="Capturar foto"
            >
              Capturar
            </button>
            <button
              className={styles.cancel}
              onClick={onClose}
              aria-label="Cancelar"
            >
              Cancelar
            </button>
          </div>

          {ios && (
            <input
              className={styles.fileInput}
              type="file"
              accept="image/*"
              capture={facingMode === "environment" ? "environment" : "user"}
              aria-label="Enviar foto do dispositivo"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => onCapture(String(reader.result));
                reader.readAsDataURL(file);
              }}
            />
          )}
        </div>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      </div>
    </div>
  );
}
