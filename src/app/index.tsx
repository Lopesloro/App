import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';

import { podeUsarOApp, useSessao } from '@/features/auth/sessao-store';
import { usePaleta } from '@/theme/tema-store';
import type { Paleta } from '@/theme/tokens';

/**
 * Porta de entrada: decide entre a boas-vindas e o app.
 *
 * Entra quem tem conta E quem escolheu entrar sem conta. Como tudo funciona
 * no aparelho, nao ha motivo para barrar quem so quer usar.
 */
export default function Entrada() {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);
  const estado = useSessao();
  const { carregando } = estado;

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator color={paleta.primary} />
      </View>
    );
  }

  return <Redirect href={podeUsarOApp(estado) ? '/(tabs)' : '/boas-vindas'} />;
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
