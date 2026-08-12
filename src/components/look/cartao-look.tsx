import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { Texto } from '@/components/ui/texto';
import { formatarPreco } from '@/features/assinatura/planos';
import { precoTotalLook, type Look } from '@/features/feed/tipos';
import { espaco, paleta, raio, PROPORCAO_FOTO } from '@/theme/tokens';

type Props = {
  look: Look;
  onPress?: (look: Look) => void;
};

/**
 * Cartao do feed. Memoizado porque a lista re-renderiza a cada pagina nova e
 * o cartao so muda quando o look muda.
 */
/** "1 peça" / "3 peças" — plural correto importa num app de moda. */
export function descreverPecas(quantidade: number): string {
  return quantidade === 1 ? '1 peça' : `${quantidade} peças`;
}

function CartaoLookBase({ look, onPress }: Props) {
  const total = precoTotalLook(look);
  const pecas = descreverPecas(look.pecas.length);

  return (
    <Pressable
      onPress={() => onPress?.(look)}
      accessibilityRole="button"
      // Leitor de tela le uma frase util, nao "imagem, botao".
      accessibilityLabel={`${look.titulo}. ${pecas}, total ${formatarPreco(total)}.`}
      style={({ pressed }) => [estilos.cartao, pressed ? estilos.pressionado : null]}
      testID={`cartao-look-${look.id}`}
    >
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
          {pecas} · {formatarPreco(total)}
        </Texto>
      </View>
    </Pressable>
  );
}

export const CartaoLook = memo(CartaoLookBase);

const estilos = StyleSheet.create({
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
    right: espaco.sm,
    backgroundColor: paleta.surface,
    paddingHorizontal: espaco.sm,
    paddingVertical: espaco.xs,
    borderRadius: raio.chip,
  },
  info: { padding: espaco.md, gap: espaco.xs },
});
