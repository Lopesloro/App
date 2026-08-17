// Integração com o wpp-server que já existe (BACKUP-PC-ANTIGO/wpp-server):
// wppconnect + express, campanhas isoladas por CAMPANHA=<nome>.
//
// Contrato do motor (lido do código dele, não inventado):
//  - leads-<campanha>.csv   → fila de envio; colunas fixas abaixo
//  - config-<campanha>.json → janela, limite diário, intervalo anti-ban
//  - oferta-<campanha>.json → textos (saudação determinística + pitch)
//  - state-<campanha>.json  → estado por lead (escrito pelo motor)
//  - HTTP: GET /status, GET /qr.png, POST /send, GET /leads, GET /test
//
// Nosso papel aqui: transformar leads analisados no CSV que ele consome.

import type { Analise } from '../tipos.ts';

/** Colunas exatas do leads.csv do motor — a ordem importa. */
export const COLUNAS_CSV = [
  'ID',
  'NOME',
  'WHATSAPP',
  'NICHO',
  'CATEGORIA',
  'CIDADE',
  'PAIS',
  'NOTA',
  'AVALIACOES',
  'STATUS',
  'DATA_ENVIO',
  'NUMERO_USADO',
  'MENSAGEM_ENVIADA',
] as const;

export interface LeadColetado {
  nome: string;
  /** Só dígitos, com DDI. */
  whatsapp: string;
  categoria?: string;
  cidade?: string;
  pais?: string;
  nota?: number | string;
  avaliacoes?: number | string;
  site?: string;
}

export interface LeadExportado extends LeadColetado {
  analise?: Analise;
}

function escaparCampo(valor: string): string {
  const texto = String(valor ?? '');
  return /[",\n]/.test(texto) ? `"${texto.replaceAll('"', '""')}"` : texto;
}

export function normalizarWhatsapp(entrada: string, ddiPadrao = '55'): string | undefined {
  let so = String(entrada ?? '').replace(/\D/g, '');
  if (!so) return undefined;
  // Número brasileiro sem DDI (10 ou 11 dígitos) recebe o 55.
  if (so.length === 10 || so.length === 11) so = ddiPadrao + so;
  if (so.length < 12 || so.length > 15) return undefined;
  return so;
}

/**
 * Gera o CSV que o wpp-server consome. Só entram leads com WhatsApp válido —
 * o motor pula linha sem WHATSAPP, então filtrar aqui evita fila suja.
 * Ordena por score (pior site primeiro): a fila ataca quem mais precisa.
 */
export function gerarCsvLeads(leads: LeadExportado[], nicho = 'Sites desatualizados'): string {
  const validos = leads
    .map((lead) => ({ lead, whatsapp: normalizarWhatsapp(lead.whatsapp) }))
    .filter((l): l is { lead: LeadExportado; whatsapp: string } => l.whatsapp !== undefined)
    .sort((a, b) => (b.lead.analise?.score ?? 0) - (a.lead.analise?.score ?? 0));

  const linhas = validos.map(({ lead, whatsapp }, i) =>
    [
      String(i + 1),
      lead.nome,
      whatsapp,
      nicho,
      lead.categoria ?? '',
      lead.cidade ?? '',
      lead.pais ?? 'BR',
      String(lead.nota ?? ''),
      String(lead.avaliacoes ?? ''),
      'Pendente',
      '',
      '',
      '',
    ]
      .map(escaparCampo)
      .join(','),
  );

  return [COLUNAS_CSV.join(','), ...linhas].join('\n') + '\n';
}

/** Quantos leads foram descartados por não ter WhatsApp aproveitável. */
export function contarDescartados(leads: LeadExportado[]): number {
  return leads.filter((l) => normalizarWhatsapp(l.whatsapp) === undefined).length;
}

export interface StatusMotor {
  status: string;
  tick?: string;
}

/** Consulta o motor rodando (na máquina do fundador). */
export async function consultarStatus(base = 'http://127.0.0.1:21468'): Promise<StatusMotor> {
  const resposta = await fetch(`${base}/status`, { signal: AbortSignal.timeout(8000) });
  if (!resposta.ok) throw new Error(`motor respondeu HTTP ${resposta.status}`);
  return (await resposta.json()) as StatusMotor;
}

/** Envia uma mensagem avulsa pelo motor (usado para o link da demo). */
export async function enviarPeloMotor(
  numero: string,
  mensagem: string,
  base = 'http://127.0.0.1:21468',
): Promise<unknown> {
  const whatsapp = normalizarWhatsapp(numero);
  if (!whatsapp) throw new Error(`número inválido: ${numero}`);
  const resposta = await fetch(`${base}/send`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ to: whatsapp, message: mensagem }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!resposta.ok) throw new Error(`envio falhou: HTTP ${resposta.status}`);
  return resposta.json();
}
