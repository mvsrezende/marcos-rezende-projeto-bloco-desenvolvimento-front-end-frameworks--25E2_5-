import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { useToast } from "../../src/context/ToastContext";

export default function Login() {
  const { login, signup, setTenant } = useAuth();
  const { show } = useToast();
  const router = useRouter();
  const [modo, setModo] = useState<"login"|"signup">("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tenant, setTenantLocal] = useState("");

  async function enviar() {
    try {
      if (modo === "login") await login(email, senha, tenant || undefined);
      else await signup(email, senha, tenant || undefined);
      setTenant(tenant || null);
      show("success", modo === "login" ? "Bem-vindo!" : "Conta criada!");
      router.replace("/(tabs)/dashboard");
    } catch (e: any) {
      show("error", e?.message || "Falha na autenticação");
    }
  }

  return (
    <View style={s.wrap}>
      <Text style={s.h2}>{modo === "login" ? "Entrar" : "Cadastro"}</Text>
      <TextInput placeholder="E-mail" value={email} onChangeText={setEmail} style={s.input} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} style={s.input} secureTextEntry />
      <TextInput placeholder="Tenant (opcional)" value={tenant} onChangeText={setTenantLocal} style={s.input} />
      <Pressable style={s.btnPrim} onPress={enviar}><Text style={s.btnTxt}>{modo === "login" ? "Entrar" : "Cadastrar"}</Text></Pressable>
      <Pressable onPress={() => setModo(modo === "login" ? "signup" : "login")}><Text style={s.link}>{modo === "login" ? "Criar conta" : "Já tenho conta"}</Text></Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16, gap: 10, justifyContent: "center" },
  h2: { fontSize: 24, fontWeight: "800", marginBottom: 8 },
  input: { backgroundColor: "#1b2230", color: "white", padding: 12, borderRadius: 10 },
  btnPrim: { backgroundColor: "#7c3aed", padding: 12, borderRadius: 12, alignItems: "center" },
  btnTxt: { color: "white", fontWeight: "700" },
  link: { color: "#7c3aed", textAlign: "center", marginTop: 8 }
});
