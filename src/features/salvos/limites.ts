import type { IdPlano } from '@/features/assinatura/planos';

/**
 * Quantos looks cada plano pode salvar (docs/04-assinaturas-precos.md).
 *
 * Os numeros ficam aqui, num lugar so, porque o app inteiro precisa
 * concordar: a tela de planos promete, o botao de salvar bloqueia e o
 * paywall aparece — tudo com base neste mesmo valor.
 *
 * ATENCAO: isto e a barreira da INTERFACE, para a usuaria entender o limite.
 * A barreira que vale e a do servidor (issue #32) — cliente nunca pode ser a
 * unica trava, senao basta editar o app para burlar.
 */
export const LIMITE_LOOKS_SALVOS: Record<IdPlano, number> = {
  gratis: 10,
  medium: 100,
  premium: Infinity,
};

export function limiteDoPlano(plano: IdPlano): number {
  return LIMITE_LOOKS_SALVOS[plano];
}

export function podeSalvarMais(plano: IdPlano, quantidadeAtual: number): boolean {
  return quantidadeAtual < limiteDoPlano(plano);
}

/** Quantos ainda cabem. Devolve Infinity no Premium. */
export function vagasRestantes(plano: IdPlano, quantidadeAtual: number): number {
  return Math.max(0, limiteDoPlano(plano) - quantidadeAtual);
}

/**
 * Mensagem mostrada quando o limite estoura.
 * Tom: convida a assinar, sem culpar a usuaria (docs/04-assinaturas-precos.md).
 */
export function mensagemLimite(plano: IdPlano): string {
  if (plano === 'premium') return '';
  const limite = limiteDoPlano(plano);
  return `Você chegou aos ${limite} looks salvos do seu plano. Assine para guardar quantos quiser.`;
}
