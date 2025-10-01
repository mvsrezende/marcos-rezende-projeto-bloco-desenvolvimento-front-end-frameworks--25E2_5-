import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Button, Card, Chip, IconButton, Searchbar, Text } from 'react-native-paper';
import { useEvents, Evento } from '../EventsContext';
import EventForm from '../components/EventForm';

export default function EventosScreen() {
  const { eventos, criar, atualizar, remover, arquivar, comprar, refresh } = useEvents();
  const [q, setQ] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState<Evento | null>(null);
  const [mostrarArquivados, setMostrarArquivados] = useState(false);

  const view = useMemo(() => {
    const base = mostrarArquivados ? eventos : eventos.filter(e => !e.arquivado);
    if (!q.trim()) return base;
    const qq = q.toLowerCase();
    return base.filter(e =>
      e.nome.toLowerCase().includes(qq) ||
      e.local.toLowerCase().includes(qq) ||
      e.data.toLowerCase().includes(qq)
    );
  }, [eventos, q, mostrarArquivados]);

  function openNew() { setEdit(null); setShowForm(true); }
  function openEdit(e: Evento) { setEdit(e); setShowForm(true); }
  function save(e: Omit<Evento, 'id' | 'tenant' | 'arquivado'> & { id?: number }) {
    setShowForm(false);
    if (e.id) atualizar(e as Evento);
    else criar(e);
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12, gap: 8 }}>
        <Searchbar placeholder="Buscar por nome, data ou local" value={q} onChangeText={setQ} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button mode="contained" onPress={openNew} style={{ flex: 1 }}>Novo</Button>
          <Button mode="outlined" onPress={refresh} style={{ flex: 1 }}>Atualizar</Button>
        </View>
        <Chip
          selected={mostrarArquivados}
          onPress={() => setMostrarArquivados(v => !v)}
          icon={mostrarArquivados ? 'check' : undefined}
        >
          Mostrar arquivados
        </Chip>
      </View>

      <FlatList
        data={view}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        renderItem={({ item }) => (
          <Card>
            <Card.Title title={item.nome} subtitle={`${item.data} • ${item.local}`} />
            <Card.Content>
              {item.arquivado && <Chip icon="archive" style={{ width: 140 }}>Arquivado</Chip>}
            </Card.Content>
            <Card.Actions style={{ justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row' }}>
                <IconButton icon="pencil" onPress={() => openEdit(item)} accessibilityLabel="Editar" />
                <IconButton
                  icon={item.arquivado ? 'archive-arrow-up' : 'archive'}
                  onPress={() => arquivar(item.id)}
                  accessibilityLabel="Arquivar/Desarquivar"
                />
                <IconButton icon="delete" onPress={() => remover(item.id)} accessibilityLabel="Remover" />
              </View>
              <Button mode="contained" onPress={() => comprar(item)}>Comprar</Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text>Nenhum evento encontrado.</Text>
          </View>
        }
      />

      <EventForm
        visible={showForm}
        initial={edit}
        onSave={save}
        onDismiss={() => setShowForm(false)}
      />
    </View>
  );
}
