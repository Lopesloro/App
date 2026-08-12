import { Text as TextoRN, type TextProps } from 'react-native';

import { usePaleta } from '@/theme/tema-store';
import { tipografia } from '@/theme/tokens';

type Variante = keyof typeof tipografia;
type Tom = 'principal' | 'suave' | 'destaque' | 'erro' | 'sobreDestaque';

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
  const paleta = usePaleta();

  const cores: Record<Tom, string> = {
    principal: paleta.ink,
    suave: paleta.inkSoft,
    destaque: paleta.primary,
    erro: paleta.danger,
    /** Texto sobre fundo colorido (botao primario). */
    sobreDestaque: paleta.surface,
  };

  return (
    <TextoRN
      style={[{ ...tipografia[variante], color: cores[tom] }, style]}
      {...props}
    />
  );
}
