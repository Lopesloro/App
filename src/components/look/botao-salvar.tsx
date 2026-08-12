import { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Texto } from '@/components/ui/texto';
import { usePaleta } from '@/theme/tema-store';
import { espaco, raio, type Paleta } from '@/theme/tokens';

type Props = {
  salvo: boolean;
  onPress: () => void;
  testID?: string;
};

/**
 * Botao de salvar look.
 *
 * O rotulo diz a ACAO ("Salvar" / "Salvo"), e o estado de selecao vai no
 * `accessibilityState` — assim o leitor de tela anuncia "Salvo, selecionado"
 * em vez de deixar a usuaria adivinhando se ja esta salvo.
 */
export function BotaoSalvar({ salvo, onPress, testID }: Props) {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: salvo }}
      accessibilityLabel={salvo ? 'Remover dos salvos' : 'Salvar look'}
      testID={testID}
      style={({ pressed }) => [
        estilos.botao,
        salvo ? estilos.salvo : null,
        pressed ? estilos.pressionado : null,
      ]}
    >
      <Texto variante="corpoPequeno" tom={salvo ? 'destaque' : 'suave'}>
        {salvo ? '♥ Salvo' : '♡ Salvar'}
      </Texto>
    </Pressable>
  );
}

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
  botao: {
    paddingHorizontal: espaco.lg,
    paddingVertical: espaco.sm,
    borderRadius: raio.chip,
    borderWidth: 1,
    borderColor: paleta.border,
    backgroundColor: paleta.surface,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  salvo: { borderColor: paleta.primary, backgroundColor: paleta.primarySoft },
  pressionado: { opacity: 0.85 },
});
