import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  View,
} from 'react-native';

import { espaco, paleta, raio, tipografia } from '@/theme/tokens';
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
  const inativo = disabled === true || carregando;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inativo, busy: carregando }}
      accessibilityLabel={titulo}
      disabled={inativo}
      style={({ pressed }) => [
        estilos.base,
        estilos[variante],
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
            tom={variante === 'primario' ? 'principal' : 'destaque'}
            style={variante === 'primario' ? estilos.textoPrimario : undefined}
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
    borderRadius: raio.botao,
    paddingVertical: espaco.lg,
    paddingHorizontal: espaco.xl,
    minHeight: 52, // alvo de toque confortavel
    justifyContent: 'center',
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.sm,
  },
  primario: { backgroundColor: paleta.primary },
  secundario: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: paleta.primary,
  },
  texto: { backgroundColor: 'transparent', paddingVertical: espaco.sm },
  textoPrimario: { color: paleta.surface, fontWeight: tipografia.titulo.fontWeight },
  pressionado: { opacity: 0.85 },
  inativo: { opacity: 0.5 },
});
