// Monta a demo completa (um index.html autocontido, pronto para GitHub Pages)
// a partir dos dados da empresa + variante de design do lead.
// Regras: mobile primeiro, zero dependência externa, zero JavaScript,
// botões reais (wa.me / tel:), aviso de demonstração no rodapé.

import type { DadosDemo } from './dados.ts';
import type { VarianteDesign } from '../tipos.ts';
import { carregarVariantes, escolherVariante } from '../estilo.ts';
import { CSS_BASE, CSS_VARIANTES } from './estilos.ts';

type EstiloServicos = 'lista' | 'numerado' | 'cartoes' | 'blocos' | 'minimal';

interface Receita {
  estiloServicos: EstiloServicos;
  /** Decoração posicionada (absoluta) — entra ANTES do container do hero. */
  heroExtra?: (dados: DadosDemo) => string;
  /** Decoração no fluxo — entra DEPOIS do conteúdo do hero. */
  heroFim?: (dados: DadosDemo) => string;
  antesDoTopo?: string;
  depoisDoConteudo?: (dados: DadosDemo) => string;
  seloHero?: (dados: DadosDemo) => string;
}

export function escapar(texto: string): string {
  return texto
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const ICONES = [
  '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m12 2 2.9 6.3 6.6.7-5 4.6 1.4 6.6L12 16.9 6.1 20.2 7.5 13.6l-5-4.6 6.6-.7z"/></svg>',
  '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
];

const SVG_ZAP =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.7-1.3 1.3-1.8 1.3-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5l-.4.6c-.1.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1.1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3 0 .2 0 .8-.1 1.4z"/></svg>';

const ARCO_V01 =
  '<svg class="arco-hero" viewBox="0 0 520 90" fill="none" aria-hidden="true"><path d="M10 80 Q260 -40 510 80" stroke="#0e7568" stroke-width="2" opacity=".5"/><circle cx="260" cy="21" r="5" fill="#0e7568"/></svg>';

const ORNAMENTO_V02 =
  '<svg class="ornamento-v02" width="360" height="360" viewBox="0 0 360 360" fill="none" aria-hidden="true"><circle cx="180" cy="180" r="176" stroke="#c9a227" opacity=".28" stroke-width="1"/><circle cx="180" cy="180" r="130" stroke="#c9a227" opacity=".2" stroke-width="1"/><circle cx="180" cy="180" r="84" stroke="#c9a227" opacity=".14" stroke-width="1"/></svg>';

const BLOB_V03 =
  '<svg class="blob-hero" viewBox="0 0 480 480" fill="none" aria-hidden="true"><path fill="#fdeacc" d="M240 30c86 0 196 52 196 158 0 118-96 226-208 226C118 414 44 322 44 216 44 104 140 30 240 30z"/><path fill="#fbd9a8" opacity=".7" d="M280 110c56 0 118 40 118 108 0 76-64 150-140 150-72 0-118-62-118-130 0-74 68-128 140-128z"/></svg>';

const BOLHAS_V05 =
  '<svg class="bolhas" width="280" height="240" viewBox="0 0 280 240" fill="none" aria-hidden="true"><circle cx="200" cy="80" r="70" fill="#ffffff" opacity=".55"/><circle cx="90" cy="180" r="46" fill="#ffffff" opacity=".4"/><circle cx="250" cy="200" r="30" fill="#ffffff" opacity=".5"/></svg>';

const RECEITAS: Record<string, Receita> = {
  'v01-minimal-claro': {
    estiloServicos: 'lista',
    seloHero: (d) => `<span class="selo">${escapar(d.segmento)} · ${escapar(d.cidade)}</span>`,
    heroFim: () => ARCO_V01,
  },
  'v02-premium-escuro': {
    estiloServicos: 'numerado',
    seloHero: () => '<div class="filete" aria-hidden="true"></div>',
    heroExtra: () => ORNAMENTO_V02,
  },
  'v03-vibrante-comercial': {
    estiloServicos: 'cartoes',
    antesDoTopo: '<div class="faixa-urgencia">Atendimento rápido pelo WhatsApp — respondemos hoje</div>',
    seloHero: () => '<span class="selo">Aberto para novos clientes</span>',
    heroExtra: () => BLOB_V03,
    depoisDoConteudo: (d) =>
      `<a class="barra-zap" href="${linkZap(d)}">${SVG_ZAP.replace('<svg ', '<svg width="22" height="22" fill="#fff" ')} Chamar no WhatsApp</a>`,
  },
  'v04-editorial-serifado': {
    estiloServicos: 'numerado',
    seloHero: (d) => `<p class="chapeu">${escapar(d.segmento)} — ${escapar(d.cidade)}</p>`,
  },
  'v05-blocos-coloridos': {
    estiloServicos: 'blocos',
    seloHero: (d) => `<span class="selo">✨ ${escapar(d.segmento)} em ${escapar(d.cidade)}</span>`,
  },
  'v06-foto-imersiva': {
    estiloServicos: 'minimal',
    seloHero: (d) => `<span class="selo">${escapar(d.segmento)} · ${escapar(d.cidade)}</span>`,
  },
};

export function linkZap(dados: DadosDemo): string {
  const texto = encodeURIComponent(`Olá! Vim pelo site da ${dados.nomeEmpresa} e quero mais informações.`);
  return `https://wa.me/${dados.whatsapp}?text=${texto}`;
}

function secaoHero(dados: DadosDemo, receita: Receita): string {
  const dentroCartao = `
      ${receita.seloHero ? receita.seloHero(dados) : ''}
      <h1>${escapar(dados.slogan)}</h1>
      <p class="descricao">${escapar(dados.descricao)}</p>
      <div class="acoes">
        <a class="botao zap" href="${linkZap(dados)}">${SVG_ZAP.replace('<svg ', '<svg width="20" height="20" fill="currentColor" ')} Falar no WhatsApp</a>
        <a class="botao fantasma" href="#servicos">Ver serviços</a>
      </div>`;
  const conteudo =
    receita.estiloServicos === 'blocos'
      ? `<div class="cartao-hero">${dentroCartao}${BOLHAS_V05}</div>`
      : dentroCartao;
  return `
  <section class="hero" aria-label="Apresentação">
    ${receita.heroExtra ? receita.heroExtra(dados) : ''}
    <div class="container">${conteudo}${receita.heroFim ? receita.heroFim(dados) : ''}</div>
  </section>`;
}

function secaoServicos(dados: DadosDemo, receita: Receita): string {
  const itens = dados.servicos
    .map((s, i) => {
      const numero = String(i + 1).padStart(2, '0');
      const icone = `<span class="icone-servico" aria-hidden="true">${ICONES[i % ICONES.length]}</span>`;
      const corpo = `<div><h3>${escapar(s.nome)}</h3><p>${escapar(s.descricao)}</p></div>`;
      switch (receita.estiloServicos) {
        case 'numerado':
          return `<article class="servico"><span class="numero" aria-hidden="true">${numero}</span>${corpo}</article>`;
        case 'cartoes':
        case 'blocos':
          return `<article class="servico">${icone}${corpo}</article>`;
        case 'minimal':
          return `<article class="servico"><span class="numero" aria-hidden="true">${numero}</span>${corpo}</article>`;
        default:
          return `<article class="servico"><h3>${escapar(s.nome)}</h3><p>${escapar(s.descricao)}</p></article>`;
      }
    })
    .join('\n');
  return `
  <section id="servicos" class="servicos">
    <div class="container">
      <p class="rotulo-secao">O que fazemos</p>
      <h2>Serviços pensados para você</h2>
      <p class="intro-secao">Tudo o que a ${escapar(dados.nomeEmpresa)} oferece, explicado sem rodeio — e a um toque do WhatsApp.</p>
      <div class="grade-servicos">${itens}</div>
    </div>
  </section>`;
}

function secaoSobre(dados: DadosDemo): string {
  const anos = dados.anoFundacao ? new Date().getFullYear() - dados.anoFundacao : undefined;
  return `
  <section id="sobre" class="sobre">
    <div class="container">
      <p class="rotulo-secao">Quem somos</p>
      <h2>Por que escolher a ${escapar(dados.nomeEmpresa)}</h2>
      <p class="intro-secao">${escapar(dados.descricao)}</p>
      <div class="metricas">
        ${anos ? `<div class="metrica"><strong>${anos}+</strong><span>anos de experiência</span></div>` : ''}
        <div class="metrica"><strong>100%</strong><span>atendimento humano</span></div>
        <div class="metrica"><strong>1 toque</strong><span>do orçamento pelo WhatsApp</span></div>
      </div>
    </div>
  </section>`;
}

function secaoDepoimentos(dados: DadosDemo): string {
  if (dados.depoimentos.length === 0) return '';
  const itens = dados.depoimentos
    .map((d) => `<blockquote><p>“${escapar(d.texto)}”</p><footer>— ${escapar(d.autor)}</footer></blockquote>`)
    .join('\n');
  return `
  <section class="depoimentos" aria-label="Depoimentos">
    <div class="container">
      <p class="rotulo-secao">Quem já veio</p>
      <h2>O que dizem por aí</h2>
      <div class="grade-depoimentos">${itens}</div>
      <p class="nota-ilustrativa">Depoimentos ilustrativos — na versão final entram avaliações reais dos seus clientes.</p>
    </div>
  </section>`;
}

function secaoContato(dados: DadosDemo): string {
  const telefone = dados.telefoneExibicao ?? `+${dados.whatsapp}`;
  return `
  <section id="contato" class="contato">
    <div class="container">
      <p class="rotulo-secao">Fale com a gente</p>
      <h2>É só chamar</h2>
      <div class="grade-contato">
        <div>
          <p class="intro-secao">Chame no WhatsApp e receba retorno rápido — ou ligue, se preferir. Sem formulário comprido, sem espera.</p>
          <div class="acoes">
            <a class="botao zap" href="${linkZap(dados)}">${SVG_ZAP.replace('<svg ', '<svg width="20" height="20" fill="currentColor" ')} Chamar no WhatsApp</a>
            <a class="botao fantasma" href="tel:+${dados.whatsapp}">Ligar agora</a>
          </div>
        </div>
        <dl class="bloco-contato">
          <dt>Telefone / WhatsApp</dt><dd>${escapar(telefone)}</dd>
          ${dados.endereco ? `<dt>Endereço</dt><dd>${escapar(dados.endereco)}</dd>` : ''}
          <dt>Horário</dt><dd>${escapar(dados.horario ?? 'Consulte pelo WhatsApp')}</dd>
        </dl>
      </div>
    </div>
  </section>`;
}

function jsonLd(dados: DadosDemo): string {
  const objeto = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: dados.nomeEmpresa,
    description: dados.descricao,
    telephone: `+${dados.whatsapp}`,
    address: dados.endereco ? { '@type': 'PostalAddress', streetAddress: dados.endereco, addressLocality: dados.cidade } : undefined,
  };
  // "<" escapado impede que um nome de empresa malicioso feche a tag <script>.
  return `<script type="application/ld+json">${JSON.stringify(objeto).replaceAll('<', '\\u003c')}</script>`;
}

