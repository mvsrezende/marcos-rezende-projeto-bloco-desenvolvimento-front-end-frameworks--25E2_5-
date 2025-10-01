import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppData } from "../src/context/AppDataContext";

export default function CameraScreen() {
  const [perm, requestPermission] = Camera.useCameraPermissions();
  const [tipo, setTipo] = useState<CameraType>("back");
  const [foto, setFoto] = useState<string | null>(null);
  const camRef = useRef<Camera>(null);
  const router = useRouter();
  const { ingressoId } = useLocalSearchParams<{ ingressoId?: string }>();
  const { anexarFoto } = useAppData();

  useEffect(() => { requestPermission(); }, []);

  async function snap() {
    const res = await camRef.current?.takePictureAsync({ base64: true, quality: 0.8 });
    if (res?.base64) setFoto(`data:image/jpeg;base64,${res.base64}`);
  }

  function salvar() {
    if (foto && ingressoId) {
      anexarFoto(Number(ingressoId), foto);
      router.back();
    }
  }

  if (!perm) return null;
  if (!perm.granted) return <View style={s.center}><Text>Permissão de câmera necessária</Text></View>;

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {!foto ? (
        <Camera ref={camRef} style={{ flex: 1 }} type={tipo} />
      ) : (
        <Image source={{ uri: foto }} style={{ flex: 1 }} resizeMode="contain" />
      )}
      <View style={s.controls}>
        {!foto && (
          <Pressable style={s.btn} onPress={() => setTipo(prev => prev === "back" ? "front" : "back")}><Text style={s.txt}>Trocar</Text></Pressable>
        )}
        {!foto ? (
          <Pressable style={s.btn} onPress={snap}><Text style={s.txt}>Capturar</Text></Pressable>
        ) : (
          <>
            <Pressable style={s.btn} onPress={() => setFoto(null)}><Text style={s.txt}>Refazer</Text></Pressable>
            <Pressable style={s.btnPrim} onPress={salvar}><Text style={s.txt}>Salvar</Text></Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  controls: { position: "absolute", bottom: 30, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 12 },
  btn: { backgroundColor: "#1f2937", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  btnPrim: { backgroundColor: "#7c3aed", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  txt: { color: "white", fontWeight: "700" }
});
