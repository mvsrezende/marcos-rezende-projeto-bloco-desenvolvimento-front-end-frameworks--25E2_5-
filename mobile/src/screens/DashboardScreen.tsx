import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useAuth } from '../AuthContext';

export default function DashboardScreen() {
  const { user, tenant, logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Dashboard</Text>
      <Text style={{ marginTop: 8 }}>Usuário: {user?.email ?? '—'}</Text>
      <Text>Tenant: {tenant ?? '—'}</Text>
      <Button mode="outlined" onPress={logout} style={{ marginTop: 16 }}>
        Sair
      </Button>
      <Text style={{ marginTop: 24, opacity: 0.7 }}>
        (Aqui depois trazemos Eventos/Ingressos, câmera, etc.)
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });
