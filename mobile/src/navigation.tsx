// src/navigation.tsx
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Text } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import EventosScreen from './screens/EventosScreen';
import MeusIngressosScreen from './screens/MeusIngressosScreen';
import { useAuth } from './AuthContext';

const Tabs = createBottomTabNavigator();
const Stack = createStackNavigator();

function Center({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      {children}
    </View>
  );
}

function TabsApp() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let icon: keyof typeof MaterialIcons.glyphMap = 'dashboard';
          if (route.name === 'Eventos') icon = 'event';
          else if (route.name === 'Ingressos') icon = 'confirmation-number';
          else if (route.name === 'Sobre') icon = 'info';
          return <MaterialIcons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Dashboard" component={DashboardScreen} />
      <Tabs.Screen name="Eventos" component={EventosScreen} />
      <Tabs.Screen name="Ingressos" component={MeusIngressosScreen} />
    </Tabs.Navigator>
  );
}

export default function RootNav() {
  const { isAuthenticated, loading, error } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {loading ? (
          <Stack.Screen
            name="Boot"
            component={() => (
              <Center>
                <ActivityIndicator />
                <Text style={{ marginTop: 12 }}>Inicializando…</Text>
              </Center>
            )}
          />
        ) : error ? (
          <Stack.Screen
            name="Error"
            component={() => (
              <Center>
                <Text variant="titleMedium">Erro</Text>
                <Text style={{ marginTop: 8 }}>{error}</Text>
              </Center>
            )}
          />
        ) : isAuthenticated ? (
          <Stack.Screen name="Tabs" component={TabsApp} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
