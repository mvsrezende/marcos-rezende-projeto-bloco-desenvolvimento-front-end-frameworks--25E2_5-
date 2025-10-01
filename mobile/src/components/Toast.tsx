import { View, Text, Pressable, StyleSheet } from "react-native";
import { useToast } from "../context/ToastContext";
import { tema } from "../theme/tokens";

export default function Toast() {
  const { toasts, remove } = useToast();
  return (
    <View pointerEvents="box-none" style={estilos.wrap} accessibilityLiveRegion="polite">
      {toasts.map((t) => (
        <View key={t.id} style={[estilos.toast, estilos[t.kind]]}>
          <Text style={estilos.txt}>{t.message}</Text>
          <Pressable onPress={() => remove(t.id)} accessibilityLabel="Fechar notificação">
            <Text style={estilos.fechar}>×</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  wrap: { position: "absolute", top: 60, left: 0, right: 0, alignItems: "center", gap: 8 },
  toast: { minWidth: 280, maxWidth: 360, flexDirection: "row", justifyContent: "space-between", padding: 12, borderRadius: 12 },
  txt: { color: tema.texto, flex: 1, paddingRight: 8 },
  fechar: { color: tema.texto, fontSize: 20, marginLeft: 8 },
  success: { backgroundColor: "#064e3b" },
  info: { backgroundColor: "#1e293b" },
  warn: { backgroundColor: "#78350f" },
  error: { backgroundColor: "#7f1d1d" }
});
