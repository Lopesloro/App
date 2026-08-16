import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartaoRoupa } from '@/components/roupa/cartao-roupa';
import { TelaPrivada } from '@/components/seguranca/tela-privada';
import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { useEstilo } from '@/features/estilo/estilo-store';
import { resumirPerfil } from '@/features/estilo/perfil-estilo';
import { ROTULO_CATEGORIA } from '@/features/estilo/vocabulario';
import { useArmario } from '@/features/guarda-roupa/use-guarda-roupa';
import { useMarcarPeca } from '@/features/guarda-roupa/use-marcar-peca';
import { descreverQuantidade } from '@/features/roupas/tipos';
import { usePaleta } from '@/theme/tema-store';
import { espaco, raio, type Paleta } from '@/theme/tokens';

/**
 * O guarda-roupa da usuaria, organizado como um armario de verdade: por
 * categoria, de cima para baixo do corpo.
 *
 * A tela ja e privada (bloqueia captura no Android) mesmo sem foto nenhuma.
 * O controle entra agora, enquanto o conteudo e so uma lista de tipos de
 * roupa, para nao ser esquecido quando as fotos pessoais chegarem na issue
 * #11 — e essa e a hora em que ele passa a proteger algo serio.
 * Ver docs/06-seguranca.md.
 */
export default function GuardaRoupa() {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);
  const router = useRouter();

  const { carregado, total, desconhecidas, grupos } = useArmario();
  const perfil = useEstilo((estado) => estado.perfil);
  const marcar = useMarcarPeca();

  if (!carregado) {
    return (
      <SafeAreaView style={estilos.centro}>
        <TelaPrivada chave="guarda-roupa" />
        <ActivityIndicator color={paleta.primary} />
      </SafeAreaView>
    );
  }

  if (total === 0) {
    return (
      <SafeAreaView style={estilos.centro}>
        <TelaPrivada chave="guarda-roupa" />
        <Texto variante="titulo">Seu guarda-roupa está vazio</Texto>
        <Texto variante="corpo" tom="suave" style={estilos.textoCentro}>
          Vá em “Roupas”, procure as peças que você tem e toque nelas. Quanto
          mais você marcar, melhor eu entendo o seu estilo.
        </Texto>
        <Botao
          titulo="Procurar roupas"
          variante="secundario"
          onPress={() => router.navigate('/(tabs)')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'left', 'right']}>
      <TelaPrivada chave="guarda-roupa" />

      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.cabecalho}>
          <Texto variante="display">Meu guarda-roupa</Texto>
          <Texto variante="corpoPequeno" tom="suave">
            {descreverQuantidade(total)}
          </Texto>
        </View>

        <View style={estilos.perfil}>
          <Texto variante="corpoPequeno">{resumirPerfil(perfil)}</Texto>
          <Texto variante="legenda" tom="suave" style={estilos.privacidade}>
            Isso é calculado no seu celular e não sai daqui.
          </Texto>
        </View>

        {grupos.map((grupo) => (
          <View key={grupo.categoria} style={estilos.grupo}>
            <Texto variante="titulo">{ROTULO_CATEGORIA[grupo.categoria]}</Texto>
            <Texto variante="legenda" tom="suave">
              {descreverQuantidade(grupo.roupas.length)}
            </Texto>

            <View style={estilos.grade}>
              {grupo.roupas.map((roupa) => (
                <View key={roupa.id} style={estilos.celula}>
                  <CartaoRoupa
                    roupa={roupa}
                    guardada
                    onMarcar={(peca) => void marcar(peca)}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        {desconhecidas > 0 ? (
          <Texto variante="legenda" tom="suave" style={estilos.rodape}>
            {desconhecidas === 1
              ? '1 peça que você guardou saiu do catálogo.'
              : `${desconhecidas} peças que você guardou saíram do catálogo.`}
          </Texto>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    tela: { flex: 1 },
    centro: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: espaco.md,
      padding: espaco.xl,
      backgroundColor: paleta.bg,
    },
    textoCentro: { textAlign: 'center' },
    conteudo: { paddingBottom: espaco.xxl },
    cabecalho: { paddingHorizontal: espaco.xl, paddingTop: espaco.sm, gap: espaco.xs },
    perfil: {
      marginHorizontal: espaco.xl,
      marginTop: espaco.lg,
      padding: espaco.lg,
      backgroundColor: paleta.primarySoft,
      borderRadius: raio.card,
      gap: espaco.xs,
    },
    privacidade: { marginTop: espaco.xs },
    grupo: { paddingHorizontal: espaco.lg, marginTop: espaco.xl, gap: espaco.xs },
    grade: { flexDirection: 'row', flexWrap: 'wrap', marginTop: espaco.sm },
    // Duas colunas: a mesma densidade da aba de busca, para a peca ter o
    // mesmo tamanho nos dois lugares e a usuaria reconhecer o cartao.
    celula: { width: '50%', padding: espaco.sm },
    rodape: { padding: espaco.xl, textAlign: 'center' },
  });
