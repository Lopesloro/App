import type { Look, Peca } from './tipos';

/**
 * Montagem do link de compra com rastreio de afiliado (issue #27).
 *
 * Cada toque em "ver na loja" precisa ser atribuivel: sem isso nao da para
 * saber qual look gera venda, e a comissao some. O rastreio vai na URL como
 * parametros UTM, o padrao que as lojas parceiras ja entendem.
 *
 * REGRA DE PRIVACIDADE (docs/06-seguranca.md): nenhum dado pessoal entra na
 * URL. Sem id de usuaria, sem e-mail, sem localizacao — a loja parceira e
 * terceiro, e URL vaza em log, histórico e referrer.
 */

export const ORIGEM_AFILIADO = 'montalooks';

export type ParametrosRastreio = {
  /** De onde partiu o toque (ex.: 'detalhe-look'). */
  origemInterna: string;
};

/**
 * Devolve a URL final da loja, ou null quando a peca nao esta a venda.
 * Preserva os parametros que a loja ja tenha na URL.
 */
export function montarUrlCompra(
  peca: Peca,
  look: Look,
  { origemInterna }: ParametrosRastreio,
): string | null {
  if (!peca.urlLoja) return null;

  let url: URL;
  try {
    url = new URL(peca.urlLoja);
  } catch {
    // URL malformada vinda do catalogo: melhor nao abrir nada do que abrir
    // um endereco quebrado ou inesperado.
    return null;
  }

  // Só http(s). Bloqueia esquemas como javascript: ou intent:, que poderiam
  // vir de um catalogo comprometido e executar acao no aparelho.
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  url.searchParams.set('utm_source', ORIGEM_AFILIADO);
  url.searchParams.set('utm_medium', 'app');
  url.searchParams.set('utm_campaign', origemInterna);
  // Permite ligar a venda ao look que a gerou, sem identificar a usuaria.
  url.searchParams.set('utm_content', look.id);

  return url.toString();
}

/** Texto de transparencia exigido para link com comissao. */
export const AVISO_COMISSAO =
  'Podemos receber uma comissão pelas compras feitas por estes links. O preço para você é o mesmo.';
