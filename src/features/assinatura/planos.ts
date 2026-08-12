/**
 * Planos de assinatura — fonte unica de verdade dos precos no app.
 *
 * REGRA DO FUNDADOR (CLAUDE.md): Gratis / R$ 19,90 / R$ 24,90 sao fixos.
 * Alterar exige decisao explicita do fundador. Ha teste de guarda travando
 * estes valores para uma mudanca acidental nao passar em revisao.
 *
 * Os valores ficam em centavos para nao depender de ponto flutuante.
 * A divisao de beneficios por tier vem de docs/04-assinaturas-precos.md.
 */

export type IdPlano = 'gratis' | 'medium' | 'premium';

export type Plano = {
  id: IdPlano;
  nome: string;
  precoCentavos: number;
  precoFormatado: string;
  periodo: string;
  destaque: boolean;
  beneficios: string[];
  /** Identificador do produto nas lojas (RevenueCat, issue #30). */
  sku: string | null;
};

export const PLANOS: readonly Plano[] = [
  {
    id: 'gratis',
    nome: 'Grátis',
    precoCentavos: 0,
    precoFormatado: 'R$ 0',
    periodo: 'com anúncios',
    destaque: false,
    sku: null,
    beneficios: [
      '3 indicações com foto por semana',
      '10 looks salvos e 20 peças no closet',
      'Suas fotos protegidas do mesmo jeito',
    ],
  },
  {
    id: 'medium',
    nome: 'Medium',
    precoCentavos: 1990,
    precoFormatado: 'R$ 19,90',
    periodo: 'por mês',
    destaque: false,
    sku: 'medium_mensal',
    beneficios: [
      '20 indicações com foto por semana',
      '100 looks salvos e 200 peças',
      'Look do dia com o clima da sua cidade',
      'Sem anúncios',
    ],
  },
  {
    id: 'premium',
    nome: 'Premium',
    precoCentavos: 2490,
    precoFormatado: 'R$ 24,90',
    periodo: 'por mês',
    destaque: true,
    sku: 'premium_mensal',
    beneficios: [
      'Indicações, looks e closet ilimitados',
      'Provador virtual 30x por mês',
      'Stylist humana e mala de viagem',
      'Closet privado com criptografia ponta a ponta',
    ],
  },
] as const;

export function buscarPlano(id: IdPlano): Plano {
  const plano = PLANOS.find((p) => p.id === id);
  if (!plano) throw new Error(`Plano desconhecido: ${id}`);
  return plano;
}

/** Formata centavos no padrao brasileiro: 1990 -> "R$ 19,90". */
export function formatarPreco(centavos: number): string {
  return `R$ ${(centavos / 100).toFixed(2).replace('.', ',')}`;
}
