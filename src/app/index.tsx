import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';

import { useSessao } from '@/features/auth/sessao-store';
import { paleta } from '@/theme/tokens';

/**
 * Porta de entrada: decide entre onboarding e app conforme a sessao
 * restaurada do cofre.
 */
export default function Entrada() {
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

const estilos = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: paleta.bg,
  },
});
