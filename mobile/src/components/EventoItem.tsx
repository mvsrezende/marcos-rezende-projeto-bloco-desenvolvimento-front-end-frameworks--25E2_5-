import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { Evento } from "../types";

type Props = {
  evento: Evento;
  onEditar: (e: Evento) => void;
  onRemover: (id: number) => void;
  onArquivar: (id: number) => void;
  onComprar: (e: Evento) => void;
};

export default function EventoItem({ evento, onEditar, onRemover, onArquivar, onComprar }: Props) {
  return (
    <View style={s.card}>
      <Text style={s.titulo}>{evento.nome}</Text>
      <Text style={s.sub}>{evento.data} — {evento.local}</Text>
      <View style={s.row}>
        <Pressable style={[s.btn, s.info]} onPress={() => onEditar(evento)}><Text style={s.btnTxt}>Editar</Text></Pressable>
        <Pressable style={[s.btn, s.warn]} onPress={() => onArquivar(evento.id)}><Text style={s.btnTxt}>Arquivar</Text></Pressable>
        <Pressable style={[s.btn, s.danger]} onPress={() => onRemover(evento.id)}><Text style={s.btnTxt}>Remover</Text></Pressable>
        <Pressable style={[s.btn, s.primary]} onPress={() => onComprar(evento)}><Text style={s.btnTxt}>Comprar</Text></Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: "#1b2230", borderRadius: 16, padding: 14, gap: 6, marginBottom: 10 },
  titulo: { color: "white", fontWeight: "700", fontSize: 16 },
  sub: { color: "#c5cede" },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  btnTxt: { color: "white", fontWeight: "600" },
  info: { backgroundColor: "#334155" },
  warn: { backgroundColor: "#92400e" },
  danger: { backgroundColor: "#7f1d1d" },
  primary: { backgroundColor: "#7c3aed" }
});
