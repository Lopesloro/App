// Gera a nota Obsidian de cada lead analisado, dentro do vault
// (prospeccao-sites/leads/). Cada lead vira um arquivo .md com frontmatter,
// as detecções com evidência, a variante de design reservada e o checklist
// do funil — continuando o padrão "cada assunto vira nota" do projeto.

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { Analise } from './tipos.ts';
import { CORTE_IA, CRITERIOS, ROTULO_FAIXA } from './score.ts';

const AQUI = dirname(fileURLToPath(import.meta.url));
export const PASTA_LEADS = join(AQUI, '..', '..', 'leads');

const EMOJI_FAIXA: Record<Analise['faixa'], string> = {
  ignorar: '⚪',
  talvez: '🟡',
  prospectar: '🟢',
  prioridade_maxima: '🔴',
};

export function nomeArquivoLead(analise: Analise): string {
  return `${analise.dominio.replace(/^www\./, '').replace(/[^a-z0-9.-]/gi, '_')}.md`;
}

export function gerarNotaLead(analise: Analise): string {
  const data = analise.analisadoEm.slice(0, 10);
  const linhasDeteccao =
    analise.deteccoes.length > 0
      ? analise.deteccoes
          // Evidência entre crases: pode conter HTML (ex.: <meta …>) que o
          // Obsidian renderizaria em vez de mostrar como texto.
          .map((d) => `| ${CRITERIOS[d.criterio].descricao} | +${d.pontos} | \`${d.evidencia.replaceAll('`', "'")}\` |`)
          .join('\n')
      : '| — | 0 | nenhum problema objetivo detectado pelos checks baratos |';

  const variante = analise.varianteDesign;
  const blocoVariante = variante
    ? [
        '## Variante de design reservada',
        '',
        `**${variante.variante.nome}** (\`${variante.variante.id}\`) — ${variante.variante.descricao}`,
        '',
        `- Paleta: ${variante.variante.tokens.paleta}`,
        `- Tipografia: ${variante.variante.tokens.tipografia}`,
        `- Layout: ${variante.variante.tokens.layout}`,
        `- Tom: ${variante.variante.tokens.tom}`,
        variante.aguardandoLinks
          ? '\n> [!warning] Aguardando links de referência\n> Esta variante ainda não tem links em `automacao/referencias/referencias-design.json` — adicionar antes de gerar a demo (ver [[13-referencias-de-design]]).'
          : `\n- Referências: ${variante.variante.links.join(' · ')}`,
      ].join('\n')
    : '';

  return `---
title: "Lead: ${analise.nomeEmpresa ?? analise.dominio}"
date: ${data}
tags:
  - prospeccao-sites
  - lead
  - faixa/${analise.faixa}
tipo: lead
status: analisado
score: ${analise.score}
url: "${analise.urlFinal ?? analise.url}"
---

# ${EMOJI_FAIXA[analise.faixa]} ${analise.nomeEmpresa ?? analise.dominio} — score ${analise.score}

| Campo | Valor |
|---|---|
| URL analisada | ${analise.urlFinal ?? analise.url} |
| Data da análise | ${data} |
| Resposta HTTP | ${analise.statusHttp ?? '—'} em ${analise.tempoRespostaMs ?? '—'} ms |
| **Score** | **${analise.score}/100** |
| Faixa | ${EMOJI_FAIXA[analise.faixa]} **${ROTULO_FAIXA[analise.faixa]}** |
| Libera análise por IA (corte ${CORTE_IA}) | ${analise.usarIA ? '✅ Sim' : '❌ Não'} |
${analise.erro ? `| Erro de acesso | ${analise.erro} |\n` : ''}
## Problemas detectados (checks baratos, sem IA)

| Critério | Pontos | Evidência |
|---|---|---|
${linhasDeteccao}

Critérios e faixas: [[03-score-de-qualidade]].
${blocoVariante ? `\n${blocoVariante}\n` : ''}
## Funil deste lead

- [${analise.score > 0 ? 'x' : ' '}] Análise automática executada
- [ ] Revisão humana da análise (evidências fazem sentido?)
- [ ] Mensagem 1 enviada (roteiro em [[04-conversas-whatsapp]])
- [ ] Responsável confirmado
- [ ] Problemas apresentados
- [ ] Demonstração autorizada
- [ ] Demo gerada e testada ([[05-producao-claude-code]])
- [ ] Link enviado
- [ ] Cliente aprovou → **eu entro** + entrada de 10% ([[07-cobranca-e-niveis]])
`;
}

export function salvarNotaLead(analise: Analise, pasta: string = PASTA_LEADS): string {
  mkdirSync(pasta, { recursive: true });
  const caminho = join(pasta, nomeArquivoLead(analise));
  writeFileSync(caminho, gerarNotaLead(analise), 'utf8');
  return caminho;
}
