import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { ToastProvider } from "../src/context/ToastContext";
import { AppDataProvider } from "../src/context/AppDataContext";
import Toast from "../src/components/Toast";

export default function Root() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppDataProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <Toast />
        </AppDataProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
