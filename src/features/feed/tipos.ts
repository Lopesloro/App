import { z } from 'zod';

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

/** Uma peca que compoe o look, com link de compra (pilar 3). */
export const pecaSchema = z.object({
  id: z.string(),
  nome: z.string().min(1),
  marca: z.string().min(1),
  precoCentavos: z.number().int().nonnegative(),
  /** Link de afiliado. Vazio quando a peca nao esta a venda. */
  urlLoja: z.string().url().nullable(),
});

export type Peca = z.infer<typeof pecaSchema>;

export const lookSchema = z.object({
  id: z.string(),
  titulo: z.string().min(1),
  ocasiao: ocasiaoSchema,
  estilo: estiloSchema,
  /**
   * URL da foto. Fica nula ate a curadoria publicar a imagem (issue #22);
   * nesse meio tempo o cartao mostra so o blurhash.
   */
  fotoUrl: z.string().url().nullable(),
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

/** Soma o preco de todas as pecas do look. */
export function precoTotalLook(look: Look): number {
  return look.pecas.reduce((soma, peca) => soma + peca.precoCentavos, 0);
}
