import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { definirAoPerderSessao } from '@/lib/api-client';
import { queryClient } from '@/lib/query-client';
import { useSessao } from '@/features/auth/sessao-store';
import { useEstilo } from '@/features/estilo/estilo-store';
import { useGuardaRoupa } from '@/features/guarda-roupa/guarda-roupa-store';
import { useSalvos } from '@/features/salvos/salvos-store';
import { usePaleta, useTemaStore } from '@/theme/tema-store';

export default function LayoutRaiz() {
  const restaurar = useSessao((estado) => estado.restaurar);
  const restaurarSalvos = useSalvos((estado) => estado.restaurar);
  const restaurarTema = useTemaStore((estado) => estado.restaurar);
  const restaurarArmario = useGuardaRoupa((estado) => estado.restaurar);
  const restaurarEstilo = useEstilo((estado) => estado.restaurar);
  const paleta = usePaleta();

  // Tudo que estava no aparelho volta antes da primeira tela. Os stores se
  // recusam a gravar enquanto isto nao termina, justamente para um toque
  // rapido na abertura nao apagar o que ja existia.
  useEffect(() => {
    void restaurar();
    void restaurarSalvos();
    void restaurarTema();
    void restaurarArmario();
    void restaurarEstilo();
  }, [restaurar, restaurarSalvos, restaurarTema, restaurarArmario, restaurarEstilo]);

  // Liga o cliente HTTP ao estado da sessao: um 401 vindo de qualquer tela
  // derruba a sessao em memoria, e a tela de entrada manda a usuaria para o
  // login. Sem isto o app ficava preso nas abas, sem token e sem saida.
  useEffect(() => {
    definirAoPerderSessao(() => {
      void useSessao.getState().sair();
    });
    return () => definirAoPerderSessao(null);
  }, []);

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