export interface DemoGerada {
  html: string;
  variante: VarianteDesign;
}

export function gerarDemo(dados: DadosDemo, varianteIdForcada?: string): DemoGerada {
  const variantes = carregarVariantes();
  const variante = varianteIdForcada
    ? (variantes.find((v) => v.id === varianteIdForcada) ??
      (() => {
        throw new Error(`Variante desconhecida: ${varianteIdForcada}`);
      })())
    : escolherVariante(dados.dominio, variantes);

  const css = CSS_VARIANTES[variante.id];
  if (!css) throw new Error(`Variante sem modelo implementado: ${variante.id}`);
  const receita = RECEITAS[variante.id];
  if (!receita) throw new Error(`Variante sem receita: ${variante.id}`);

  const titulo = `${dados.nomeEmpresa} — ${dados.segmento} em ${dados.cidade}`;
  const html = `<!doctype html>
<html lang="pt-BR" class="${variante.id.slice(0, 3)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapar(titulo)}</title>
<meta name="description" content="${escapar(dados.descricao)}">
<meta property="og:title" content="${escapar(titulo)}">
<meta property="og:description" content="${escapar(dados.descricao)}">
<meta name="robots" content="noindex">
${jsonLd(dados)}
<style>${CSS_BASE}${css}</style>
</head>
<body>
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
${receita.antesDoTopo ?? ''}
<header class="topo">
  <div class="container">
    <div class="marca">${escapar(dados.nomeEmpresa)}</div>
    <nav class="nav-links" aria-label="Navegação principal">
      <a href="#servicos">Serviços</a>
      <a href="#sobre">Sobre</a>
      <a href="#contato">Contato</a>
    </nav>
    <details class="menu-mobile">
      <summary aria-label="Abrir menu">Menu</summary>
      <div class="menu-itens">
        <a href="#servicos">Serviços</a>
        <a href="#sobre">Sobre</a>
        <a href="#contato">Contato</a>
      </div>
    </details>
    <a class="botao botao-topo" href="${linkZap(dados)}">WhatsApp</a>
  </div>
</header>
<main id="conteudo">
${secaoHero(dados, receita)}
${secaoServicos(dados, receita)}
${secaoSobre(dados)}
${secaoDepoimentos(dados)}
${secaoContato(dados)}
</main>
<footer class="rodape">
  <div class="container">
    <span>© ${new Date().getFullYear()} ${escapar(dados.nomeEmpresa)} · ${escapar(dados.cidade)}</span>
    <span>Versão demonstrativa — preparada para apresentação</span>
  </div>
</footer>
${receita.depoisDoConteudo ? receita.depoisDoConteudo(dados) : `<a class="zap-flutuante" href="${linkZap(dados)}" aria-label="Conversar no WhatsApp">${SVG_ZAP}</a>`}
</body>
</html>`;

  return { html, variante };
}
