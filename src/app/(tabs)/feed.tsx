import { useState, useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartaoLook } from '@/components/look/cartao-look';
import { Texto } from '@/components/ui/texto';
import { useSessao } from '@/features/auth/sessao-store';
import { useFeed } from '@/features/feed/use-feed';
import { OCASIOES, type Ocasiao, type Look } from '@/features/feed/tipos';
import { mensagemLimite } from '@/features/salvos/limites';
import { useSalvos } from '@/features/salvos/salvos-store';
import { usePaleta } from '@/theme/tema-store';
import { espaco, raio, type Paleta } from '@/theme/tokens';

const ROTULO_OCASIAO: Record<Ocasiao, string> = {
  trabalho: 'Trabalho',
  casual: 'Casual',
  festa: 'Festa',
  encontro: 'Encontro',
  academia: 'Academia',
  praia: 'Praia',
};

export default function Feed() {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);
  const router = useRouter();
  const [ocasiao, setOcasiao] = useState<Ocasiao | undefined>();
  const { looks, carregando, erro, carregarMais, carregandoMais, recarregar, recarregando } =
    useFeed({ ocasiao });

  const plano = useSessao((estado) => estado.usuaria?.plano ?? 'gratis');
  const salvos = useSalvos((estado) => estado.ids);
  const alternarSalvo = useSalvos((estado) => estado.alternar);
  const [avisoLimite, setAvisoLimite] = useState<string | null>(null);

  async function aoSalvar(look: Look) {
    const resultado = await alternarSalvo(look.id, plano);
    setAvisoLimite(resultado.ok ? null : mensagemLimite(plano));
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'left', 'right']}>
      <View style={estilos.cabecalho}>
        <Texto variante="display">Seus looks</Texto>
      </View>

      {avisoLimite ? (
        <Pressable
          onPress={() => router.push('/paywall')}
          accessibilityRole="button"
          style={estilos.avisoLimite}
        >
          <Texto variante="corpoPequeno" tom="destaque">
            {avisoLimite}
          </Texto>
        </Pressable>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.chips}
        style={estilos.chipsArea}
      >
        <Chip
          rotulo="Todos"
          ativo={ocasiao === undefined}
          onPress={() => setOcasiao(undefined)}
        />
        {OCASIOES.map((valor) => (
          <Chip
            key={valor}
            rotulo={ROTULO_OCASIAO[valor]}
            ativo={ocasiao === valor}
            onPress={() => setOcasiao(valor)}
          />
        ))}
      </ScrollView>

      {carregando ? (
        <View style={estilos.centro}>
          <ActivityIndicator color={paleta.primary} />
        </View>
      ) : erro ? (
        <View style={estilos.centro}>
          <Texto variante="corpo" tom="erro">
            Não conseguimos carregar seus looks.
          </Texto>
          <Pressable onPress={() => void recarregar()} accessibilityRole="button">
            <Texto variante="corpo" tom="destaque">
              Tentar de novo
            </Texto>
          </Pressable>
        </View>
      ) : looks.length === 0 ? (
        <View style={estilos.centro}>
          <Texto variante="corpo" tom="suave">
            Nenhum look para esta ocasião ainda.
          </Texto>
        </View>
      ) : (
        <FlashList
          data={looks}
          keyExtractor={(look) => look.id}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={estilos.celula}>
              <CartaoLook
                look={item}
                onPress={(look) => router.push(`/look/${encodeURIComponent(look.id)}`)}
                aoSalvar={aoSalvar}
                salvo={salvos.includes(item.id)}
              />
            </View>
          )}
          contentContainerStyle={estilos.lista}
          onEndReached={carregarMais}
          onEndReachedThreshold={0.5}
          refreshing={recarregando}
          onRefresh={() => void recarregar()}
          ListFooterComponent={
            carregandoMais ? (
              <View style={estilos.rodape}>
                <ActivityIndicator color={paleta.primary} />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

function Chip({
  rotulo,
  ativo,
  onPress,
}: {
  rotulo: string;
  ativo: boolean;
  onPress: () => void;
}) {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: ativo }}
      style={[estilos.chip, ativo ? estilos.chipAtivo : null]}
    >
      <Texto variante="corpoPequeno" tom={ativo ? 'destaque' : 'suave'}>
        {rotulo}
      </Texto>
    </Pressable>
  );
}

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
  tela: { flex: 1 },
  cabecalho: { paddingHorizontal: espaco.xl, paddingTop: espaco.sm },
  chipsArea: { flexGrow: 0 },
  chips: { paddingHorizontal: espaco.xl, paddingVertical: espaco.md, gap: espaco.sm },
  chip: {
    paddingHorizontal: espaco.lg,
    paddingVertical: espaco.sm,
    borderRadius: raio.chip,
    borderWidth: 1,
    borderColor: paleta.border,
    backgroundColor: paleta.surface,
  },
  chipAtivo: { borderColor: paleta.primary, backgroundColor: paleta.primarySoft },
  lista: { paddingHorizontal: espaco.lg, paddingBottom: espaco.xxl },
  celula: { flex: 1, padding: espaco.sm },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: espaco.md },
  rodape: { paddingVertical: espaco.xl },
  avisoLimite: {
    marginHorizontal: espaco.xl,
    marginTop: espaco.sm,
    padding: espaco.md,
    backgroundColor: paleta.primarySoft,
    borderRadius: raio.card,
  },
});
