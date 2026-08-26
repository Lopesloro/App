import type { ColorValue } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

/**
 * Os icones das abas.
 *
 * Desenhados a mao em vez de vir de uma familia de icones (Ionicons, Lucide)
 * por dois motivos: nenhuma dessas familias tem um "guarda-roupa" que se
 * entenda, e trazer uma familia inteira para usar tres simbolos custa peso no
 * bundle e uma dependencia a mais para manter.
 *
 * Regras que os tres seguem, para parecerem da mesma familia:
 *
 * - caixa de 24×24, traço de 1.8, cantos e pontas arredondados;
 * - so contorno, nunca preenchimento — preenchido brigaria com o neon;
 * - a cor vem de fora, entao a aba ativa e a inativa usam o mesmo desenho.
 *
 * Sem eles, o expo-router desenha um marcador generico, e tres triangulos
 * iguais nao dizem nada sobre para onde cada aba leva.
 */

// `ColorValue`, e nao `string`: e o tipo que o navegador de abas entrega em
// `tabBarIcon`, e ele nem sempre e uma string (pode ser cor animada).
type Props = { cor: ColorValue; tamanho?: number };

const TRACO = { strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** Cabide: a aba de procurar roupa. Ecoa a marca, em versao simplificada. */
export function IconeRoupas({ cor, tamanho = 24 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path d="M12 8.5 L4.5 16 Q3.6 17 5 17 L19 17 Q20.4 17 19.5 16 Z" stroke={cor} {...TRACO} />
      <Path d="M12 8.5 V6 A2 2 0 1 0 9.8 4.2" stroke={cor} {...TRACO} />
    </Svg>
  );
}

/** Armario de duas portas: a aba do guarda-roupa. */
export function IconeGuardaRoupa({ cor, tamanho = 24 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path d="M4.5 3.5 h15 v17 h-15 Z" stroke={cor} {...TRACO} />
      <Path d="M12 3.5 v17" stroke={cor} {...TRACO} />
      {/* As macanetas: sem elas o desenho vira so um retangulo dividido. */}
      <Path d="M10.3 11 v2" stroke={cor} {...TRACO} />
      <Path d="M13.7 11 v2" stroke={cor} {...TRACO} />
    </Svg>
  );
}

/** Pessoa: a aba do perfil. */
export function IconePerfil({ cor, tamanho = 24 }: Props) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={3.6} stroke={cor} {...TRACO} />
      <Path d="M4.8 20 a7.2 7.2 0 0 1 14.4 0" stroke={cor} {...TRACO} />
    </Svg>
  );
}
