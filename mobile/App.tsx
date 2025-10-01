// App.tsx
import 'react-native-gesture-handler';
import './src/shim';

import * as React from 'react';
import { Provider as PaperProvider, Text } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AuthProvider } from './src/AuthContext';
import { EventsProvider } from './src/EventsContext';
import RootNav from './src/navigation';

class Boundary extends React.Component<{ children: React.ReactNode }, { error: any }> {
  constructor(props: any) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error: any) { return { error }; }
  componentDidCatch(error: any, info: any) { console.error('Boundary error:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text variant="titleMedium">Erro de runtime</Text>
          <Text style={{ marginTop: 8 }}>{String(this.state.error)}</Text>
        </View>
      );
    }
    return this.props.children as any;
  }
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <EventsProvider>
          <Boundary>
            <RootNav />
            <StatusBar style="auto" />
          </Boundary>
        </EventsProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
