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
  /** Mostra o coracao de salvar sobre a foto. */
  aoSalvar?: (look: Look) => void;
  salvo?: boolean;
};

/**
 * Cartao do feed. Memoizado porque a lista re-renderiza a cada pagina nova e
 * o cartao so muda quando o look muda.
 */
/** "1 peça" / "3 peças" — plural correto importa num app de moda. */
export function descreverPecas(quantidade: number): string {
  return quantidade === 1 ? '1 peça' : `${quantidade} peças`;
}

function CartaoLookBase({ look, onPress, aoSalvar, salvo = false }: Props) {
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

      {aoSalvar ? (
        <Pressable
          onPress={() => aoSalvar(look)}
          accessibilityRole="button"
          accessibilityState={{ selected: salvo }}
          accessibilityLabel={salvo ? 'Remover dos salvos' : 'Salvar look'}
          testID={`salvar-cartao-${look.id}`}
          // Area de toque generosa: o coracao fica sobre a foto, e alvo
          // pequeno em cima de outro botao gera toque errado.
          hitSlop={8}
          style={estilos.coracao}
        >
          <Texto variante="titulo" tom={salvo ? 'destaque' : 'principal'}>
            {salvo ? '♥' : '♡'}
          </Texto>
        </Pressable>
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
