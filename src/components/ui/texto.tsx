import { Text as TextoRN, type TextProps, StyleSheet } from 'react-native';

import { paleta, tipografia } from '@/theme/tokens';

type Variante = keyof typeof tipografia;
type Tom = 'principal' | 'suave' | 'destaque' | 'erro';

const CORES: Record<Tom, string> = {
  principal: paleta.ink,
  suave: paleta.inkSoft,
  destaque: paleta.primary,
  erro: paleta.danger,
};

export type TextoProps = TextProps & {
  variante?: Variante;
  tom?: Tom;
};

export function Texto({
  variante = 'corpo',
  tom = 'principal',
  style,
  ...props
}: TextoProps) {
  return (
    <TextoRN
      style={StyleSheet.compose(
        { ...tipografia[variante], color: CORES[tom] } as TextProps['style'],
        style,
      )}
      {...props}
    />
  );
}
