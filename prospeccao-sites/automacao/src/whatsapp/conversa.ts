// Estado da conversa de um lead.
//
// Decisão do fundador (17/08/2026): a automação NÃO bloqueia nada e NÃO
// identifica mais nada — nada de classificar "é o responsável?", nada de
// filtrar grupo ou número desconhecido. Ela conversa normalmente e só tem
// UM ponto de parada: quando o lead diz se gostou ou não do site. Aí o
// fundador assume a conversa.

export type Estado =
  | 'novo' // ainda não falamos
  | 'aguardando_resposta' // mandamos a primeira mensagem
  | 'conversando' // respondeu, conversa em andamento
  | 'quer_ver' // aceitou ver a nova versão → LIBERA extração do site antigo
  | 'demo_enviada' // link da demo enviado
  | 'gostou' // 🚦 PARA — fundador assume
  | 'nao_gostou'; // 🚦 PARA — fundador assume

/** Estados terminais: a automação para de responder e o fundador entra. */
export const ESTADOS_FINAIS: readonly Estado[] = ['gostou', 'nao_gostou'];

export function ehFinal(estado: Estado): boolean {
  return ESTADOS_FINAIS.includes(estado);
}

/**
 * Única regra de "responder ou não": a automação responde sempre, até o
 * lead dar o veredito sobre o site. Depois disso, silêncio — é o fundador
 * quem fala.
 */
export function deveResponder(estado: Estado): boolean {
  return !ehFinal(estado);
}

/**
 * A extração do site antigo (fotos, textos, cores, estrutura) só pode
 * acontecer DEPOIS que o lead disser que quer ver a nova versão.
 * Antes disso não se gasta nada.
 */
export function podeExtrairSiteAntigo(estado: Estado): boolean {
  return estado === 'quer_ver' || estado === 'demo_enviada' || ehFinal(estado);
}

const SIM_QUER_VER = [
  'quero ver',
  'pode mostrar',
  'pode mandar',
  'manda',
  'mostra',
  'me mostra',
  'gostaria de ver',
  'pode fazer',
  'quero sim',
  'pode sim',
  'tenho interesse',
  'me interessa',
  'vamos ver',
  'claro',
  'sim',
  'bora',
  'ok',
];

const GOSTOU = [
  'gostei',
  'gostamos',
  'ficou bom',
  'ficou ótimo',
  'ficou otimo',
  'ficou muito bom',
  'ficou lindo',
  'ficou top',
  'adorei',
  'amei',
  'perfeito',
  'excelente',
  'muito bom',
  'quanto fica',
  'quanto custa',
  'qual o valor',
  'quero fechar',
  'vamos fechar',
  'como faz para contratar',
];

const NAO_GOSTOU = [
  'nao gostei',
  'não gostei',
  'nao curti',
  'não curti',
  'nao ficou bom',
  'não ficou bom',
  'prefiro o atual',
  'nao é o que',
  'não é o que',
  'nao serve',
  'não serve',
  'sem interesse',
  'nao tenho interesse',
  'não tenho interesse',
  'obrigado mas nao',
  'obrigado mas não',
];

function contem(texto: string, lista: string[]): boolean {
  const limpo = (texto ?? '').toLowerCase().trim();
  return lista.some((termo) => limpo.includes(termo));
}

export interface Transicao {
  estado: Estado;
  mudou: boolean;
  /** true quando a automação deve parar e avisar o fundador. */
  chamarFundador: boolean;
}

/**
 * Avança o estado a partir da mensagem recebida do lead.
 * O veredito sobre o site (gostou/não gostou) só é considerado depois que a
 * demo foi enviada — antes disso "gostei" é só simpatia, não aprovação.
 */
export function avancar(estadoAtual: Estado, mensagemDoLead: string): Transicao {
  const parado = (estado: Estado, chamarFundador = false): Transicao => ({
    estado,
    mudou: estado !== estadoAtual,
    chamarFundador,
  });

  if (ehFinal(estadoAtual)) return parado(estadoAtual);

  if (estadoAtual === 'demo_enviada') {
    if (contem(mensagemDoLead, NAO_GOSTOU)) return parado('nao_gostou', true);
    if (contem(mensagemDoLead, GOSTOU)) return parado('gostou', true);
    return parado('demo_enviada');
  }

  // Antes da demo: o que importa é descobrir se quer ver a nova versão.
  if (estadoAtual === 'quer_ver') return parado('quer_ver');

  if (contem(mensagemDoLead, NAO_GOSTOU)) return parado('nao_gostou', true);
  if (contem(mensagemDoLead, SIM_QUER_VER)) return parado('quer_ver');

  return parado('conversando');
}
