import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartaoRoupa } from '@/components/roupa/cartao-roupa';
import { Chip } from '@/components/ui/chip';
import { Texto } from '@/components/ui/texto';
import { useEstilo } from '@/features/estilo/estilo-store';
import { ordenarPorEstilo } from '@/features/estilo/ordenar';
import {
  CATEGORIAS,
  ROTULO_CATEGORIA,
  type Categoria,
} from '@/features/estilo/vocabulario';
import { useGuardaRoupa } from '@/features/guarda-roupa/guarda-roupa-store';
import { useMarcarPeca } from '@/features/guarda-roupa/use-marcar-peca';
import { buscarRoupas } from '@/features/roupas/busca';
import { descreverQuantidade } from '@/features/roupas/tipos';
import { usePaleta } from '@/theme/tema-store';
import { espaco, raio, tipografia, type Paleta } from '@/theme/tokens';

/**
 * Aba principal: procurar tipo de roupa e marcar o que voce tem.
 *
 * Esta e a tela do app. Tudo o que ela faz cabe numa frase — procure a peca,
 * toque nela, ela entra no seu guarda-roupa —, e cada decisao aqui existe
 * para essa frase continuar verdadeira:
 *
 * - **Sem tela de detalhe.** O cartao inteiro e o botao. Montar um armario
 *   sao dezenas de toques; um detalhe no meio de cada um transformaria a
 *   tarefa em trabalho.
 * - **Busca sem botao de buscar.** O catalogo esta no aparelho, entao o
 *   resultado muda enquanto a usuaria digita. Nao ha rede para esperar.
 * - **Ordem que aprende.** O que ela ja marcou empurra para cima o que se
 *   parece com aquilo — mas nunca por cima do que ela digitou.
 */
export default function Roupas() {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);

  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState<Categoria | undefined>();

  const perfil = useEstilo((estado) => estado.perfil);
  const guardadas = useGuardaRoupa((estado) => estado.pecas);
  const marcar = useMarcarPeca();

  const idsGuardados = useMemo(
    () => new Set(guardadas.map((peca) => peca.id)),
    [guardadas],
  );

  const sugestoes = useMemo(
    () => ordenarPorEstilo(buscarRoupas({ texto, categoria }), perfil),
    [texto, categoria, perfil],
  );

  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'left', 'right']}>
      <View style={estilos.cabecalho}>
        <Texto variante="display">Suas roupas</Texto>
        <Texto variante="corpoPequeno" tom="suave">
          {guardadas.length === 0
            ? 'Marque o que você já tem para montar seu guarda-roupa.'
            : `${descreverQuantidade(guardadas.length)} no seu guarda-roupa.`}
        </Texto>

        <TextInput
          value={texto}
          onChangeText={setTexto}
          style={estilos.busca}
          placeholder="Procure: camisa, saia, tênis…"
          placeholderTextColor={paleta.inkSoft}
          accessibilityLabel="Procurar tipo de roupa"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          clearButtonMode="while-editing"
          testID="campo-busca"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.chips}
        style={estilos.chipsArea}
      >
        <Chip
          rotulo="Tudo"
          ativo={categoria === undefined}
          onPress={() => setCategoria(undefined)}
          testID="chip-tudo"
        />
        {CATEGORIAS.map((valor) => (
          <Chip
            key={valor}
            rotulo={ROTULO_CATEGORIA[valor]}
            ativo={categoria === valor}
            onPress={() => setCategoria(categoria === valor ? undefined : valor)}
            testID={`chip-${valor}`}
          />
        ))}
      </ScrollView>

      {sugestoes.length === 0 ? (
        <View style={estilos.centro}>
          <Texto variante="titulo">Nada com esse nome</Texto>
          <Texto variante="corpo" tom="suave" style={estilos.textoCentro}>
            Tente outro termo, ou toque em “Tudo” para ver o catálogo inteiro.
          </Texto>
        </View>
      ) : (
        <FlashList
          data={sugestoes}
          keyExtractor={(item) => item.roupa.id}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={estilos.celula}>
              <CartaoRoupa
                roupa={item.roupa}
                guardada={idsGuardados.has(item.roupa.id)}
                motivo={item.motivo}
                onMarcar={(roupa) => void marcar(roupa)}
              />
            </View>
          )}
          contentContainerStyle={estilos.lista}
        />
      )}
    </SafeAreaView>
  );
}

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    tela: { flex: 1 },
    cabecalho: { paddingHorizontal: espaco.xl, paddingTop: espaco.sm, gap: espaco.xs },
    busca: {
      marginTop: espaco.md,
      borderWidth: 1,
      borderColor: paleta.border,
      backgroundColor: paleta.surface,
      borderRadius: raio.botao,
      paddingHorizontal: espaco.lg,
      minHeight: 48,
      color: paleta.ink,
      fontSize: tipografia.corpo.fontSize,
    },
    chipsArea: { flexGrow: 0 },
    chips: { paddingHorizontal: espaco.xl, paddingVertical: espaco.md, gap: espaco.sm },
    lista: { paddingHorizontal: espaco.lg, paddingBottom: espaco.xxl },
    celula: { flex: 1, padding: espaco.sm },
    centro: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: espaco.md,
      padding: espaco.xl,
    },
    textoCentro: { textAlign: 'center' },
  });
