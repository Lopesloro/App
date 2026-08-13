import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { Texto } from '@/components/ui/texto';
import { resumoPecas, tamanhosDoLook, type Look } from '@/features/feed/tipos';
import { usePaleta } from '@/theme/tema-store';
import { espaco, raio, PROPORCAO_FOTO, type Paleta } from '@/theme/tokens';
import { IlustracaoLook } from './ilustracao-look';

type Props = {
  look: Look;
  onPress?: (look: Look) => void;
  /** Mostra o coracao de salvar sobre a imagem. */
  aoSalvar?: (look: Look) => void;
  salvo?: boolean;
};

/** "1 peça" / "3 peças" — plural correto importa num app de moda. */
export function descreverPecas(quantidade: number): string {
  return quantidade === 1 ? '1 peça' : `${quantidade} peças`;
}

/**
 * Cartao do feed. Memoizado porque a lista re-renderiza a cada pagina nova e
 * o cartao so muda quando o look muda.
 *
 * O coracao fica FORA do botao do cartao, como irmao dentro de um container
 * comum. Um botao dentro de outro botao e HTML invalido na web e, no celular,
 * faz o leitor de tela anunciar "botao, dentro de botao" — a usuaria nao
 * descobre que sao duas acoes diferentes.
 */
function CartaoLookBase({ look, onPress, aoSalvar, salvo = false }: Props) {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);

  const pecas = resumoPecas(look);
  const tamanhos = tamanhosDoLook(look);

  return (
    <View style={estilos.container}>
      <Pressable
        onPress={() => onPress?.(look)}
        accessibilityRole="button"
        // Leitor de tela le uma frase util, nao "imagem, botao".
        accessibilityLabel={`${look.titulo}. ${pecas}, tamanhos ${tamanhos}.`}
        style={({ pressed }) => [estilos.cartao, pressed ? estilos.pressionado : null]}
        testID={`cartao-look-${look.id}`}
      >
        {look.fotoUrl ? (
          <Image
            source={look.fotoUrl}
            placeholder={{ blurhash: look.blurhash }}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
            recyclingKey={look.id}
            style={estilos.foto}
            accessible={false}
          />
        ) : (
          // Sem foto publicada ainda: desenhamos o look a partir das pecas.
          <View style={estilos.foto}>
            <IlustracaoLook look={look} altura={200} />
          </View>
        )}

        {look.geradoPorIa ? (
          <View style={estilos.selo}>
            <Texto variante="legenda" tom="suave">
              Imagem gerada por IA
            </Texto>
          </View>
        ) : null}

        <View style={estilos.info}>
          <Texto variante="titulo" numberOfLines={1}>
            {look.titulo}
          </Texto>
          <Texto variante="corpoPequeno" tom="suave">
            {pecas} · {tamanhos}
          </Texto>
        </View>
      </Pressable>

      {aoSalvar ? (
        <Pressable
          onPress={() => aoSalvar(look)}
          accessibilityRole="button"
          accessibilityState={{ selected: salvo }}
          accessibilityLabel={salvo ? 'Remover dos salvos' : 'Salvar look'}
          testID={`salvar-cartao-${look.id}`}
          hitSlop={8}
          style={estilos.coracao}
        >
          <Texto variante="titulo" tom={salvo ? 'destaque' : 'principal'}>
            {salvo ? '♥' : '♡'}
          </Texto>
        </Pressable>
      ) : null}
    </View>
  );
}

export const CartaoLook = memo(CartaoLookBase);

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    container: { flex: 1, position: 'relative' },
    cartao: {
      backgroundColor: paleta.surface,
      borderRadius: raio.card,
      borderWidth: 1,
      borderColor: paleta.border,
      overflow: 'hidden',
      flex: 1,
    },
    pressionado: { opacity: 0.9 },
    foto: {
      width: '100%',
      aspectRatio: PROPORCAO_FOTO,
      backgroundColor: paleta.primarySoft,
    },
    selo: {
      position: 'absolute',
      top: espaco.sm,
      left: espaco.sm,
      backgroundColor: paleta.surface,
      paddingHorizontal: espaco.sm,
      paddingVertical: espaco.xs,
      borderRadius: raio.chip,
    },
    coracao: {
      position: 'absolute',
      top: espaco.sm,
      right: espaco.sm,
      width: 40,
      height: 40,
      borderRadius: raio.chip,
      backgroundColor: paleta.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: { padding: espaco.md, gap: espaco.xs },
  });
