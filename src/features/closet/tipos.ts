import { z } from 'zod';

import { idSeguroSchema } from '@/lib/schemas-comuns';

/**
 * Tipos do closet — as pecas que a usuaria tem em casa.
 *
 * Existem duas origens possiveis:
 *  - `foto`: ela fotografou a propria roupa
 *  - `catalogo`: ela escolheu de uma lista pronta, sem precisar fotografar
 *
 * A segunda existe porque fotografar 30 pecas e trabalho demais para a
 * primeira sessao. Ver docs/features/06-meu-closet/o-que-e.md.
 */

export const CATEGORIAS = [
  'blusa',
  'camisa',
  'camiseta',
  'vestido',
  'saia',
  'calca',
  'short',
  'jaqueta',
  'casaco',
  'blazer',
  'macacao',
  'sapato',
  'bolsa',
  'acessorio',
] as const;

export const categoriaSchema = z.enum(CATEGORIAS);
export type Categoria = z.infer<typeof categoriaSchema>;

/** Onde a peca entra num look. Define os espacos do montador. */
export const PARTES = ['cima', 'baixo', 'corpo-inteiro', 'pes', 'complemento'] as const;
export const parteSchema = z.enum(PARTES);
export type Parte = z.infer<typeof parteSchema>;

export const PARTE_DA_CATEGORIA: Record<Categoria, Parte> = {
  blusa: 'cima',
  camisa: 'cima',
  camiseta: 'cima',
  blazer: 'cima',
  jaqueta: 'cima',
  casaco: 'cima',
  saia: 'baixo',
  calca: 'baixo',
  short: 'baixo',
  vestido: 'corpo-inteiro',
  macacao: 'corpo-inteiro',
  sapato: 'pes',
  bolsa: 'complemento',
  acessorio: 'complemento',
};

/**
 * Tamanhos. Cada tipo de peca usa uma escala diferente — numero de manequim
 * para roupa, numeracao propria para calcado. Guardamos como texto para
 * caber "P", "38" e "Unico" no mesmo campo.
 */
export const TAMANHOS_ROUPA = ['PP', 'P', 'M', 'G', 'GG', 'XG'] as const;
export const TAMANHOS_NUMERICOS = ['36', '38', '40', '42', '44', '46', '48'] as const;
export const TAMANHOS_CALCADO = ['33', '34', '35', '36', '37', '38', '39', '40', '41'] as const;
export const TAMANHO_UNICO = 'Único';

export function tamanhosDaCategoria(categoria: Categoria): readonly string[] {
  if (categoria === 'sapato') return TAMANHOS_CALCADO;
  if (categoria === 'bolsa' || categoria === 'acessorio') return [TAMANHO_UNICO];
  if (categoria === 'calca' || categoria === 'saia' || categoria === 'short') {
    return TAMANHOS_NUMERICOS;
  }
  return TAMANHOS_ROUPA;
}

export const CORES_PECA = [
  'preto',
  'branco',
  'bege',
  'cinza',
  'azul',
  'vermelho',
  'rosa',
  'verde',
  'amarelo',
  'marrom',
  'estampado',
] as const;

export const corSchema = z.enum(CORES_PECA);
export type CorPeca = z.infer<typeof corSchema>;

export const pecaClosetSchema = z.object({
  id: idSeguroSchema,
  nome: z.string().min(1).max(60),
  categoria: categoriaSchema,
  cor: corSchema,
  tamanho: z.string().min(1).max(10),
  /**
   * Origem da peca. `foto` guarda o caminho local da imagem no aparelho —
   * NUNCA um endereco publico. `catalogo` usa a ilustracao do item.
   */
  origem: z.union([
    z.object({ tipo: z.literal('foto'), caminhoLocal: z.string().min(1) }),
    z.object({ tipo: z.literal('catalogo'), idCatalogo: idSeguroSchema }),
  ]),
  adicionadaEm: z.string(),
});

export type PecaCloset = z.infer<typeof pecaClosetSchema>;

export function parteDaPeca(peca: PecaCloset): Parte {
  return PARTE_DA_CATEGORIA[peca.categoria];
}

export const ROTULO_CATEGORIA: Record<Categoria, string> = {
  blusa: 'Blusa',
  camisa: 'Camisa',
  camiseta: 'Camiseta',
  vestido: 'Vestido',
  saia: 'Saia',
  calca: 'Calça',
  short: 'Short',
  jaqueta: 'Jaqueta',
  casaco: 'Casaco',
  blazer: 'Blazer',
  macacao: 'Macacão',
  sapato: 'Sapato',
  bolsa: 'Bolsa',
  acessorio: 'Acessório',
};

export const ROTULO_COR: Record<CorPeca, string> = {
  preto: 'Preto',
  branco: 'Branco',
  bege: 'Bege',
  cinza: 'Cinza',
  azul: 'Azul',
  vermelho: 'Vermelho',
  rosa: 'Rosa',
  verde: 'Verde',
  amarelo: 'Amarelo',
  marrom: 'Marrom',
  estampado: 'Estampado',
};

/** Cor de exibicao de cada cor nomeada, para a ilustracao da peca. */
export const HEX_DA_COR: Record<CorPeca, string> = {
  preto: '#2B2B2B',
  branco: '#F4F2EF',
  bege: '#D9C7AE',
  cinza: '#9A9A9A',
  azul: '#4A6FA5',
  vermelho: '#A83A3A',
  rosa: '#D89BAB',
  verde: '#5A7355',
  amarelo: '#D9B44A',
  marrom: '#7A5A42',
  estampado: '#C08B7A',
};
