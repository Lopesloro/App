import { z } from 'zod';

import {
  CAIMENTOS,
  CATEGORIAS,
  ESTACOES,
  ESTILOS,
  OCASIOES,
  type Caimento,
  type Categoria,
} from '@/features/estilo/vocabulario';

/**
 * Um TIPO de roupa — "camisa social", "calça wide leg" —, nao um produto de
 * loja.
 *
 * A diferenca decide o produto inteiro. Produto tem marca, preco, estoque e
 * link de compra: exige contrato com varejista, catalogo que envelhece em
 * semanas e uma tela que so serve para vender. Tipo de roupa e vocabulario de
 * moda: nao tem dono, nao vence, e serve para a usuaria descrever o proprio
 * guarda-roupa.
 *
 * Como nada esta a venda nesta versao (`MONETIZACAO_ATIVA`), o catalogo de
 * tipos e o que faz o app funcionar sozinho, sem depender de parceiro nenhum.
 * Quando o comercio voltar, cada tipo vira a chave que liga o guarda-roupa da
 * usuaria aos produtos de verdade — sem refazer nada disto.
 */

export const idRoupaSchema = z
  .string()
  .min(1)
  .max(64)
  // Mesmo criterio de id seguro do feed: o id vai para rota e para chave de
  // armazenamento, entao nao pode conter barra, ponto nem query.
  .regex(/^[a-z0-9-]+$/, 'Identificador de roupa fora do padrao');

export const tipoRoupaSchema = z.object({
  id: idRoupaSchema,
  nome: z.string().min(1),
  categoria: z.enum(CATEGORIAS),
  /**
   * Como a peca tambem e chamada por aí. E o que faz a busca funcionar para
   * gente de verdade: quem procura "blusinha" ou "camisete" nao deveria
   * receber lista vazia so porque o catalogo escolheu outro nome.
   */
  sinonimos: z.array(z.string().min(1)),
  /** Um tipo raramente e de um estilo so — uma camiseta e classica e minimalista. */
  estilos: z.array(z.enum(ESTILOS)).min(1),
  ocasioes: z.array(z.enum(OCASIOES)).min(1),
  estacoes: z.array(z.enum(ESTACOES)).min(1),
  caimento: z.enum(CAIMENTOS),
  /** Frase curta em linguagem de gente, mostrada no cartao. */
  descricao: z.string().min(1),
});

export type TipoRoupa = z.infer<typeof tipoRoupaSchema>;

export const catalogoSchema = z.array(tipoRoupaSchema);

/**
 * Cor de fundo do cartao, derivada do id.
 *
 * Nao ha foto de peca nesta versao — fotografar catalogo exige curadoria
 * (issue #22), e inventar URL de imagem criaria dependencia de servico
 * externo que quebra sem aviso. Ate la cada peca ganha um tom estavel: a
 * mesma peca tem sempre a mesma cor, entao a usuaria reconhece a lista pela
 * forma, e nao por um cinza igual em tudo.
 */
export function matizDaRoupa(id: string): number {
  let soma = 0;
  for (let i = 0; i < id.length; i++) {
    soma = (soma * 31 + id.charCodeAt(i)) % 360;
  }
  return soma;
}

/** Agrupa por categoria, na ordem em que o corpo é vestido. */
export function agruparPorCategoria(
  roupas: readonly TipoRoupa[],
): { categoria: Categoria; roupas: TipoRoupa[] }[] {
  const grupos = new Map<Categoria, TipoRoupa[]>();

  for (const roupa of roupas) {
    const atual = grupos.get(roupa.categoria);
    if (atual) atual.push(roupa);
    else grupos.set(roupa.categoria, [roupa]);
  }

  return CATEGORIAS.filter((categoria) => grupos.has(categoria)).map((categoria) => ({
    categoria,
    roupas: grupos.get(categoria) as TipoRoupa[],
  }));
}

/** "1 peça" / "3 peças" — plural correto importa num app de moda. */
export function descreverQuantidade(quantidade: number): string {
  return quantidade === 1 ? '1 peça' : `${quantidade} peças`;
}

export type { Caimento, Categoria };
