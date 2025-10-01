import { View, Text, Image, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAppData } from "../../src/context/AppDataContext";

export default function MeusIngressos() {
  const { ingressos, removerFoto } = useAppData();
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={ingressos}
        keyExtractor={(i) => String(i.id)}
        ListHeaderComponent={<Text style={s.h2}>Meus Ingressos</Text>}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.t}>{item.nomeEvento}</Text>
            <Text style={s.sub}>{item.data} — {item.local}</Text>
            {item.foto ? <Image source={{ uri: item.foto }} style={s.img} /> : <Text style={s.sem}>Sem foto</Text>}
            <View style={s.row}>
              <Pressable style={s.btn} onPress={() => router.push(`/camera?ingressoId=${item.id}`)}><Text style={s.btnTxt}>Anexar foto</Text></Pressable>
              {item.foto && <Pressable style={[s.btn, s.warn]} onPress={() => removerFoto(item.id)}><Text style={s.btnTxt}>Remover foto</Text></Pressable>}
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 120, gap: 12 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  h2: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  card: { backgroundColor: "#1b2230", borderRadius: 16, padding: 14 },
  t: { color: "white", fontWeight: "700", fontSize: 16 },
  sub: { color: "#c5cede", marginBottom: 8 },
  img: { width: "100%", height: 220, borderRadius: 12, marginTop: 6, backgroundColor: "black" },
  sem: { color: "#94a3b8", marginVertical: 8 },
  row: { flexDirection: "row", gap: 8, marginTop: 10 },
  btn: { backgroundColor: "#334155", padding: 10, borderRadius: 10 },
  warn: { backgroundColor: "#92400e" },
  btnTxt: { color: "white", fontWeight: "700" }
});
