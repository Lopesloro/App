// REGRA CRÍTICA E INEGOCIÁVEL DO PROJETO:
// A automação SÓ responde para números que ELA MESMA contactou primeiro.
// Nunca responde a qualquer outra pessoa — nem amigo, nem família, nem cliente
// antigo, nem grupo, nem número desconhecido que mandar mensagem.
//
// A conta de WhatsApp pareada é a MESMA usada pessoalmente. Sem esta trava, um
// "oi" da mãe do fundador entraria no funil de prospecção. Por isso a regra é
// implementada como allowlist explícita (só passa quem está registrado como
// lead contactado por nós), e não como blocklist.

export type MotivoBloqueio =
  | 'nao_iniciado_por_nos'
  | 'grupo'
  | 'broadcast'
  | 'numero_invalido'
  | 'lead_encerrado'
  | 'fora_do_funil';

export interface LeadContactado {
  /** Só dígitos, com DDI. Ex.: 5511999999999 */
  telefone: string;
  dominio: string;
  /** Quando NÓS enviamos a primeira mensagem. */
  contactadoEm: string;
  /** Encerrado = não responder mais (pediu para parar, virou cliente, descartado). */
  encerrado?: boolean;
  motivoEncerramento?: string;
}

export interface Decisao {
  podeResponder: boolean;
  motivo?: MotivoBloqueio;
  explicacao: string;
}

/** Identificadores de chat que nunca podem entrar no funil. */
const SUFIXO_GRUPO = '@g.us';
const SUFIXO_BROADCAST = '@broadcast';
const SUFIXO_STATUS = 'status@broadcast';

export function normalizarTelefone(entrada: string): string | undefined {
  const so = (entrada ?? '').replace(/\D/g, '');
  // E.164 sem o "+": entre 10 e 15 dígitos. Fora disso não é telefone válido.
  if (so.length < 10 || so.length > 15) return undefined;
  return so;
}

/**
 * Registro dos leads que NÓS contactamos. É a única fonte de verdade para
 * decidir se a automação pode responder a uma mensagem recebida.
 */
export class RegistroDeContatos {
  readonly #porTelefone = new Map<string, LeadContactado>();

  constructor(leads: LeadContactado[] = []) {
    for (const lead of leads) this.registrarContato(lead);
  }

  /** Registra que NÓS enviamos a primeira mensagem para este número. */
  registrarContato(lead: LeadContactado): void {
    const telefone = normalizarTelefone(lead.telefone);
    if (!telefone) throw new Error(`Telefone inválido no registro: ${lead.telefone}`);
    this.#porTelefone.set(telefone, { ...lead, telefone });
  }

  encerrar(telefone: string, motivo: string): void {
    const chave = normalizarTelefone(telefone);
    const lead = chave ? this.#porTelefone.get(chave) : undefined;
    if (lead) {
      lead.encerrado = true;
      lead.motivoEncerramento = motivo;
    }
  }

  buscar(telefone: string): LeadContactado | undefined {
    const chave = normalizarTelefone(telefone);
    return chave ? this.#porTelefone.get(chave) : undefined;
  }

  get total(): number {
    return this.#porTelefone.size;
  }

  /**
   * A pergunta que governa toda mensagem recebida:
   * "podemos responder a este chat?" — o padrão é NÃO.
   */
  podeResponder(idDoChat: string): Decisao {
    const id = (idDoChat ?? '').trim();

    if (id.endsWith(SUFIXO_GRUPO)) {
      return { podeResponder: false, motivo: 'grupo', explicacao: 'mensagem de grupo — automação nunca responde grupos' };
    }
    if (id === SUFIXO_STATUS || id.endsWith(SUFIXO_BROADCAST)) {
      return { podeResponder: false, motivo: 'broadcast', explicacao: 'status/broadcast — ignorado' };
    }

    // Aceita tanto "5511999999999" quanto "5511999999999@c.us".
    const telefone = normalizarTelefone(id.split('@')[0]);
    if (!telefone) {
      return { podeResponder: false, motivo: 'numero_invalido', explicacao: `identificador não reconhecido: ${idDoChat}` };
    }

    const lead = this.#porTelefone.get(telefone);
    if (!lead) {
      return {
        podeResponder: false,
        motivo: 'nao_iniciado_por_nos',
        explicacao: 'número não está no registro de leads contactados — a automação não inicia nem responde conversa que não começou',
      };
    }
    if (lead.encerrado) {
      return {
        podeResponder: false,
        motivo: 'lead_encerrado',
        explicacao: `lead encerrado (${lead.motivoEncerramento ?? 'sem motivo registrado'}) — não responder`,
      };
    }

    return { podeResponder: true, explicacao: `lead contactado por nós em ${lead.contactadoEm} (${lead.dominio})` };
  }
}

/** Palavras que encerram o contato na hora, sem passar por IA. */
const PEDIDOS_DE_PARADA = [
  'para de mandar',
  'pare de mandar',
  'nao me mande',
  'não me mande',
  'nao quero',
  'não quero',
  'sair da lista',
  'me tira',
  'me remove',
  'descadastrar',
  'spam',
  'nao perturbe',
  'não perturbe',
];

/** Opt-out é obrigatório e vem antes de qualquer outra lógica. */
export function pediuParaParar(texto: string): boolean {
  const limpo = (texto ?? '').toLowerCase().trim();
  return PEDIDOS_DE_PARADA.some((p) => limpo.includes(p));
}
