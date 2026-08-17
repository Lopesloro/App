// CLI do analisador.
//
//   npm run analisar -- <url> [--nome "Empresa"] [--sem-nota] [--json]
//   npm run lote -- <arquivo.txt>          (uma URL por linha; # comenta)
//
// Saída: resumo no terminal + nota Obsidian por lead em prospeccao-sites/leads/.

import { readFileSync } from 'node:fs';
import { analisarSite } from './analisador.ts';
import { salvarNotaLead } from './relatorio.ts';
import { ROTULO_FAIXA } from './score.ts';
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

const [, , comando, ...resto] = process.argv;
if (comando === 'analisar') {
  await comandoAnalisar(resto);
} else if (comando === 'lote') {
  await comandoLote(resto);
} else {
  console.error('Comandos: analisar <url> | lote <arquivo.txt>');
  process.exitCode = 2;
}
