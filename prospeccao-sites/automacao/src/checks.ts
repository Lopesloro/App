// Checks baratos sobre o HTML já baixado — zero IA, zero dependências.
// Cada função é pura (recebe HTML, devolve detecções) para ser testável.
// Heurísticas: preferimos deixar de pontuar a pontuar errado — falso positivo
// aqui vira mensagem de WhatsApp para a empresa errada.

import type { Deteccao } from './tipos.ts';
import { detectar } from './score.ts';

const SINAIS_DESIGN_ANTIGO: { padrao: RegExp; rotulo: string }[] = [
  { padrao: /<marquee[\s>]/i, rotulo: '<marquee>' },
  { padrao: /<frameset[\s>]/i, rotulo: '<frameset>' },
  { padrao: /<font[\s>]/i, rotulo: '<font>' },
  { padrao: /jquery[/-]1\.\d+/i, rotulo: 'jQuery 1.x' },
  { padrao: /\.swf["']/i, rotulo: 'Flash (.swf)' },
  { padrao: /content=["'][^"']*(FrontPage|Dreamweaver)[^"']*["']/i, rotulo: 'gerador FrontPage/Dreamweaver' },
  { padrao: /content=["']WordPress [234]\./i, rotulo: 'WordPress 2–4' },
  { padrao: /<table[^>]+bgcolor=/i, rotulo: 'tabela com bgcolor' },
];

const PALAVRAS_CTA =
  /(fale conosco|entre em contato|solicite|orçamento|orcamento|agende|agendar|whatsapp|ligue|contato)/i;

export function checarViewport(html: string): Deteccao[] {
  const temViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  if (temViewport) return [];
  return [detectar('nao_responsivo', 'sem <meta name="viewport"> — página não se adapta ao celular')];
}

export function checarLayoutMobile(html: string): Deteccao[] {
  const evidencias: string[] = [];
  const larguraFixaTabela = html.match(/<(?:table|td)[^>]+width=["']?(\d{3,})/i);
  if (larguraFixaTabela && Number(larguraFixaTabela[1]) > 500) {
    evidencias.push(`tabela com largura fixa de ${larguraFixaTabela[1]}px`);
  }
  const larguraFixaCss = html.match(/min-width:\s*(\d{3,})px/i);
  if (larguraFixaCss && Number(larguraFixaCss[1]) > 700) {
    evidencias.push(`CSS com min-width de ${larguraFixaCss[1]}px`);
  }
  if (/<frameset[\s>]/i.test(html)) {
    evidencias.push('usa frameset (não funciona bem em celular)');
  }
  if (evidencias.length === 0) return [];
  return [detectar('layout_ruim_celular', evidencias.join('; '))];
}

export function checarDesignAntigo(html: string): Deteccao[] {
  const encontrados = SINAIS_DESIGN_ANTIGO.filter((s) => s.padrao.test(html)).map((s) => s.rotulo);
  if (encontrados.length === 0) return [];
  return [detectar('design_antigo', `sinais: ${encontrados.join(', ')}`)];
}

export function checarAbandono(html: string, anoAtual: number): Deteccao[] {
  // Ano de copyright no rodapé: © 2019, (c) 2017, "Copyright 2015" etc.
  const padroes = html.match(/(?:©|&copy;|\(c\)|copyright)[^\d]{0,20}((?:19|20)\d{2})/gi) ?? [];
  let maiorAno = 0;
  for (const trecho of padroes) {
    const ano = Number(trecho.match(/(?:19|20)\d{2}/)?.[0] ?? 0);
    if (ano > maiorAno && ano <= anoAtual) maiorAno = ano;
  }
  if (maiorAno > 0 && anoAtual - maiorAno >= 3) {
    return [detectar('parece_abandonado', `copyright parado em ${maiorAno} (${anoAtual - maiorAno} anos atrás)`)];
  }
  return [];
}

export function checarCta(html: string): Deteccao[] {
  const temWhatsApp = /(wa\.me|api\.whatsapp\.com|whatsapp:)/i.test(html);
  const temTelefone = /href=["']tel:/i.test(html);
  const temEmail = /href=["']mailto:/i.test(html);
  const temPalavraCta = PALAVRAS_CTA.test(html);
  if (temWhatsApp || temTelefone || temEmail || temPalavraCta) return [];
  return [
    detectar(
      'sem_cta',
      'nenhum caminho de contato encontrado (sem link de WhatsApp, tel:, mailto: nem chamada de contato no texto)',
    ),
  ];
}

export function checarConteudoMisto(html: string, urlFinal: string): Deteccao[] {
  if (!urlFinal.startsWith('https://')) return [];
  const recursosHttp = html.match(/(?:src|href)=["']http:\/\/[^"']+\.(?:js|css|png|jpe?g|gif|webp)/gi) ?? [];
  if (recursosHttp.length === 0) return [];
  return [
    detectar(
      'https_problematico',
      `página https carrega ${recursosHttp.length} recurso(s) por http (conteúdo misto — navegador bloqueia ou marca como inseguro)`,
    ),
  ];
}

export function extrairLinksInternos(html: string, urlFinal: string, maximo: number): string[] {
  const base = new URL(urlFinal);
  const links = new Set<string>();
  for (const m of html.matchAll(/<a[^>]+href=["']([^"'#][^"']*)["']/gi)) {
    try {
      const url = new URL(m[1], base);
      if (url.origin !== base.origin) continue;
      if (!/^https?:$/.test(url.protocol)) continue;
      if (/\.(pdf|jpe?g|png|gif|zip|docx?)$/i.test(url.pathname)) continue;
      url.hash = '';
      if (url.href === base.href) continue;
      links.add(url.href);
      if (links.size >= maximo) break;
    } catch {
      // href inválido não interessa
    }
  }
  return [...links];
}

export function analisarHtml(html: string, urlFinal: string, anoAtual: number): Deteccao[] {
  return [
    ...checarViewport(html),
    ...checarLayoutMobile(html),
    ...checarDesignAntigo(html),
    ...checarAbandono(html, anoAtual),
    ...checarCta(html),
    ...checarConteudoMisto(html, urlFinal),
  ];
}
