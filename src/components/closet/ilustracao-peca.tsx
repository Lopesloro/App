import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

import { HEX_DA_COR, type Categoria, type CorPeca } from '@/features/closet/tipos';

type Props = {
  categoria: Categoria;
  cor: CorPeca;
  tamanho?: number;
};

/**
 * Desenho da peca de roupa.
 *
 * Sao silhuetas vetoriais, nao fotos. Duas razoes:
 *  - foto de catalogo exige licenca de imagem de cada marca, e a gente ainda
 *    nao tem contrato com loja nenhuma;
 *  - vetor nao depende de internet nem de servico externo que sai do ar, e
 *    fica nitido em qualquer tela.
 *
 * Quando a curadoria tiver fotos licenciadas, elas substituem o desenho sem
 * mexer no resto da tela.
 */
export function IlustracaoPeca({ categoria, cor, tamanho = 72 }: Props) {
  const preenchimento = HEX_DA_COR[cor];
  // Contorno levemente mais escuro que o preenchimento mantem a silhueta
  // legivel inclusive nas cores claras (branco sobre fundo branco).
  const contorno = 'rgba(0,0,0,0.22)';
  const comum = { fill: preenchimento, stroke: contorno, strokeWidth: 1.5 };

  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 64 64">
      <G>{desenho(categoria, comum)}</G>
    </Svg>
  );
}

type Comum = { fill: string; stroke: string; strokeWidth: number };

function desenho(categoria: Categoria, c: Comum) {
  switch (categoria) {
    case 'camiseta':
    case 'blusa':
      return (
        <Path
          d="M22 12 L14 17 L11 26 L17 29 L18 52 L46 52 L47 29 L53 26 L50 17 L42 12 L38 16 Q32 20 26 16 Z"
          {...c}
        />
      );
    case 'camisa':
      return (
        <>
          <Path
            d="M22 12 L14 17 L11 26 L17 29 L18 52 L46 52 L47 29 L53 26 L50 17 L42 12 L32 18 Z"
            {...c}
          />
          <Path d="M32 18 L32 52" stroke={c.stroke} strokeWidth={1.2} fill="none" />
        </>
      );
    case 'blazer':
    case 'jaqueta':
      return (
        <>
          <Path d="M22 12 L13 18 L10 30 L16 32 L17 53 L47 53 L48 32 L54 30 L51 18 L42 12 L32 22 Z" {...c} />
          <Path d="M24 13 L32 24 L40 13" stroke={c.stroke} strokeWidth={1.2} fill="none" />
        </>
      );
    case 'casaco':
      return (
        <>
          <Path d="M21 11 L12 18 L9 32 L16 34 L17 56 L47 56 L48 34 L55 32 L52 18 L43 11 L32 20 Z" {...c} />
          <Path d="M32 20 L32 56" stroke={c.stroke} strokeWidth={1.2} fill="none" />
          <Circle cx="32" cy="30" r="1.4" fill={c.stroke} />
          <Circle cx="32" cy="40" r="1.4" fill={c.stroke} />
        </>
      );
    case 'vestido':
      return (
        <Path
          d="M24 11 L17 16 L15 25 L20 27 L18 34 L13 54 L51 54 L46 34 L44 27 L49 25 L47 16 L40 11 L36 15 Q32 19 28 15 Z"
          {...c}
        />
      );
    case 'macacao':
      return (
        <>
          <Path d="M23 11 L17 16 L15 26 L20 28 L20 36 L18 55 L30 55 L31 40 L33 40 L34 55 L46 55 L44 36 L44 28 L49 26 L47 16 L41 11 L32 17 Z" {...c} />
        </>
      );
    case 'saia':
      return <Path d="M20 18 L44 18 L52 50 L12 50 Z" {...c} />;
    case 'calca':
      return (
        <Path
          d="M20 12 L44 12 L46 22 L44 55 L35 55 L32 30 L29 55 L20 55 L18 22 Z"
          {...c}
        />
      );
    case 'short':
      return (
        <Path d="M20 16 L44 16 L45 24 L43 40 L34 40 L32 28 L30 40 L21 40 L19 24 Z" {...c} />
      );
    case 'sapato':
      return (
        <>
          <Path d="M12 40 L12 30 Q22 30 30 34 L48 42 Q52 44 52 47 L52 49 L12 49 Z" {...c} />
          <Path d="M12 44 L52 44" stroke={c.stroke} strokeWidth={1} fill="none" />
        </>
      );
    case 'bolsa':
      return (
        <>
          <Rect x="16" y="26" width="32" height="26" rx="3" {...c} />
          <Path d="M24 26 Q24 15 32 15 Q40 15 40 26" stroke={c.stroke} strokeWidth={1.8} fill="none" />
        </>
      );
    case 'acessorio':
      return (
        <>
          <Circle cx="32" cy="32" r="15" fill="none" stroke={c.fill} strokeWidth={4} />
          <Circle cx="32" cy="32" r="15" fill="none" stroke={c.stroke} strokeWidth={0.8} />
          <Circle cx="32" cy="17" r="3.5" fill={c.fill} stroke={c.stroke} strokeWidth={1} />
        </>
      );
    default:
      return <Rect x="16" y="16" width="32" height="32" rx="4" {...c} />;
  }
}
