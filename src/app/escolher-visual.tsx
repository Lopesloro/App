import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { useTema, useTemaStore } from '@/theme/tema-store';
import { LISTA_TEMAS, type Tema } from '@/theme/temas';
import { espaco, PROPORCAO_FOTO } from '@/theme/tokens';

/**
 * Tela de escolha do visual.
 *
 * docs/05-frontend.md propos duas direcoes esteticas e deixou a decisao para
 * um teste de preferencia com usuarias. Esta tela existe para esse teste
 * acontecer no celular, com o app de verdade, em vez de em mockup.
 */
export default function EscolherVisual() {
  const router = useRouter();
  const temaAtivo = useTema();
  const escolher = useTemaStore((estado) => estado.escolher);

  return (
    <SafeAreaView style={[estilos.tela, { backgroundColor: temaAtivo.paleta.bg }]}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Texto variante="display">Escolha o visual</Texto>
        <Texto variante="corpo" tom="suave">
          Toque para ver o app inteiro mudar. Dá para trocar quando quiser.
        </Texto>

        {LISTA_TEMAS.map((tema) => (
          <CartaoTema
            key={tema.id}
            tema={tema}
            ativo={tema.id === temaAtivo.id}
            onPress={() => void escolher(tema.id)}
          />
        ))}
      </ScrollView>

      <View style={estilos.rodape}>
        <Botao titulo="Pronto" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

/** Previa da direcao: mostra as cores aplicadas, nao so uma bolinha. */
function CartaoTema({
  tema,
  ativo,
  onPress,
}: {
  tema: Tema;
  ativo: boolean;
  onPress: () => void;
}) {
  const { paleta } = tema;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: ativo }}
      accessibilityLabel={`Visual ${tema.nome}. ${tema.descricao}`}
      testID={`tema-${tema.id}`}
      style={({ pressed }) => [
        estilos.cartao,
        {
          backgroundColor: paleta.bg,
          borderColor: ativo ? paleta.primary : paleta.border,
          borderWidth: ativo ? 2 : 1,
          borderRadius: tema.raio.card,
        },
        pressed ? estilos.pressionado : null,
      ]}
    >
      <View style={estilos.cabecalhoCartao}>
        <Texto variante="titulo" style={{ color: paleta.ink }}>
          {tema.nome}
        </Texto>
        {ativo ? (
          <Texto variante="legenda" style={{ color: paleta.primary }}>
            Em uso
          </Texto>
        ) : null}
      </View>

      <Texto variante="corpoPequeno" style={{ color: paleta.inkSoft }}>
        {tema.descricao}
      </Texto>

      {/* Previa: um cartao de look em miniatura, com as cores da direcao. */}
      <View style={estilos.previa}>
        <View
          style={[
            estilos.previaFoto,
            { backgroundColor: paleta.primarySoft, borderRadius: tema.raio.card },
          ]}
        />
        <View style={estilos.previaInfo}>
          <View style={[estilos.barra, { backgroundColor: paleta.ink, width: '70%' }]} />
          <View style={[estilos.barra, { backgroundColor: paleta.inkSoft, width: '45%' }]} />
          <View
            style={[
              estilos.previaBotao,
              { backgroundColor: paleta.primary, borderRadius: tema.raio.botao },
            ]}
          />
        </View>
      </View>

      <View style={estilos.amostras}>
        {[paleta.primary, paleta.accent, paleta.gold, paleta.ink].map((cor) => (
          <View key={cor} style={[estilos.amostra, { backgroundColor: cor }]} />
        ))}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1 },
  conteudo: { padding: espaco.xl, gap: espaco.lg },
  cartao: { padding: espaco.lg, gap: espaco.sm },
  pressionado: { opacity: 0.9 },
  cabecalhoCartao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previa: { flexDirection: 'row', gap: espaco.md, marginTop: espaco.sm },
  previaFoto: { width: 72, aspectRatio: PROPORCAO_FOTO },
  previaInfo: { flex: 1, justifyContent: 'center', gap: espaco.sm },
  barra: { height: 10, borderRadius: 5 },
  previaBotao: { height: 28, width: '55%', marginTop: espaco.xs },
  amostras: { flexDirection: 'row', gap: espaco.sm, marginTop: espaco.sm },
  amostra: { width: 28, height: 28, borderRadius: 14 },
  rodape: { padding: espaco.lg },
});
