// Capturas de tela das demos geradas (QA visual).
// Usa o Chromium local via playwright-core — sem baixar navegador.
//
//   npm run capturas            → varre saida/demos/*/index.html
//   CHROMIUM_PATH=/caminho npm run capturas   (se o Chromium não for achado)

import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright-core';

const PASTA_DEMOS = resolve('saida', 'demos');
const PASTA_CAPTURAS = resolve('saida', 'capturas');

const CANDIDATOS_CHROMIUM = [
  process.env.CHROMIUM_PATH,
  '/opt/pw-browsers/chromium',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
].filter((c): c is string => Boolean(c));

function acharChromium(): string | undefined {
  for (const caminho of CANDIDATOS_CHROMIUM) {
    if (existsSync(caminho)) return caminho;
  }
  return undefined;
}

const executablePath = acharChromium();
if (!executablePath) {
  console.error('Chromium não encontrado. Defina CHROMIUM_PATH=/caminho/para/chromium');
  process.exit(1);
}

if (!existsSync(PASTA_DEMOS)) {
  console.error(`Nenhuma demo em ${PASTA_DEMOS} — gere com: npm run demo -- --nome "Empresa" --todas`);
  process.exit(1);
}

const demos = readdirSync(PASTA_DEMOS, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(PASTA_DEMOS, d.name, 'index.html')))
  .map((d) => d.name);

if (demos.length === 0) {
  console.error('Nenhum index.html encontrado nas pastas de demo.');
  process.exit(1);
}

mkdirSync(PASTA_CAPTURAS, { recursive: true });
const navegador = await chromium.launch({ executablePath });

for (const demo of demos) {
  const url = `file://${join(PASTA_DEMOS, demo, 'index.html')}`;

  // Celular primeiro — é onde o cliente vai abrir (nota 05 do vault).
  const celular = await navegador.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await celular.goto(url);
  // Elementos fixos (botão/barra de WhatsApp) aparecem no meio da captura de
  // página inteira — artefato do fullPage, não do site. Escondemos só aqui.
  await celular.addStyleTag({ content: '.zap-flutuante,.barra-zap{display:none!important}body{padding-bottom:0!important}' });
  await celular.screenshot({ path: join(PASTA_CAPTURAS, `${demo}-mobile.png`), fullPage: true });
  await celular.close();

  const desktop = await navegador.newPage({ viewport: { width: 1280, height: 800 } });
  await desktop.goto(url);
  await desktop.screenshot({ path: join(PASTA_CAPTURAS, `${demo}-desktop.png`) });
  await desktop.close();

  console.log(`📸 ${demo} → mobile (página inteira) + desktop`);
}

await navegador.close();
console.log(`\nCapturas em ${PASTA_CAPTURAS}`);
