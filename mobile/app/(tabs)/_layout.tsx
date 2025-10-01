import { Tabs, Redirect } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { View, Pressable, Text } from "react-native";

export default function TabsLayout() {
  const { isAuthenticated, logout } = useAuth();
  if (!isAuthenticated) return <Redirect href="/(public)/login" />;

  return (
    <Tabs screenOptions={{ headerRight: () => (
      <View style={{ marginRight: 12 }}>
        <Pressable onPress={logout}><Text>Sair</Text></Pressable>
      </View>
    )}}>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="eventos" options={{ title: "Eventos" }} />
      <Tabs.Screen name="meus-ingressos" options={{ title: "Meus Ingressos" }} />
    </Tabs>
  );
}
