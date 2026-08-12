import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';

import { useSessao } from '@/features/auth/sessao-store';
import { usePaleta } from '@/theme/tema-store';
import type { Paleta } from '@/theme/tokens';

/**
 * Porta de entrada: decide entre onboarding e app conforme a sessao
 * restaurada do cofre.
 */
export default function Entrada() {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);
  const { carregando, autenticada } = useSessao();

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator color={paleta.primary} />
      </View>
    );
  }

  return <Redirect href={autenticada ? '/(tabs)' : '/boas-vindas'} />;
}

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: paleta.bg,
  },
});
