import type { IdPlano } from '@/features/assinatura/planos';
import { MONETIZACAO_ATIVA } from '@/lib/flags';

/**
 * Quantos looks cada plano pode salvar (docs/04-assinaturas-precos.md).
 *
 * Os numeros ficam aqui, num lugar so, porque o app inteiro precisa
 * concordar: a tela de planos promete, o botao de salvar bloqueia e o
 * paywall aparece — tudo com base neste mesmo valor.
 *
 * A tabela continua valendo como decisao de produto mesmo com a monetizacao
 * desligada: e o contrato que volta a valer quando `MONETIZACAO_ATIVA` for
 * `true`. Quem decide o que barra HOJE e `limiteVigente`.
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

/** Limite escrito na tabela de planos, independente de estar valendo. */
export function limiteDoPlano(plano: IdPlano): number {
  return LIMITE_LOOKS_SALVOS[plano];
}

/**
 * Limite que vale nesta versao do app.
 *
 * Sem monetizacao nao existe plano para vender, e cobrar limite de quem nao
 * tem como pagar para sair dele so faz a usuaria perder o que salvou.
 */
export function limiteVigente(plano: IdPlano): number {
  return MONETIZACAO_ATIVA ? limiteDoPlano(plano) : Infinity;
}

export function podeSalvarMais(plano: IdPlano, quantidadeAtual: number): boolean {
  return quantidadeAtual < limiteVigente(plano);
}

/** Quantos ainda cabem. Devolve Infinity quando nao ha limite valendo. */
export function vagasRestantes(plano: IdPlano, quantidadeAtual: number): number {
  return Math.max(0, limiteVigente(plano) - quantidadeAtual);
}

/**
 * Mensagem mostrada quando o limite estoura.
 * Tom: convida a assinar, sem culpar a usuaria (docs/04-assinaturas-precos.md).
 * Vazia quando nao ha limite valendo — nao ha o que convidar a assinar.
 */
export function mensagemLimite(plano: IdPlano): string {
  const limite = limiteVigente(plano);
  if (!Number.isFinite(limite)) return '';
  return `Você chegou aos ${limite} looks salvos do seu plano. Assine para guardar quantos quiser.`;
}
