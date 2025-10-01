import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useAuth } from '../AuthContext';

export default function LoginScreen() {
  const { login, signup, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('123456');
  const [tenant, setTenant] = useState<string>('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [busy, setBusy] = useState(false);
  const disabled = loading || busy || !email || !password;

  async function submit() {
    try {
      setBusy(true);
      if (mode === 'login') await login(email, password, tenant || undefined);
      else await signup(email, password, tenant || undefined);
    } catch (e: any) {
      alert(e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Ingressos Online" subtitle="Autenticação (Firebase 8.10.0)" />
        <Card.Content>
          <TextInput label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ marginTop: 12 }}
          />
          <TextInput
            label="Tenant (opcional)"
            value={tenant}
            onChangeText={setTenant}
            style={{ marginTop: 12 }}
          />
          <Button
            mode="contained"
            onPress={submit}
            loading={busy}
            disabled={disabled}
            style={{ marginTop: 16 }}
          >
            {mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </Button>
          <Button
            onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
            style={{ marginTop: 8 }}
          >
            {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
          </Button>
        </Card.Content>
      </Card>
      {isAuthenticated && <Text style={{ marginTop: 12, opacity: 0.7 }}>Logado!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  card: { paddingBottom: 8 }
});
