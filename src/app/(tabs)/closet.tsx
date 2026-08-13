import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IlustracaoPeca } from '@/components/closet/ilustracao-peca';
import { TelaPrivada } from '@/components/seguranca/tela-privada';
import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { useSessao } from '@/features/auth/sessao-store';
import { buscarItemCatalogo } from '@/features/closet/catalogo';
import { LIMITE_PECAS, useCloset } from '@/features/closet/closet-store';
import {
  ROTULO_CATEGORIA,
  type Categoria,
  type PecaCloset,
} from '@/features/closet/tipos';
import { usePaleta } from '@/theme/tema-store';
import { espaco, raio, type Paleta } from '@/theme/tokens';

/**
 * Meu closet — as pecas que a usuaria tem.
 *
 * Tela privada: exibe foto pessoal, entao bloqueia captura de tela no
 * Android (ver docs/06-seguranca.md sobre o limite disso no iOS).
 */
export default function Closet() {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);
  const router = useRouter();

  const plano = useSessao((estado) => estado.usuaria?.plano ?? 'gratis');
  const pecas = useCloset((estado) => estado.pecas);
  const carregado = useCloset((estado) => estado.carregado);

  const [filtro, setFiltro] = useState<Categoria | undefined>();

  const categoriasPresentes = useMemo(
    () => [...new Set(pecas.map((p) => p.categoria))],
    [pecas],
  );

  const visiveis = filtro ? pecas.filter((p) => p.categoria === filtro) : pecas;
  const limite = LIMITE_PECAS[plano];

  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'left', 'right']}>
      <TelaPrivada chave="closet" />

      <View style={estilos.cabecalho}>
        <Texto variante="display">Meu closet</Texto>
        <Texto variante="corpoPequeno" tom="suave">
          {pecas.length === 0
            ? 'Nenhuma peça ainda'
            : `${pecas.length === 1 ? '1 peça' : `${pecas.length} peças`}${
                limite === Infinity ? '' : ` de ${limite}`
              }`}
        </Texto>
      </View>

      {pecas.length === 0 && carregado ? (
        <View style={estilos.vazio}>
          <Texto variante="titulo">Monte seu closet</Texto>
          <Texto variante="corpo" tom="suave" style={estilos.textoVazio}>
            Você pode escolher peças parecidas com as suas de uma lista pronta,
            ou fotografar as roupas que já tem.
          </Texto>
          <Botao titulo="Adicionar peças" onPress={() => router.push('/closet/adicionar')} />
        </View>
      ) : (
        <>
          {categoriasPresentes.length > 1 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={estilos.chips}
              style={estilos.chipsArea}
            >
              <Chip rotulo="Todas" ativo={!filtro} onPress={() => setFiltro(undefined)} />
              {categoriasPresentes.map((c) => (
                <Chip
                  key={c}
                  rotulo={ROTULO_CATEGORIA[c]}
                  ativo={filtro === c}
                  onPress={() => setFiltro(c)}
                />
              ))}
            </ScrollView>
          ) : null}

          <ScrollView contentContainerStyle={estilos.grade}>
            {visiveis.map((peca) => (
              <CartaoPeca key={peca.id} peca={peca} />
            ))}
          </ScrollView>

          <View style={estilos.rodape}>
            <Botao titulo="Adicionar peças" onPress={() => router.push('/closet/adicionar')} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

function CartaoPeca({ peca }: { peca: PecaCloset }) {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);
  const router = useRouter();

  const item = peca.origem.tipo === 'catalogo' ? buscarItemCatalogo(peca.origem.idCatalogo) : null;

  return (
    <Pressable
      style={estilos.cartaoPeca}
      onPress={() => router.push({ pathname: '/closet/[id]', params: { id: peca.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${peca.nome}, tamanho ${peca.tamanho}`}
      testID={`peca-closet-${peca.id}`}
    >
      <View style={estilos.miniatura}>
        {peca.origem.tipo === 'foto' ? (
          <Image
            source={peca.origem.caminhoLocal}
            contentFit="cover"
            style={estilos.foto}
            accessible={false}
          />
        ) : (
          <IlustracaoPeca
            categoria={item?.categoria ?? peca.categoria}
            cor={item?.cor ?? peca.cor}
            tamanho={64}
          />
        )}
      </View>
      <Texto variante="corpoPequeno" numberOfLines={1}>
        {peca.nome}
      </Texto>
      <Texto variante="legenda" tom="suave">
        {peca.tamanho}
      </Texto>
    </Pressable>
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
    cabecalho: { paddingHorizontal: espaco.xl, paddingTop: espaco.sm, gap: espaco.xs },
    vazio: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: espaco.md,
      padding: espaco.xl,
    },
    textoVazio: { textAlign: 'center' },
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
    grade: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: espaco.md,
      padding: espaco.lg,
      paddingBottom: espaco.xxl,
    },
    cartaoPeca: {
      width: 104,
      gap: 2,
    },
    miniatura: {
      width: 104,
      height: 104,
      borderRadius: raio.card,
      backgroundColor: paleta.surface,
      borderWidth: 1,
      borderColor: paleta.border,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      marginBottom: espaco.xs,
    },
    foto: { width: '100%', height: '100%' },
    rodape: {
      padding: espaco.lg,
      borderTopWidth: 1,
      borderTopColor: paleta.border,
      backgroundColor: paleta.surface,
    },
  });
