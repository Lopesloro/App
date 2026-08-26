import { memo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

import { usePaleta } from '@/theme/tema-store';

/**
 * A marca: um cabide que também é um prisma.
 *
 * ## A ideia
 *
 * O app pega o que a pessoa já tem e decompõe aquilo em estilo. Um prisma faz
 * exatamente isso com a luz: entra uma coisa só, saem as componentes dela.
 *
 * Por isso o desenho tem duas leituras. De relance, à distância de um ícone na
 * tela inicial, é um **cabide** — ninguém precisa decifrar nada para saber que
 * o assunto é roupa. Olhando de perto, o corpo do cabide é um **prisma** e da
 * base saem três feixes: as três dimensões que o algoritmo aprende.
 *
 * ## Por que vetor, e desenhado à mão em `Path`
 *
 * - **Escala.** O mesmo arquivo serve para o ícone de 16px e para a tela de
 *   abertura em tela cheia, sem borrar e sem exportar dez tamanhos.
 * - **Segue o tema.** As cores vêm da paleta ativa, então a marca acompanha a
 *   troca de visual em vez de destoar dela.
 * - **Peso zero.** Não há PNG para baixar, nada externo para falhar.
 *
 * ## O brilho
 *
 * O halo é feito empilhando o mesmo traço três vezes, cada vez mais grosso e
 * mais transparente. Filtro de desfoque em SVG é irregular no React Native e
 * caro no Android de entrada; camadas são previsíveis em qualquer aparelho e
 * custam três `Path` a mais.
 */

type Props = {
  /** Lado do quadrado, em pixels. */
  tamanho?: number;
  /** Desliga o halo. Use em fundo claro ou em lista, onde brilho vira sujeira. */
  comBrilho?: boolean;
  /** Sobrescreve a cor do traço. Por padrão, a cor primária do tema. */
  cor?: string;
  style?: StyleProp<ViewStyle>;
};

/** Cabide + prisma, num traço só. Coordenadas na caixa de 64×64. */
const TRACO_CABIDE = 'M32 20 L13 41 Q11 44 15 44 L49 44 Q53 44 51 41 Z';

/** O gancho, que também é o ponto de entrada da luz no prisma. */
const TRACO_GANCHO = 'M32 20 L32 13 A5 5 0 1 0 26.5 8';

/** Os três feixes que saem da base: estilo, caimento e ocasião. */
const FEIXES = ['M22 48 L18 58', 'M32 48 L32 59', 'M42 48 L46 58'];

function LogoBase({ tamanho = 64, comBrilho = true, cor, style }: Props) {
  const paleta = usePaleta();
  const traco = cor ?? paleta.primary;
  const halo = paleta.accent;

  // Espessura proporcional: em 16px o traço fino some, em 240px fica anêmico.
  const grossura = Math.max(1.5, tamanho * 0.045);

  return (
    <View style={style} accessibilityRole="image" accessibilityLabel="Monta Looks">
      <Svg width={tamanho} height={tamanho} viewBox="0 0 64 64" fill="none">
        {comBrilho ? (
          <G opacity={0.55}>
            <Path
              d={TRACO_CABIDE}
              stroke={halo}
              strokeWidth={grossura * 3.2}
              strokeLinejoin="round"
              opacity={0.18}
            />
            <Path
              d={TRACO_CABIDE}
              stroke={traco}
              strokeWidth={grossura * 2}
              strokeLinejoin="round"
              opacity={0.3}
            />
          </G>
        ) : null}

        <Path
          d={TRACO_CABIDE}
          stroke={traco}
          strokeWidth={grossura}
          strokeLinejoin="round"
        />
        <Path
          d={TRACO_GANCHO}
          stroke={traco}
          strokeWidth={grossura}
          strokeLinecap="round"
          fill="none"
        />

        {/* A luz entrando: o ponto onde o prisma recebe. */}
        <Circle cx={32} cy={31} r={grossura * 1.1} fill={halo} />

        {FEIXES.map((feixe, indice) => (
          <Path
            key={feixe}
            d={feixe}
            stroke={indice === 1 ? traco : halo}
            strokeWidth={grossura * 0.8}
            strokeLinecap="round"
            // O feixe central é o estilo, que pesa mais no algoritmo; os
            // laterais são caimento e ocasião, e aparecem mais discretos.
            opacity={indice === 1 ? 0.95 : 0.6}
          />
        ))}
      </Svg>
    </View>
  );
}

export const Logo = memo(LogoBase);
