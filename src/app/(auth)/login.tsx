import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { FundoAurora } from '@/components/marca/fundo-aurora';
import { Logo } from '@/components/marca/logo';
import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { credenciaisSchema, forcaSenha, type ForcaSenha } from '@/features/auth/schemas';
import { useSessao } from '@/features/auth/sessao-store';
import { usePaleta } from '@/theme/tema-store';
import { espaco, raio, tipografia, type Paleta } from '@/theme/tokens';

/**
 * Entrar com conta.
 *
 * ## Estado honesto desta tela
 *
 * A validacao aqui e a definitiva (os mesmos schemas zod que o backend vai
 * usar). O que nao existe e a chamada de rede: nao ha API de autenticacao
 * ainda (issues #6 e #7).
 *
 * Antes, o botao validava e nao dizia mais nada — a pessoa ficava presa sem
 * entender por que. Agora a tela **admite** que a conta ainda nao existe e
 * oferece a porta que funciona: entrar sem conta. Uma tela que finge que vai
 * funcionar e pior do que uma que explica por que nao vai.
 *
 * ## Medidor de forca da senha
 *
 * E orientacao local, nao politica. A politica que vale e a do backend, que
 * tambem checa vazamentos conhecidos. Mostrar aqui serve para a pessoa
 * escolher melhor antes de digitar, nao para barrar.
 */
export default function Login() {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);
  const router = useRouter();
  const movimentoReduzido = useReducedMotion();

  const entrarSemConta = useSessao((estado) => estado.entrarSemConta);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const forca = senha.length > 0 ? forcaSenha(senha) : null;

  function continuar() {
    const resultado = credenciaisSchema.safeParse({ email, senha });
    if (!resultado.success) {
      // Mensagem generica de campo, sem revelar se o e-mail existe na base
      // (criterio de seguranca das issues #6 e #8).
      setErro(resultado.error.issues[0]?.message ?? 'Confira os dados.');
      setAviso(null);
      return;
    }

    setErro(null);
    setAviso(
      'Os dados estão certos, mas o servidor de contas ainda não existe. ' +
        'Entre sem conta — o app funciona inteiro assim.',
    );
  }

  async function semConta() {
    await entrarSemConta();
    router.replace('/(tabs)');
  }

  const entrada = (atraso: number) =>
    movimentoReduzido ? undefined : FadeInDown.delay(atraso).duration(460).springify();

  return (
    <FundoAurora>
      <SafeAreaView style={estilos.tela}>
        <Animated.View entering={entrada(0)} style={estilos.cabecalho}>
          <Logo tamanho={56} />
          <Texto variante="display">Entrar</Texto>
        </Animated.View>

        <Animated.View entering={entrada(120)} style={estilos.campos}>
          <View style={estilos.campo}>
            <Texto variante="legenda" tom="suave">
              E-mail
            </Texto>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={estilos.input}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              inputMode="email"
              accessibilityLabel="E-mail"
              placeholder="voce@exemplo.com"
              placeholderTextColor={paleta.inkSoft}
              testID="campo-email"
            />
          </View>

          <View style={estilos.campo}>
            <Texto variante="legenda" tom="suave">
              Senha
            </Texto>
            <TextInput
              value={senha}
              onChangeText={setSenha}
              style={estilos.input}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="current-password"
              accessibilityLabel="Senha"
              placeholder="Pelo menos 8 caracteres"
              placeholderTextColor={paleta.inkSoft}
              testID="campo-senha"
            />
            {forca ? <MedidorDeForca forca={forca} /> : null}
          </View>

          {erro ? (
            <Texto variante="corpoPequeno" tom="erro" accessibilityRole="alert">
              {erro}
            </Texto>
          ) : null}

          {aviso ? (
            <View style={estilos.caixaAviso} accessibilityRole="alert">
              <Texto variante="corpoPequeno">{aviso}</Texto>
            </View>
          ) : null}
        </Animated.View>

        <Animated.View entering={entrada(240)} style={estilos.acoes}>
          <Botao titulo="Continuar" onPress={continuar} testID="botao-continuar" />
          <Pressable
            onPress={() => void semConta()}
            accessibilityRole="button"
            testID="entrar-sem-conta"
            style={estilos.semConta}
          >
            <Texto variante="corpoPequeno" tom="destaque">
              Entrar sem conta
            </Texto>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </FundoAurora>
  );
}

/**
 * Tres barras em vez de uma palavra.
 *
 * "Força da senha: media" obriga a ler; tres barras se entendem de relance,
 * e o rotulo continua ali para quem usa leitor de tela.
 */
function MedidorDeForca({ forca }: { forca: ForcaSenha }) {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);

  const preenchidas = forca === 'fraca' ? 1 : forca === 'media' ? 2 : 3;
  const cor =
    forca === 'fraca' ? paleta.danger : forca === 'media' ? paleta.gold : paleta.primary;

  return (
    <View
      style={estilos.medidor}
      accessibilityRole="progressbar"
      accessibilityLabel={`Força da senha: ${forca}`}
    >
      {[0, 1, 2].map((indice) => (
        <View
          key={indice}
          style={[
            estilos.barraForca,
            { backgroundColor: indice < preenchidas ? cor : paleta.border },
          ]}
        />
      ))}
    </View>
  );
}

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    tela: { flex: 1, padding: espaco.xl, gap: espaco.xl },
    cabecalho: { gap: espaco.md, marginTop: espaco.lg },
    campos: { flex: 1, gap: espaco.lg, marginTop: espaco.lg },
    campo: { gap: espaco.xs },
    input: {
      borderWidth: 1,
      borderColor: paleta.border,
      backgroundColor: paleta.surface,
      borderRadius: raio.botao,
      paddingHorizontal: espaco.lg,
      minHeight: 52,
      color: paleta.ink,
      fontSize: tipografia.corpo.fontSize,
    },
    medidor: { flexDirection: 'row', gap: espaco.xs, marginTop: espaco.xs },
    barraForca: { flex: 1, height: 3, borderRadius: 2 },
    caixaAviso: {
      padding: espaco.lg,
      borderRadius: raio.card,
      borderWidth: 1,
      borderColor: paleta.primary,
      backgroundColor: paleta.primarySoft,
    },
    acoes: { gap: espaco.md },
    semConta: { alignSelf: 'center', padding: espaco.md, minHeight: 44 },
  });
