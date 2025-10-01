import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useAppData } from "../../src/context/AppDataContext";
import EventoForm from "../../src/components/EventoForm";
import EventoItem from "../../src/components/EventoItem";
import type { Evento } from "../../src/types";

export default function Eventos() {
  const { eventos, criarEvento, atualizarEvento, removerEvento, arquivarEvento, comprar, refreshEventos } = useAppData();
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Evento | null>(null);

  function abrirNovo() { setEditando(null); setModalAberto(true); }
  function abrirEditar(e: Evento) { setEditando(e); setModalAberto(true); }
  function salvar(e: Omit<Evento, "id"> & { id?: number }) {
    if (e.id != null) atualizarEvento(e as Evento); else criarEvento(e as Omit<Evento, "id">);
    setModalAberto(false);
  }

  return (
    <View style={s.wrap}>
      <View style={s.row}>
        <Pressable style={s.btn} onPress={abrirNovo}><Text style={s.btnTxt}>Novo</Text></Pressable>
        <Pressable style={s.btn} onPress={refreshEventos}><Text style={s.btnTxt}>Atualizar</Text></Pressable>
      </View>
      <FlatList
        data={eventos.filter(e => !e.arquivado)}
        keyExtractor={(e) => String(e.id)}
        renderItem={({ item }) => (
          <EventoItem
            evento={item}
            onEditar={abrirEditar}
            onRemover={removerEvento}
            onArquivar={arquivarEvento}
            onComprar={comprar}
          />
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      <EventoForm visible={modalAberto} initial={editando} onSave={salvar} onCancel={() => setModalAberto(false)} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  row: { flexDirection: "row", gap: 8, marginBottom: 12 },
  btn: { backgroundColor: "#334155", padding: 10, borderRadius: 10 },
  btnTxt: { color: "white", fontWeight: "700" }
});
