import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Brilho } from '@/components/marca/brilho';
import { FundoAurora } from '@/components/marca/fundo-aurora';
import { Logo } from '@/components/marca/logo';
import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { useSessao } from '@/features/auth/sessao-store';
import { usePaleta } from '@/theme/tema-store';
import { espaco, raio, type Paleta } from '@/theme/tokens';

/**
 * A primeira tela.
 *
 * ## O que ela precisa fazer em tres segundos
 *
 * 1. Dizer o que o app e, sem jargao.
 * 2. Provar que vale o toque — dai o movimento e a marca em destaque.
 * 3. Sair da frente. O botao entra direto, sem cadastro.
 *
 * ## Entrar sem conta nao e atalho
 *
 * O app inteiro roda no aparelho: catalogo embutido, guarda-roupa local,
 * algoritmo local. Pedir e-mail e senha para entregar o que ja funciona sem
 * eles seria coletar dado pessoal a troco de nada — o oposto do que o projeto
 * promete (docs/06-seguranca.md). A conta entra quando servir para algo que so
 * servidor faz: levar o guarda-roupa para outro celular (issue #6).
 *
 * ## A animacao tem ordem, e a ordem tem motivo
 *
 * A marca chega primeiro e sozinha, depois o texto, depois os botoes. E a
 * ordem em que a pessoa precisa entender as coisas: quem e voce, o que voce
 * faz, o que eu faco agora. Tudo desaparece quando o sistema pede menos
 * movimento.
 */
const TAMANHO_HALO = 280;

export default function BoasVindas() {
  const router = useRouter();
  const paleta = usePaleta();
  const estilos = criarEstilos(paleta);
  const entrarSemConta = useSessao((estado) => estado.entrarSemConta);
  const movimentoReduzido = useReducedMotion();

  const escalaMarca = useSharedValue(movimentoReduzido ? 1 : 0.82);
  const pulso = useSharedValue(0);

  useEffect(() => {
    if (movimentoReduzido) return;

    escalaMarca.value = withSpring(1, { damping: 13, stiffness: 110 });
    pulso.value = withDelay(
      600,
      withRepeat(
        withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      ),
    );
  }, [movimentoReduzido, escalaMarca, pulso]);

  const marcaAnimada = useAnimatedStyle(() => ({
    transform: [{ scale: escalaMarca.value }],
  }));

  const haloAnimado = useAnimatedStyle(() => ({
    opacity: 0.25 + pulso.value * 0.35,
    transform: [{ scale: 0.95 + pulso.value * 0.18 }],
  }));

  async function comecar() {
    await entrarSemConta();
    router.replace('/(tabs)');
  }

  // Sem movimento reduzido, cada bloco entra com um atraso crescente.
  const entrada = (atraso: number) =>
    movimentoReduzido ? undefined : FadeInDown.delay(atraso).duration(520).springify();

  return (
    <FundoAurora>
      <SafeAreaView style={estilos.tela}>
        <View style={estilos.centro}>
          <View style={estilos.marca}>
            <Animated.View style={[estilos.halo, haloAnimado]} pointerEvents="none">
              <Brilho cor={paleta.primary} tamanho={TAMANHO_HALO} intensidade={0.6} />
            </Animated.View>
            <Animated.View style={marcaAnimada}>
              <Logo tamanho={124} />
            </Animated.View>
          </View>

          <Animated.View entering={entrada(260)} style={estilos.textos}>
            <Texto variante="displayGrande" style={estilos.titulo}>
              Seu guarda-roupa{'\n'}decifrado.
            </Texto>
            <Texto variante="corpo" tom="suave" style={estilos.subtitulo}>
              Marque as roupas que você tem. Eu leio o seu estilo e coloco na
              frente o que combina com você.
            </Texto>
          </Animated.View>

          <Animated.View entering={entrada(420)} style={estilos.selo}>
            <View style={estilos.pontoVivo} />
            <Texto variante="legenda" tom="destaque">
              Roda no seu celular · nada sai daqui
            </Texto>
          </Animated.View>
        </View>

        <Animated.View entering={entrada(560)} style={estilos.acoes}>
          <Botao titulo="Começar" onPress={() => void comecar()} />
          <Botao
            titulo="Já tenho conta"
            variante="texto"
            onPress={() => router.push('/login')}
          />
          <Texto variante="legenda" tom="suave" style={estilos.aviso}>
            Sem cadastro, sem anúncios e sem nada à venda.
          </Texto>
        </Animated.View>
      </SafeAreaView>
    </FundoAurora>
  );
}

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    tela: { flex: 1, padding: espaco.xl, justifyContent: 'space-between' },
    centro: { flex: 1, justifyContent: 'center', gap: espaco.xl },
    marca: { alignItems: 'center', justifyContent: 'center', height: 150 },
    // O brilho e desenhado por dentro (gradiente radial), entao aqui so ha
    // posicao e tamanho. Um `backgroundColor` aqui viraria um disco solido.
    halo: {
      position: 'absolute',
      width: TAMANHO_HALO,
      height: TAMANHO_HALO,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textos: { gap: espaco.md },
    titulo: { letterSpacing: -0.5 },
    subtitulo: { maxWidth: 340 },
    selo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: espaco.sm,
      alignSelf: 'flex-start',
      paddingHorizontal: espaco.md,
      paddingVertical: espaco.sm,
      borderRadius: raio.chip,
      borderWidth: 1,
      borderColor: paleta.border,
      backgroundColor: paleta.surface,
    },
    pontoVivo: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: paleta.primary,
    },
    acoes: { gap: espaco.sm },
    aviso: { textAlign: 'center', marginTop: espaco.sm },
  });
