// CLI da automação.
//
//   npm run analisar -- <url> [--nome "Empresa"] [--sem-nota] [--json]
//   npm run lote -- <arquivo.txt>          (uma URL por linha; # comenta)
//   npm run demo -- --nome "Empresa" [--segmento clinica] [--cidade "São Paulo"]
//                   [--whatsapp 5511999999999] [--dominio x.com.br]
//                   [--variante v02-premium-escuro] [--todas]
//
// Saída: resumo no terminal + nota Obsidian por lead em prospeccao-sites/leads/;
// demos em saida/demos/<slug>/index.html (aprovadas no QA, prontas p/ Pages).

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { analisarSite } from './analisador.ts';
import { salvarNotaLead } from './relatorio.ts';
import { ROTULO_FAIXA } from './score.ts';
import { montarDados } from './demo/dados.ts';
import { gerarDemo } from './demo/gerador.ts';
import { formatarQa, validarDemo } from './demo/qa.ts';
import { carregarVariantes } from './estilo.ts';
import type { Analise } from './tipos.ts';

function resumo(analise: Analise): string {
  const problemas =
    analise.deteccoes.length > 0 ? analise.deteccoes.map((d) => d.criterio).join(', ') : 'nenhum problema objetivo';
  const variante = analise.varianteDesign
    ? ` | design: ${analise.varianteDesign.variante.id}${analise.varianteDesign.aguardandoLinks ? ' (sem links ainda)' : ''}`
    : '';
  return `${analise.dominio} → score ${String(analise.score).padStart(3)} [${ROTULO_FAIXA[analise.faixa]}] ${analise.usarIA ? '→ IA' : ''} (${problemas})${variante}`;
}

async function comandoAnalisar(args: string[]): Promise<void> {
  const url = args.find((a) => !a.startsWith('--'));
  if (!url) {
    console.error('Uso: npm run analisar -- <url> [--nome "Empresa"] [--sem-nota] [--json]');
    process.exitCode = 2;
    return;
  }
  const idxNome = args.indexOf('--nome');
  const nome = idxNome >= 0 ? args[idxNome + 1] : undefined;

  const analise = await analisarSite(url, nome);

  if (args.includes('--json')) {
    console.log(JSON.stringify(analise, null, 2));
  } else {
    console.log(resumo(analise));
    for (const d of analise.deteccoes) console.log(`  +${d.pontos} ${d.criterio}: ${d.evidencia}`);
  }
  if (!args.includes('--sem-nota')) {
    const caminho = salvarNotaLead(analise);
    console.log(`nota: ${caminho}`);
  }
}

async function comandoLote(args: string[]): Promise<void> {
  const arquivo = args.find((a) => !a.startsWith('--'));
  if (!arquivo) {
    console.error('Uso: npm run lote -- <arquivo.txt>  (uma URL por linha; # comenta)');
    process.exitCode = 2;
    return;
  }
  const urls = readFileSync(arquivo, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '' && !l.startsWith('#'));

  console.log(`Analisando ${urls.length} site(s), um por vez…\n`);
  const analises: Analise[] = [];
  for (const url of urls) {
    const analise = await analisarSite(url);
    analises.push(analise);
    console.log(resumo(analise));
    if (!args.includes('--sem-nota')) salvarNotaLead(analise);
  }

  const porFaixa = new Map<string, number>();
  for (const a of analises) porFaixa.set(a.faixa, (porFaixa.get(a.faixa) ?? 0) + 1);
  console.log('\nResumo do lote:');
  for (const [faixa, total] of porFaixa) console.log(`  ${faixa}: ${total}`);
  console.log(`  → liberados para IA: ${analises.filter((a) => a.usarIA).length}/${analises.length}`);
}

function valorFlag(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

function comandoDemo(args: string[]): void {
  const nome = valorFlag(args, '--nome');
  if (!nome) {
    console.error('Uso: npm run demo -- --nome "Empresa" [--segmento clinica] [--cidade "São Paulo"] [--whatsapp 55...] [--dominio x.com.br] [--variante vNN] [--todas]');
    process.exitCode = 2;
    return;
  }
  const dados = montarDados({
    nomeEmpresa: nome,
    segmento: valorFlag(args, '--segmento'),
    cidade: valorFlag(args, '--cidade'),
    whatsapp: valorFlag(args, '--whatsapp'),
    dominio: valorFlag(args, '--dominio'),
    endereco: valorFlag(args, '--endereco'),
    telefoneExibicao: valorFlag(args, '--telefone'),
  });

  const ids = args.includes('--todas')
    ? carregarVariantes().map((v) => v.id)
    : [valorFlag(args, '--variante')].filter((v): v is string => v !== undefined);

  const slugBase = dados.dominio.replace(/[^a-z0-9.-]/gi, '_');
  let reprovadas = 0;
  const alvos = ids.length > 0 ? ids : [undefined];
  for (const id of alvos) {
    const { html, variante } = gerarDemo(dados, id);
    const qa = validarDemo(html, dados.whatsapp);
    const pasta = join('saida', 'demos', alvos.length > 1 ? `${slugBase}-${variante.id}` : slugBase);
    mkdirSync(pasta, { recursive: true });
    writeFileSync(join(pasta, 'index.html'), html, 'utf8');
    console.log(`\n${variante.nome} (${variante.id}) → ${join(pasta, 'index.html')}`);
    console.log(formatarQa(qa));
    if (!qa.passou) reprovadas++;
  }
  if (reprovadas > 0) process.exitCode = 1;
}

const [, , comando, ...resto] = process.argv;
if (comando === 'analisar') {
  await comandoAnalisar(resto);
} else if (comando === 'lote') {
  await comandoLote(resto);
} else if (comando === 'demo') {
  comandoDemo(resto);
} else {
  console.error('Comandos: analisar <url> | lote <arquivo.txt> | demo --nome "Empresa"');
  process.exitCode = 2;
}
