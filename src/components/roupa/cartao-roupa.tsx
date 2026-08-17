import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Texto } from '@/components/ui/texto';
import { ROTULO_CATEGORIA, ROTULO_ESTILO } from '@/features/estilo/vocabulario';
import { matizDaRoupa, type TipoRoupa } from '@/features/roupas/tipos';
import { usePaleta } from '@/theme/tema-store';
import { espaco, raio, type Paleta } from '@/theme/tokens';

type Props = {
  roupa: TipoRoupa;
  /** A peca ja esta no guarda-roupa da usuaria? */
  guardada: boolean;
  onMarcar: (roupa: TipoRoupa) => void;
  /** Frase do algoritmo de estilo, quando houver motivo honesto para dar. */
  motivo?: string | null;
};

/**
 * Cartao de uma peca no catalogo.
 *
 * O cartao inteiro e o botao de marcar. Nao ha tela de detalhe atras dele:
 * a acao que importa aqui e uma so — "isto eu tenho" —, e obrigar a abrir
 * uma tela para cada peca transformaria montar o armario numa tarefa de
 * cinquenta toques.
 *
 * A faixa colorida no topo nao e decoracao: sem foto de peca (issue #11), e o
 * unico jeito de a usuaria distinguir os cartoes de relance ao rolar. A cor
 * sai do id, entao a mesma peca tem sempre o mesmo tom.
 */
function CartaoRoupaBase({ roupa, guardada, onMarcar, motivo }: Props) {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);
  const matiz = matizDaRoupa(roupa.id);

  const estiloPrincipal = ROTULO_ESTILO[roupa.estilos[0]];

  return (
    <Pressable
      onPress={() => onMarcar(roupa)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: guardada }}
      accessibilityLabel={`${roupa.nome}. ${ROTULO_CATEGORIA[roupa.categoria]}, estilo ${estiloPrincipal}.`}
      accessibilityHint={
        guardada ? 'Toque para tirar do seu guarda-roupa' : 'Toque para guardar no seu guarda-roupa'
      }
      testID={`roupa-${roupa.id}`}
      style={({ pressed }) => [
        estilos.cartao,
        guardada ? estilos.cartaoGuardado : null,
        pressed ? estilos.pressionado : null,
      ]}
    >
      <View
        style={[estilos.faixa, { backgroundColor: `hsl(${matiz}, 34%, 86%)` }]}
      >
        <View style={[estilos.marca, guardada ? estilos.marcaAtiva : null]}>
          <Texto variante="titulo" tom={guardada ? 'sobreDestaque' : 'suave'}>
            {guardada ? '✓' : '+'}
          </Texto>
        </View>
      </View>

      <View style={estilos.info}>
        <Texto variante="titulo" numberOfLines={2}>
          {roupa.nome}
        </Texto>
        <Texto variante="legenda" tom="suave">
          {ROTULO_CATEGORIA[roupa.categoria]} · {estiloPrincipal}
        </Texto>

        {motivo ? (
          <Texto variante="legenda" tom="destaque" numberOfLines={2} style={estilos.motivo}>
            {motivo}
          </Texto>
        ) : null}
      </View>
    </Pressable>
  );
}

export const CartaoRoupa = memo(CartaoRoupaBase);

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    cartao: {
      backgroundColor: paleta.surface,
      borderRadius: raio.card,
      borderWidth: 1,
      borderColor: paleta.border,
      overflow: 'hidden',
      flex: 1,
    },
    // Peca ja guardada fica visivelmente diferente: rolando uma lista longa,
    // a usuaria precisa saber onde parou sem ler cada nome.
    cartaoGuardado: { borderColor: paleta.primary, borderWidth: 2 },
    pressionado: { opacity: 0.9 },
    faixa: {
      height: 96,
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      padding: espaco.sm,
    },
    marca: {
      width: 36,
      height: 36,
      borderRadius: raio.chip,
      backgroundColor: paleta.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    marcaAtiva: { backgroundColor: paleta.primary },
    info: { padding: espaco.md, gap: 2 },
    motivo: { marginTop: espaco.xs },
  });
