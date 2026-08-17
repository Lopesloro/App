// Orquestra a cascata de verificações baratas (nota 03 do vault):
//   site responde? → HTML baixa? → checks de HTML → links quebrados → score.
// Nenhuma chamada de IA acontece aqui — o campo `usarIA` apenas marca quem
// PASSOU do corte e merece análise cara na etapa seguinte.

import type { Analise, Deteccao, OpcoesAnalise } from './tipos.ts';
import { calcularScore, CORTE_IA, detectar, faixaDoScore } from './score.ts';
import { analisarHtml, extrairLinksInternos } from './checks.ts';
import { atribuirVariante } from './estilo.ts';

const PADROES: Required<OpcoesAnalise> = {
  timeoutMs: 12_000,
  limiteLentoMs: 6_000,
  maxLinksVerificados: 5,
  // Identificação honesta: quem olhar o log do servidor entende quem somos.
  userAgent: 'Mozilla/5.0 (compatible; AnaliseDeSites/0.1; analise educada de presença digital)',
};

interface RespostaSite {
  resposta?: Response;
  html?: string;
  tempoMs: number;
  erro?: string;
}

async function buscar(url: string, opcoes: Required<OpcoesAnalise>, comCorpo: boolean): Promise<RespostaSite> {
  const inicio = Date.now();
  try {
    const resposta = await fetch(url, {
      method: comCorpo ? 'GET' : 'HEAD',
      redirect: 'follow',
      headers: { 'user-agent': opcoes.userAgent, accept: 'text/html,*/*' },
      signal: AbortSignal.timeout(opcoes.timeoutMs),
    });
    const html = comCorpo && resposta.ok ? await resposta.text() : undefined;
    return { resposta, html, tempoMs: Date.now() - inicio };
  } catch (erro) {
    return { tempoMs: Date.now() - inicio, erro: erro instanceof Error ? erro.message : String(erro) };
  }
}

function normalizarUrl(entrada: string): { https: string; http: string } {
  const semProtocolo = entrada.trim().replace(/^https?:\/\//i, '');
  return { https: `https://${semProtocolo}`, http: `http://${semProtocolo}` };
}

async function checarLinks(html: string, urlFinal: string, opcoes: Required<OpcoesAnalise>): Promise<Deteccao[]> {
  const links = extrairLinksInternos(html, urlFinal, opcoes.maxLinksVerificados);
  const quebrados: string[] = [];
  for (const link of links) {
    const head = await buscar(link, opcoes, false);
    const status = head.resposta?.status ?? 0;
    // HEAD nem sempre é suportado; 405/501 não é link quebrado.
    if (status === 404 || status === 410) quebrados.push(`${new URL(link).pathname} → ${status}`);
  }
  if (quebrados.length === 0) return [];
  return [detectar('botoes_quebrados', `link(s) interno(s) quebrado(s): ${quebrados.join(', ')}`)];
}

export async function analisarSite(
  urlEntrada: string,
  nomeEmpresa?: string,
  opcoesParciais?: OpcoesAnalise,
): Promise<Analise> {
  const opcoes = { ...PADROES, ...opcoesParciais };
  const { https, http } = normalizarUrl(urlEntrada);
  const dominio = new URL(https).hostname;
  const deteccoes: Deteccao[] = [];
  let erro: string | undefined;

  // 1. O site responde? Primeiro https; se a conexão falhar, tenta http.
  let tentativa = await buscar(https, opcoes, true);
  if (tentativa.erro) {
    const porHttp = await buscar(http, opcoes, true);
    if (!porHttp.erro && porHttp.resposta) {
      deteccoes.push(detectar('https_problematico', `https falhou (${tentativa.erro}); site só responde por http`));
      tentativa = porHttp;
    }
  }

  const resposta = tentativa.resposta;
  const urlFinal = resposta?.url;

  if (!resposta || tentativa.erro) {
    deteccoes.push(detectar('site_nao_abre', `sem resposta: ${tentativa.erro ?? 'erro desconhecido'}`));
    erro = tentativa.erro;
  } else if (resposta.status >= 400) {
    deteccoes.push(detectar('site_nao_abre', `página inicial respondeu HTTP ${resposta.status}`));
  } else {
    // 2. Site respondeu — https sem redirect?
    if (urlFinal?.startsWith('http://')) {
      const jaTem = deteccoes.some((d) => d.criterio === 'https_problematico');
      if (!jaTem) deteccoes.push(detectar('https_problematico', 'site servido em http, sem redirecionar para https'));
    }
    // 3. Extremamente lento?
    if (tentativa.tempoMs > opcoes.limiteLentoMs) {
      deteccoes.push(detectar('extremamente_lento', `primeira resposta em ${(tentativa.tempoMs / 1000).toFixed(1)}s`));
    }
    // 4. Checks de HTML + amostra de links internos.
    if (tentativa.html && urlFinal) {
      const anoAtual = new Date().getFullYear();
      const doHtml = analisarHtml(tentativa.html, urlFinal, anoAtual).filter(
        (d) => !deteccoes.some((existente) => existente.criterio === d.criterio),
      );
      deteccoes.push(...doHtml);
      deteccoes.push(...(await checarLinks(tentativa.html, urlFinal, opcoes)));
    }
  }

  const score = calcularScore(deteccoes);
  const faixa = faixaDoScore(score);
  const usarIA = score >= CORTE_IA;

  return {
    url: urlEntrada,
    urlFinal,
    dominio,
    nomeEmpresa,
    analisadoEm: new Date().toISOString(),
    tempoRespostaMs: tentativa.tempoMs,
    statusHttp: resposta?.status,
    deteccoes,
    score,
    faixa,
    usarIA,
    // Variante visual reservada desde já para quem pode virar demo — garante
    // que dois leads próximos não saiam da mesma base (nota 13 do vault).
    varianteDesign: score > 30 ? atribuirVariante(dominio) : undefined,
    erro,
  };
}
