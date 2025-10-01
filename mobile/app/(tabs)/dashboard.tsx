import { View, Text, StyleSheet } from "react-native";
import { useAppData } from "../../src/context/AppDataContext";
import { useAuth } from "../../src/context/AuthContext";

export default function Dashboard() {
  const { eventos, ingressos } = useAppData();
  const { user, tenant } = useAuth();
  return (
    <View style={s.wrap}>
      <Text style={s.h2}>Dashboard</Text>
      <Text>Usuário: {user?.email}</Text>
      <Text>Tenant: {tenant ?? "-"}</Text>
      <Text>Total de eventos: {eventos.length}</Text>
      <Text>Meus ingressos: {ingressos.length}</Text>
    </View>
  );
}

const s = StyleSheet.create({ wrap: { flex: 1, padding: 16, gap: 8 }, h2: { fontSize: 20, fontWeight: "700", marginBottom: 12 } });
