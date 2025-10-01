import React, { useMemo, useState } from 'react';
import { FlatList, Image, View } from 'react-native';
import { Button, Card, IconButton, Searchbar, Text } from 'react-native-paper';
import { useEvents } from '../EventsContext';
import CameraModal from '../components/CameraModal';

export default function MeusIngressosScreen() {
  const { ingressos, anexarFoto, removerFoto } = useEvents();
  const [q, setQ] = useState('');
  const [camFor, setCamFor] = useState<number | null>(null);

  const view = useMemo(() => {
    if (!q.trim()) return ingressos;
    const qq = q.toLowerCase();
    return ingressos.filter(i =>
      i.nomeEvento.toLowerCase().includes(qq) ||
      i.local.toLowerCase().includes(qq) ||
      i.data.toLowerCase().includes(qq)
    );
  }, [ingressos, q]);

  function onCaptured(base64: string) {
    if (camFor == null) return;
    anexarFoto(camFor, base64);
    setCamFor(null);
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12 }}>
        <Searchbar placeholder="Buscar" value={q} onChangeText={setQ} />
      </View>

      <FlatList
        data={view}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        renderItem={({ item }) => (
          <Card>
            <Card.Title title={item.nomeEvento} subtitle={`${item.data} • ${item.local}`} />
            {item.foto && (
              <Image source={{ uri: item.foto }} style={{ height: 200, width: '100%' }} resizeMode="cover" />
            )}
            <Card.Actions style={{ justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <IconButton icon="camera" onPress={() => setCamFor(item.id)} accessibilityLabel="Anexar foto" />
                {item.foto && <IconButton icon="delete" onPress={() => removerFoto(item.id)} accessibilityLabel="Remover foto" />}
              </View>
              <Button mode="outlined" onPress={() => setCamFor(item.id)}>Adicionar/Atualizar Foto</Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text>Você ainda não possui ingressos.</Text>
          </View>
        }
      />

      <CameraModal
        visible={camFor != null}
        onClose={() => setCamFor(null)}
        onCaptured={onCaptured}
      />
    </View>
  );
}
