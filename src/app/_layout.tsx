import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { queryClient } from '@/lib/query-client';
import { useSessao } from '@/features/auth/sessao-store';
import { useCloset } from '@/features/closet/closet-store';
import { useSalvos } from '@/features/salvos/salvos-store';
import { usePaleta, useTemaStore } from '@/theme/tema-store';

export default function LayoutRaiz() {
  const restaurar = useSessao((estado) => estado.restaurar);
  const restaurarSalvos = useSalvos((estado) => estado.restaurar);
  const restaurarTema = useTemaStore((estado) => estado.restaurar);
  const restaurarCloset = useCloset((estado) => estado.restaurar);
  const paleta = usePaleta();

  useEffect(() => {
    void restaurar();
    void restaurarSalvos();
    void restaurarTema();
    void restaurarCloset();
  }, [restaurar, restaurarSalvos, restaurarTema, restaurarCloset]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: paleta.bg },
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="paywall"
            options={{ presentation: 'modal', headerShown: false }}
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
