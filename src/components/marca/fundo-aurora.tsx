import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTema } from '@/theme/tema-store';
import { Brilho } from './brilho';

/**
 * O fundo vivo das telas de entrada.
 *
 * Duas manchas de cor que respiram devagar atras do conteudo, como uma aurora.
 * Existe para a primeira tela nao ser um retangulo parado: e o unico momento
 * em que o app tem a atencao inteira de quem chegou, e movimento lento e a
 * forma mais barata de dizer "isto aqui e vivo" sem escrever nada.
 *
 * ## Por que assim, e nao um video ou um Lottie
 *
 * Video de fundo pesa megabytes, gasta bateria e precisa decodificar antes de
 * aparecer — justamente no instante em que a pessoa esta decidindo se fica.
 * Dois gradientes e duas animacoes custam praticamente nada e comecam no
 * primeiro quadro.
 *
 * As manchas usam gradiente RADIAL (`Brilho`), e nao um gradiente linear
 * dentro de uma `View` redonda. A segunda forma deixa a borda do circulo
 * visivel como uma linha, e o efeito vira "dois circulos coloridos" em vez de
 * "luz difusa".
 *
 * ## As tres regras que o desenho obedece
 *
 * 1. **Roda na thread de UI.** Reanimated anima sem passar pelo JavaScript a
 *    cada quadro, entao a animacao nao engasga quando a busca esta filtrando.
 * 2. **Respeita quem pediu menos movimento.** Com "reduzir movimento" ligado
 *    no sistema, as manchas ficam paradas na posicao final. Movimento
 *    continuo causa enjoo e dor de cabeca em quem tem sensibilidade
 *    vestibular — e o sistema ja sabe quem sao essas pessoas.
 * 3. **Nunca compete com o texto.** As manchas ficam abaixo de tudo e com
 *    opacidade baixa; o contraste do conteudo por cima continua sendo o da
 *    paleta, que passa em AA.
 */

type Props = {
  children: React.ReactNode;
};

const DURACAO_RESPIRO = 9000;
const TAMANHO_MANCHA = 560;

export function FundoAurora({ children }: Props) {
  const tema = useTema();
  const { paleta } = tema;
  const movimentoReduzido = useReducedMotion();

  const respiro = useSharedValue(0);
  const deriva = useSharedValue(0);

  useEffect(() => {
    if (movimentoReduzido) {
      // Estado final, sem animar: o visual continua, o movimento nao.
      respiro.value = 1;
      deriva.value = 1;
      return;
    }

    respiro.value = withRepeat(
      withTiming(1, { duration: DURACAO_RESPIRO, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    deriva.value = withRepeat(
      withTiming(1, { duration: DURACAO_RESPIRO * 1.6, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [movimentoReduzido, respiro, deriva]);

  const manchaPrimaria = useAnimatedStyle(() => ({
    opacity: 0.32 + respiro.value * 0.2,
    transform: [
      { translateY: -40 + respiro.value * 34 },
      { scale: 1 + respiro.value * 0.14 },
    ],
  }));

  const manchaAcento = useAnimatedStyle(() => ({
    opacity: 0.22 + deriva.value * 0.16,
    transform: [
      { translateX: -30 + deriva.value * 60 },
      { translateY: 30 - deriva.value * 26 },
      { scale: 1.1 - deriva.value * 0.12 },
    ],
  }));

  return (
    <View style={[estilos.raiz, { backgroundColor: paleta.bg }]}>
      {/* pointerEvents none: decoracao nunca rouba toque do conteudo. */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={[estilos.mancha, estilos.manchaTopo, manchaPrimaria]}>
          <Brilho cor={paleta.primary} tamanho={TAMANHO_MANCHA} intensidade={0.55} />
        </Animated.View>

        <Animated.View style={[estilos.mancha, estilos.manchaBaixo, manchaAcento]}>
          <Brilho cor={paleta.accent} tamanho={TAMANHO_MANCHA} intensidade={0.45} />
        </Animated.View>
      </View>

      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1 },
  // Sem `borderRadius` nem `overflow`: quem faz a forma redonda e a queda do
  // gradiente, entao nao ha borda para recortar.
  mancha: { position: 'absolute', width: TAMANHO_MANCHA, height: TAMANHO_MANCHA },
  manchaTopo: { top: -230, left: -170 },
  manchaBaixo: { bottom: -260, right: -200 },
});
