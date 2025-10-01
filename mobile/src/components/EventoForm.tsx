import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Pressable, Modal, StyleSheet } from "react-native";
import type { Evento } from "../types";

type Props = {
  initial?: Evento | null;
  onSave: (e: Omit<Evento, "id"> & { id?: number }) => void;
  onCancel: () => void;
  visible: boolean;
};

export default function EventoForm({ initial, onSave, onCancel, visible }: Props) {
  const [nome, setNome] = useState(initial?.nome ?? "");
  const [data, setData] = useState(initial?.data ?? "");
  const [local, setLocal] = useState(initial?.local ?? "");
  const firstRef = useRef<TextInput>(null);

  useEffect(() => {
    setNome(initial?.nome ?? "");
    setData(initial?.data ?? "");
    setLocal(initial?.local ?? "");
  }, [initial, visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={s.backdrop}>
        <View style={s.modal}>
          <Text style={s.h3}>{initial ? "Editar Evento" : "Novo Evento"}</Text>
          <TextInput ref={firstRef} value={nome} onChangeText={setNome} placeholder="Nome" style={s.input} />
          <TextInput value={data} onChangeText={setData} placeholder="AAAA-MM-DD" style={s.input} />
          <TextInput value={local} onChangeText={setLocal} placeholder="Local" style={s.input} />
          <View style={s.row}>
            <Pressable style={s.btn} onPress={onCancel}><Text style={s.btnTxt}>Cancelar</Text></Pressable>
            <Pressable style={[s.btn, s.primary]} onPress={() => onSave({ id: initial?.id, nome, data, local })}><Text style={s.btnTxt}>Salvar</Text></Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },
  modal: { width: "90%", backgroundColor: "#101523", borderRadius: 16, padding: 16, gap: 8 },
  h3: { color: "white", fontSize: 18, fontWeight: "600", marginBottom: 8 },
  input: { backgroundColor: "#1b2230", color: "white", padding: 12, borderRadius: 10, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: "#293347" },
  primary: { backgroundColor: "#7c3aed" },
  btnTxt: { color: "white", fontWeight: "600" }
});
