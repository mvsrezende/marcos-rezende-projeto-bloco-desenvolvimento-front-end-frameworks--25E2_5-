import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';
import type { Evento } from '../EventsContext';

type Props = {
  visible: boolean;
  initial?: Evento | null;
  onSave: (e: Omit<Evento, 'id' | 'tenant' | 'arquivado'> & { id?: number }) => void;
  onDismiss: () => void;
};

export default function EventForm({ visible, initial, onSave, onDismiss }: Props) {
  const [nome, setNome] = useState(initial?.nome ?? '');
  const [data, setData] = useState(initial?.data ?? '');
  const [local, setLocal] = useState(initial?.local ?? '');
  const firstRef = useRef<any>(null);

  useEffect(() => {
    setNome(initial?.nome ?? '');
    setData(initial?.data ?? '');
    setLocal(initial?.local ?? '');
  }, [initial, visible]);

  function submit() {
    if (!nome || !data || !local) return;
    onSave({ id: initial?.id, nome, data, local });
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{ margin: 16, backgroundColor: 'white', borderRadius: 12, padding: 16 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Text variant="titleMedium" style={{ marginBottom: 12 }}>
            {initial ? 'Editar Evento' : 'Novo Evento'}
          </Text>
          <TextInput
            ref={firstRef}
            label="Nome"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput label="Data" value={data} onChangeText={setData} style={{ marginTop: 12 }} />
          <TextInput label="Local" value={local} onChangeText={setLocal} style={{ marginTop: 12 }} />

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
            <Button mode="outlined" onPress={onDismiss} style={{ flex: 1 }}>
              Cancelar
            </Button>
            <Button mode="contained" onPress={submit} style={{ flex: 1 }} disabled={!nome || !data || !local}>
              Salvar
            </Button>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
}
