import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import { Camera } from "expo-camera";

type Status = "granted" | "denied" | "prompt";

export default function Diagnostico() {
  const [cam, setCam] = useState<Status>("prompt");
  const [noti, setNoti] = useState<Status>("prompt");

  useEffect(() => {
    (async () => {
      const camPerm = await Camera.getCameraPermissionsAsync();
      setCam(camPerm.granted ? "granted" : (camPerm.canAskAgain ? "prompt" : "denied"));

      const notPerm = await Notifications.getPermissionsAsync();
      setNoti(notPerm.granted ? "granted" : (notPerm.canAskAgain ? "prompt" : "denied"));
    })();
  }, []);

  return (
    <View style={s.wrap}>
      <Text style={s.h2}>Diagnóstico</Text>
      <Text>Câmera: {cam}</Text>
      <Text>Notificações: {noti}</Text>
    </View>
  );
}

const s = StyleSheet.create({ wrap: { flex: 1, padding: 16, gap: 8 }, h2: { fontSize: 20, fontWeight: "700", marginBottom: 12 } });
