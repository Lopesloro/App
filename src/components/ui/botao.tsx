import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  View,
} from 'react-native';

import { useTema } from '@/theme/tema-store';
import { espaco } from '@/theme/tokens';
import { Texto } from './texto';

type Variante = 'primario' | 'secundario' | 'texto';

export type BotaoProps = Omit<PressableProps, 'children' | 'style'> & {
  titulo: string;
  variante?: Variante;
  carregando?: boolean;
};

export function Botao({
  titulo,
  variante = 'primario',
  carregando = false,
  disabled,
  ...props
}: BotaoProps) {
  const { paleta, raio } = useTema();
  const inativo = disabled === true || carregando;

  const fundo = {
    primario: { backgroundColor: paleta.primary },
    secundario: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: paleta.primary,
    },
    texto: { backgroundColor: 'transparent' },
  }[variante];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inativo, busy: carregando }}
      accessibilityLabel={titulo}
      disabled={inativo}
      style={({ pressed }) => [
        estilos.base,
        { borderRadius: raio.botao },
        fundo,
        variante === 'texto' ? estilos.compacto : null,
        pressed && !inativo ? estilos.pressionado : null,
        inativo ? estilos.inativo : null,
      ]}
      {...props}
    >
      <View style={estilos.conteudo}>
        {carregando ? (
          <ActivityIndicator
            size="small"
            color={variante === 'primario' ? paleta.surface : paleta.primary}
          />
        ) : (
          <Texto
            variante="titulo"
            tom={variante === 'primario' ? 'sobreDestaque' : 'destaque'}
          >
            {titulo}
          </Texto>
        )}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    paddingVertical: espaco.lg,
    paddingHorizontal: espaco.xl,
    minHeight: 52, // alvo de toque confortavel com o polegar
    justifyContent: 'center',
  },
  compacto: { paddingVertical: espaco.sm, minHeight: 44 },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.sm,
  },
  pressionado: { opacity: 0.85 },
  inativo: { opacity: 0.5 },
});
