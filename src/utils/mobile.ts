export function isIOS() {
  const ua =
    navigator.userAgent || navigator.vendor || (window as any).opera || "";
  const iOSDevice = /iPad|iPhone|iPod/.test(ua);
  const iPadOS13Plus =
    navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1;
  return iOSDevice || iPadOS13Plus;
}

async function enumerateCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((d) => d.kind === "videoinput");
  } catch {
    return [];
  }
}

export async function getBestCameraStream(facing: "environment" | "user") {
  const preferBack = facing === "environment";
  try {
    const byFacing = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: facing } },
      audio: false,
    });
    return byFacing;
  } catch {}

  try {
    await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  } catch {}

  const cams = await enumerateCameras();
  let deviceId = cams[0]?.deviceId || undefined;

  if (cams.length > 1) {
    const labelMatch = cams.find((c) =>
      preferBack
        ? /back|rear|traseira/i.test(c.label)
        : /front|frontal|user/i.test(c.label)
    );
    if (labelMatch) deviceId = labelMatch.deviceId;
    else {
      deviceId = preferBack ? cams[cams.length - 1].deviceId : cams[0].deviceId;
    }
  }

  const byDevice = await navigator.mediaDevices.getUserMedia({
    video: deviceId ? { deviceId: { exact: deviceId } } : true,
    audio: false,
  });
  return byDevice;
}
