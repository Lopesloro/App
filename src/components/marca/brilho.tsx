import { memo } from 'react';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

/**
 * Um brilho redondo que se apaga nas bordas.
 *
 * ## Por que existe
 *
 * A tentativa obvia — uma `View` circular com `backgroundColor` e opacidade
 * baixa — produz um **disco**, nao um brilho: a borda e uma linha nitida, e o
 * olho a le como uma forma solida, nao como luz. Numa tela de abertura isso e
 * a diferenca entre "tem um brilho atras da marca" e "tem uma bola verde
 * atras da marca".
 *
 * Luz de verdade cai com a distancia, entao aqui e um gradiente radial que
 * vai da cor cheia no centro ate transparente na borda.
 *
 * ## Por que SVG e nao sombra
 *
 * `shadowRadius` do iOS e `elevation` do Android desenham sombras escuras
 * atras de caixas — nao servem para halo colorido, e cada plataforma trata de
 * um jeito. O gradiente radial em SVG desenha igual no iPhone, no Android e
 * no navegador, que e onde o app esta sendo visto hoje.
 */

type Props = {
  cor: string;
  /** Lado do quadrado que contem o brilho. */
  tamanho: number;
  /** Opacidade no centro. Nas bordas e sempre zero. */
  intensidade?: number;
  /**
   * Onde a luz comeca a cair, de 0 a 1. Valor baixo espalha o brilho; alto
   * concentra no meio e deixa a queda mais curta.
   */
  nucleo?: number;
};

function BrilhoBase({ cor, tamanho, intensidade = 0.5, nucleo = 0.15 }: Props) {
  // Id unico por combinacao: dois gradientes com o mesmo id no mesmo
  // documento fazem o segundo herdar as cores do primeiro.
  const id = `brilho-${cor.replace(/[^a-z0-9]/gi, '')}-${Math.round(intensidade * 100)}-${Math.round(nucleo * 100)}`;

  return (
    <Svg width={tamanho} height={tamanho} pointerEvents="none">
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" r="50%">
          <Stop offset={`${nucleo * 100}%`} stopColor={cor} stopOpacity={intensidade} />
          {/* Passo intermediario: sem ele a queda e linear e parece um cone. */}
          <Stop offset="55%" stopColor={cor} stopOpacity={intensidade * 0.35} />
          <Stop offset="100%" stopColor={cor} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect width={tamanho} height={tamanho} fill={`url(#${id})`} />
    </Svg>
  );
}

export const Brilho = memo(BrilhoBase);
