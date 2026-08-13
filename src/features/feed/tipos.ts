import { z } from 'zod';

import { categoriaSchema as categoriaPecaSchema, corSchema as corPecaSchema } from '@/features/closet/tipos';
import { idSeguroSchema, urlSeguraSchema } from '@/lib/schemas-comuns';

export { idSeguroSchema, urlSeguraSchema };

/**
 * Tipos do feed de indicacoes — o coracao do produto.
 *
 * Os schemas zod sao a fronteira de confianca: tudo que vem da API passa por
 * `looksPaginaSchema.parse()` antes de virar estado do app. Assim um campo
 * inesperado ou faltando vira erro claro no lugar de tela quebrada.
 */

export const OCASIOES = [
  'trabalho',
  'casual',
  'festa',
  'encontro',
  'academia',
  'praia',
] as const;

export const ocasiaoSchema = z.enum(OCASIOES);
export type Ocasiao = z.infer<typeof ocasiaoSchema>;

export const ESTILOS = [
  'classico',
  'moderno',
  'romantico',
  'esportivo',
  'boho',
] as const;

export const estiloSchema = z.enum(ESTILOS);
export type Estilo = z.infer<typeof estiloSchema>;

/** Uma peca que compoe o look. */
export const pecaSchema = z.object({
  id: idSeguroSchema,
  nome: z.string().min(1),
  /** Tipo da peca — define como ela e desenhada e onde entra no look. */
  categoria: categoriaPecaSchema,
  cor: corPecaSchema,
  /** Tamanho sugerido para o look. */
  tamanho: z.string().min(1).max(10),
});

export type Peca = z.infer<typeof pecaSchema>;

export const lookSchema = z.object({
  id: idSeguroSchema,
  titulo: z.string().min(1),
  ocasiao: ocasiaoSchema,
  estilo: estiloSchema,
  /**
   * URL da foto. Fica nula ate a curadoria publicar a imagem (issue #22);
   * nesse meio tempo o cartao mostra so o blurhash.
   */
  fotoUrl: urlSeguraSchema.nullable(),
  /** Previa borrada da foto, para o card nao "pular" ao carregar. */
  blurhash: z.string().min(1),
  pecas: z.array(pecaSchema),
  /** Marcado quando a imagem foi gerada por IA — exigencia de transparencia. */
  geradoPorIa: z.boolean(),
});

export type Look = z.infer<typeof lookSchema>;

export const looksPaginaSchema = z.object({
  looks: z.array(lookSchema),
  /** Cursor da proxima pagina; nulo quando acabou. */
  proximoCursor: z.number().int().nonnegative().nullable(),
  total: z.number().int().nonnegative(),
});

export type LooksPagina = z.infer<typeof looksPaginaSchema>;

/**
 * Resumo das pecas do look, em texto.
 *
 * Substituiu a soma de precos: nada e vendido no app por enquanto (nao ha
 * contrato com loja), entao mostrar valor daria a entender que da para
 * comprar. Aqui a informacao util e o que compoe o look.
 */
export function resumoPecas(look: Look): string {
  const total = look.pecas.length;
  return total === 1 ? '1 peça' : `${total} peças`;
}

/** Tamanhos presentes no look, sem repetir. Ex.: "M · 38 · 37". */
export function tamanhosDoLook(look: Look): string {
  return [...new Set(look.pecas.map((p) => p.tamanho))].join(' · ');
}
