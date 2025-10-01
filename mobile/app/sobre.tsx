import { View, Text, StyleSheet } from "react-native";

export default function Sobre() {
  return (
    <View style={s.wrap}>
      <Text style={s.h2}>Sobre</Text>
      <Text>Versão mobile do Ingressos Online (Expo + React Native).</Text>
    </View>
  );
}
const s = StyleSheet.create({ wrap: { flex: 1, padding: 16, gap: 8 }, h2: { fontSize: 20, fontWeight: "700", marginBottom: 12 } });
