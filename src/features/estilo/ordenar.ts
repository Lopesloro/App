import type { RoupaEncontrada } from '@/features/roupas/busca';
import type { TipoRoupa } from '@/features/roupas/tipos';
import { afinidade, confianca, explicarAfinidade, type PerfilEstilo } from './perfil-estilo';

/**
 * Onde a busca encontra o gosto da usuaria.
 *
 * A regra que decide a ordem final e uma so:
 *
 *     pontuacao = pontuacaoTexto × PESO_TEXTO + ajusteDeEstilo
 *
 * com `|ajusteDeEstilo| ≤ AJUSTE_MAXIMO < PESO_TEXTO`.
 *
 * A desigualdade nao e detalhe: ela garante que **o estilo nunca passa na
 * frente do que a usuaria digitou**. Quem procura "camisa" recebe camisas,
 * ordenadas entre si pelo gosto dela — e nao um vestido boho porque o perfil
 * diz que ela gosta de boho. Buscar e um pedido explicito; perfil e palpite.
 * Palpite desempata, nunca manda.
 *
 * Quando nao ha texto digitado, toda peca empata na pontuacao de texto e o
 * gosto passa a ordenar sozinho — que e exatamente o que se espera de quem
 * esta so folheando o catalogo.
 */

/** Espaco reservado para cada degrau de relevancia de texto. */
export const PESO_TEXTO = 1000;

/** Quanto o estilo pode mexer na ordem. Menor que um degrau de texto. */
export const AJUSTE_MAXIMO = 100;

export type RoupaSugerida = RoupaEncontrada & {
  /** 0 a 1: quanto combina com o perfil. 0,5 = sem opiniao. */
  afinidade: number;
  /** Frase curta em pt-BR, ou null quando nao ha motivo honesto para dar. */
  motivo: string | null;
  pontuacaoFinal: number;
};

/**
 * Ajuste de ordem que o perfil pode aplicar a uma peca.
 * Faixa: -AJUSTE_MAXIMO a +AJUSTE_MAXIMO, encolhido pela confianca.
 */
export function ajusteDeEstilo(perfil: PerfilEstilo, roupa: TipoRoupa): number {
  const distanciaDoNeutro = (afinidade(perfil, roupa) - 0.5) * 2; // -1 a 1
  return confianca(perfil) * distanciaDoNeutro * AJUSTE_MAXIMO;
}

/**
 * Reordena o resultado da busca colocando na frente o que combina com o
 * perfil, sem desrespeitar o que foi digitado.
 */
export function ordenarPorEstilo(
  encontradas: readonly RoupaEncontrada[],
  perfil: PerfilEstilo,
): RoupaSugerida[] {
  return encontradas
    .map((encontrada) => {
      const valor = afinidade(perfil, encontrada.roupa);
      return {
        ...encontrada,
        afinidade: valor,
        motivo: explicarAfinidade(perfil, encontrada.roupa),
        pontuacaoFinal:
          encontrada.pontuacaoTexto * PESO_TEXTO + ajusteDeEstilo(perfil, encontrada.roupa),
      };
    })
    .sort(
      (a, b) =>
        b.pontuacaoFinal - a.pontuacaoFinal ||
        // Empate total (perfil vazio) cai na ordem alfabetica, para a lista
        // nao mudar de posicao entre uma renderizacao e outra.
        a.roupa.nome.localeCompare(b.roupa.nome, 'pt-BR'),
    );
}
