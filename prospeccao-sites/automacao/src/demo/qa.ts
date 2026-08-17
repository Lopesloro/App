// QA automático da demo — o checklist da nota 05 em código.
// Nenhum link sai para cliente sem passar 100% aqui.

export interface ItemQa {
  id: string;
  rotulo: string;
  ok: boolean;
  detalhe: string;
}

export interface ResultadoQa {
  passou: boolean;
  itens: ItemQa[];
}

const LIMITE_TAMANHO_KB = 150;

export function validarDemo(html: string, whatsappEsperado: string): ResultadoQa {
  const itens: ItemQa[] = [];
  const check = (id: string, rotulo: string, ok: boolean, detalhe: string) =>
    itens.push({ id, rotulo, ok, detalhe });

  // Mobile
  check(
    'viewport',
    'Mobile funciona (viewport)',
    /<meta name="viewport" content="width=device-width[^"]*"/.test(html),
    'meta viewport com width=device-width',
  );

  // WhatsApp abre — todo link wa.me aponta para o número certo, com texto pré-preenchido.
  const linksZap = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)].map((m) => m[1]);
  const zapCorreto = linksZap.length > 0 && linksZap.every((l) => l.includes(`wa.me/${whatsappEsperado}?`));
  check(
    'whatsapp',
    'WhatsApp abre',
    zapCorreto,
    linksZap.length > 0
      ? `${linksZap.length} link(s) wa.me, todos para ${whatsappEsperado}`
      : 'nenhum link wa.me encontrado',
  );

  // Telefone funciona
  const linksTel = [...html.matchAll(/href="tel:\+?(\d+)"/g)].map((m) => m[1]);
  check(
    'telefone',
    'Telefone funciona',
    linksTel.length > 0 && linksTel.every((t) => t === whatsappEsperado),
    linksTel.length > 0 ? `tel:+${linksTel[0]}` : 'nenhum link tel: encontrado',
  );

  // Menu/links funcionam — toda âncora interna aponta para um id existente.
  const ancoras = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  const quebradas = ancoras.filter((a) => !ids.has(a));
  check(
    'ancoras',
    'Menu e links internos funcionam',
    quebradas.length === 0,
    quebradas.length === 0 ? `${ancoras.length} âncora(s), todas resolvem` : `âncora(s) sem destino: #${quebradas.join(', #')}`,
  );

  // Imagens carregam — nenhum recurso externo (a demo é 100% autocontida).
  const recursosExternos = [
    ...html.matchAll(/<(?:img|script|link|iframe)[^>]+(?:src|href)="(https?:\/\/[^"]+)"/g),
  ].map((m) => m[1]);
  check(
    'autocontida',
    'Imagens carregam (página autocontida, sem dependência externa)',
    recursosExternos.length === 0,
    recursosExternos.length === 0 ? 'nenhum recurso externo' : `externos: ${recursosExternos.slice(0, 3).join(', ')}`,
  );

  // Acessibilidade básica
  const imgsSemAlt = [...html.matchAll(/<img(?![^>]*\balt=)[^>]*>/g)].length;
  check('alt', 'Imagens com texto alternativo', imgsSemAlt === 0, imgsSemAlt === 0 ? 'ok' : `${imgsSemAlt} <img> sem alt`);
  check('lang', 'Idioma declarado', /<html[^>]+lang="pt-BR"/.test(html), 'html lang="pt-BR"');

  // SEO básico
  check('titulo', 'Título da página', /<title>[^<]{10,}<\/title>/.test(html), '<title> com conteúdo');
  check(
    'descricao',
    'Meta description',
    /<meta name="description" content="[^"]{30,}"/.test(html),
    'meta description com conteúdo',
  );

  // Página não possui erros óbvios de montagem
  const placeholders = /undefined|null|\[object Object\]|NaN(?![a-z])/i.test(html.replace(/NaN[a-z]/g, ''));
  check('montagem', 'Página sem erros de montagem', !placeholders, placeholders ? 'texto suspeito no HTML' : 'sem restos de template');

  // Peso — demo tem que abrir rápido no celular do cliente.
  const kb = Buffer.byteLength(html, 'utf8') / 1024;
  check('peso', 'Página leve', kb <= LIMITE_TAMANHO_KB, `${kb.toFixed(0)} KB (limite ${LIMITE_TAMANHO_KB} KB)`);

  // Honestidade — a demo se identifica como demonstração.
  check(
    'aviso_demo',
    'Aviso de demonstração presente',
    /demonstra/i.test(html),
    'rodapé identifica a página como versão demonstrativa',
  );

  return { passou: itens.every((i) => i.ok), itens };
}

export function formatarQa(resultado: ResultadoQa): string {
  const linhas = resultado.itens.map((i) => ` ${i.ok ? '✅' : '❌'} ${i.rotulo} — ${i.detalhe}`);
  linhas.push(resultado.passou ? ' → QA APROVADO: pode enviar o link' : ' → QA REPROVADO: NÃO enviar o link');
  return linhas.join('\n');
}
