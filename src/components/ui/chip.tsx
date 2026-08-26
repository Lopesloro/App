import { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { usePaleta } from '@/theme/tema-store';
import { espaco, raio, type Paleta } from '@/theme/tokens';
import { Texto } from './texto';

type Props = {
  rotulo: string;
  ativo: boolean;
  onPress: () => void;
  testID?: string;
};

/**
 * Filtro em forma de pilula.
 *
 * O estado ativo vai no `accessibilityState`, e nao so na cor: quem usa
 * leitor de tela ou nao distingue bem as cores precisa saber qual filtro
 * esta ligado.
 */
export function Chip({ rotulo, ativo, onPress, testID }: Props) {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: ativo }}
      testID={testID}
      style={[estilos.chip, ativo ? estilos.ativo : null]}
    >
      <Texto variante="corpoPequeno" tom={ativo ? 'destaque' : 'suave'}>
        {rotulo}
      </Texto>
    </Pressable>
  );
}

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    chip: {
      paddingHorizontal: espaco.lg,
      paddingVertical: espaco.sm,
      borderRadius: raio.chip,
      borderWidth: 1,
      borderColor: paleta.border,
      backgroundColor: paleta.surface,
      // Alvo de toque confortavel com o polegar em movimento.
      minHeight: 40,
      justifyContent: 'center',
    },
    ativo: { borderColor: paleta.primary, backgroundColor: paleta.primarySoft },
  });
