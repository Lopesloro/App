import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartaoLook } from '@/components/look/cartao-look';
import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { useSessao } from '@/features/auth/sessao-store';
import { limiteDoPlano, vagasRestantes } from '@/features/salvos/limites';
import { useSalvos } from '@/features/salvos/salvos-store';
import { useLooksSalvos } from '@/features/salvos/use-looks-salvos';
import { usePaleta } from '@/theme/tema-store';
import { espaco, type Paleta } from '@/theme/tokens';

/** Tela "Meus looks": a colecao que a usuaria montou. */
export default function Salvos() {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);
  const router = useRouter();
  const plano = useSessao((estado) => estado.usuaria?.plano ?? 'gratis');
  const alternarSalvo = useSalvos((estado) => estado.alternar);
  const { looks, indisponiveis, carregando } = useLooksSalvos();

  const limite = limiteDoPlano(plano);
  const restantes = vagasRestantes(plano, looks.length);
  const ilimitado = limite === Infinity;

  if (carregando) {
    return (
      <SafeAreaView style={estilos.centro}>
        <ActivityIndicator color={paleta.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'left', 'right']}>
      <View style={estilos.cabecalho}>
        <Texto variante="display">Meus looks</Texto>
        {looks.length > 0 ? (
          <Texto variante="corpoPequeno" tom="suave">
            {looks.length === 1 ? '1 look salvo' : `${looks.length} looks salvos`}
            {ilimitado ? '' : ` · cabem mais ${restantes}`}
          </Texto>
        ) : null}
      </View>

      {looks.length === 0 ? (
        <View style={estilos.centro}>
          <Texto variante="titulo">Nenhum look salvo ainda</Texto>
          <Texto variante="corpo" tom="suave" style={estilos.textoVazio}>
            Toque no coração de um look que você gostou e ele aparece aqui.
          </Texto>
          <Botao
            titulo="Ver indicações"
            variante="secundario"
            onPress={() => router.push('/(tabs)')}
          />
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
                // Aqui todo look esta salvo por definicao; o coracao serve
                // para remover sem precisar abrir o look.
                aoSalvar={(look) => void alternarSalvo(look.id, plano)}
                salvo
              />
            </View>
          )}
          contentContainerStyle={estilos.lista}
          ListFooterComponent={
            indisponiveis > 0 ? (
              <View style={estilos.rodape}>
                <Texto variante="legenda" tom="suave">
                  {indisponiveis === 1
                    ? '1 look que você salvou saiu do catálogo.'
                    : `${indisponiveis} looks que você salvou saíram do catálogo.`}
                </Texto>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
  tela: { flex: 1 },
  cabecalho: { paddingHorizontal: espaco.xl, paddingTop: espaco.sm, gap: espaco.xs },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.md,
    padding: espaco.xl,
    backgroundColor: paleta.bg,
  },
  textoVazio: { textAlign: 'center' },
  lista: { paddingHorizontal: espaco.lg, paddingTop: espaco.md, paddingBottom: espaco.xxl },
  celula: { flex: 1, padding: espaco.sm },
  rodape: { padding: espaco.lg, alignItems: 'center' },
});
