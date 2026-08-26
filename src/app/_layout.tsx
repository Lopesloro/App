import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// O expo-router 57 traz a navegacao vendorizada; `@react-navigation/native`
// nao e uma dependencia direta do projeto e nao existe em node_modules.
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  type Theme,
} from 'expo-router';

import { definirAoPerderSessao } from '@/lib/api-client';
import { queryClient } from '@/lib/query-client';
import { useSessao } from '@/features/auth/sessao-store';
import { useEstilo } from '@/features/estilo/estilo-store';
import { useGuardaRoupa } from '@/features/guarda-roupa/guarda-roupa-store';
import { useSalvos } from '@/features/salvos/salvos-store';
import { usePaleta, useTema, useTemaStore } from '@/theme/tema-store';
import type { Paleta } from '@/theme/tokens';

/**
 * Traduz a nossa paleta para o formato que o navegador de telas entende.
 *
 * O React Navigation pinta o fundo das telas e das transicoes com o tema
 * DELE, nao com o nosso. Sem esta ponte, ele usava o padrao claro (#F2F2F2) e
 * aparecia um retangulo cinza atras do app escuro — visivel a cada troca de
 * aba e em qualquer tela que nao pintasse o proprio fundo.
 *
 * Foi o teste de navegador que encontrou isso: nenhum teste unitario monta o
 * navegador de telas.
 */
function temaDaNavegacao(paleta: Paleta, escuro: boolean): Theme {
  const base = escuro ? DarkTheme : DefaultTheme;
  return {
    ...base,
    dark: escuro,
    colors: {
      ...base.colors,
      background: paleta.bg,
      card: paleta.surface,
      text: paleta.ink,
      border: paleta.border,
      primary: paleta.primary,
      notification: paleta.danger,
    },
  };
}

export default function LayoutRaiz() {
  const restaurar = useSessao((estado) => estado.restaurar);
  const restaurarSalvos = useSalvos((estado) => estado.restaurar);
  const restaurarTema = useTemaStore((estado) => estado.restaurar);
  const restaurarArmario = useGuardaRoupa((estado) => estado.restaurar);
  const restaurarEstilo = useEstilo((estado) => estado.restaurar);
  const paleta = usePaleta();
  const tema = useTema();

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

  // Na web, o documento tambem precisa acompanhar o tema.
  //
  // `src/app/+html.tsx` pinta a pagina com a cor do tema PADRAO, para nao
  // haver flash branco antes de o React montar. Mas se a usuaria escolher uma
  // direcao clara, aquela cor fica errada — sobrariam bordas escuras em volta
  // do app claro, e o arrasto alem do fim da pagina revelaria o fundo antigo.
  //
  // Em celular isto nao roda: `document` nao existe, e a guarda cuida disso.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.backgroundColor = paleta.bg;
    document.body.style.backgroundColor = paleta.bg;
  }, [paleta.bg]);

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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: paleta.bg }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={temaDaNavegacao(paleta, tema.escuro)}>
          {/* Segue o tema: relogio e bateria escuros somem em fundo escuro. */}
          <StatusBar style={tema.escuro ? 'light' : 'dark'} />
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
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
