import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { Button, Modal, Portal, Text } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCaptured: (base64: string) => void;
};

export default function CameraModal({ visible, onClose, onCaptured }: Props) {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);

  async function ensurePermission() {
    if (!permission?.granted) {
      const res = await requestPermission();
      return res.granted;
    }
    return true;
  }

  async function snap() {
    const ok = await ensurePermission();
    if (!ok || !cameraRef.current) return;

    try {
      setBusy(true);
      const pic = await (cameraRef.current as any).takePictureAsync({
        quality: 0.6,
        base64: true,
        skipProcessing: true,
      });
      if (pic?.base64) onCaptured(`data:image/jpeg;base64,${pic.base64}`);
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{
          margin: 16,
          backgroundColor: 'white',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {!permission?.granted ? (
          <View style={{ padding: 16 }}>
            <Text variant="titleMedium">Permissão da câmera</Text>
            <Text style={{ marginTop: 8 }}>
              Precisamos da sua permissão para acessar a câmera.
            </Text>
            <Button mode="contained" style={{ marginTop: 16 }} onPress={ensurePermission}>
              Permitir
            </Button>
            <Button style={{ marginTop: 8 }} onPress={onClose}>
              Cancelar
            </Button>
          </View>
        ) : (
          <View style={{ height: 420 }}>
            <CameraView
              ref={(r) => (cameraRef.current = r)}
              style={{ flex: 1 }}
              facing="back"
            />
            <View style={{ flexDirection: 'row', padding: 12, justifyContent: 'space-between' }}>
              <Button mode="text" onPress={onClose}>Fechar</Button>
              <Button mode="contained" loading={busy} onPress={snap}>Capturar</Button>
            </View>
          </View>
        )}
      </Modal>
    </Portal>
  );
}
