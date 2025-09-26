export function isSecureSite() {
  if (typeof window !== "undefined" && "isSecureContext" in window) {
    // @ts-ignore
    return window.isSecureContext;
  }
  return location.protocol === "https:";
}

export function hasMediaDevices() {
  return !!(
    navigator &&
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia
  );
}
