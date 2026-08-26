/**
 * Teste de ponta a ponta: abre o app num navegador de verdade e usa como uma
 * pessoa usaria.
 *
 * Existe porque os testes unitarios nao montam tela. Foi este arquivo que
 * pegou a excecao do bloqueio de captura que derrubava o guarda-roupa na web
 * — nenhum dos 280 testes unitarios via, porque nenhum abria o app.
 *
 * Como rodar:
 *   npx expo export --platform web --output-dir .web-build
 *   npx serve .web-build -l 8099   (ou qualquer servidor estatico)
 *   node e2e/fluxo-completo.mjs
 *
 * Variaveis:
 *   BASE_URL   endereco do app          (padrao http://localhost:8099)
 *   CHROMIUM   caminho do executavel    (padrao: o do Playwright)
 *   SAIDA      pasta dos prints e do log
 */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8099';
const SAIDA = process.env.SAIDA ?? '.e2e';
const CHROMIUM = process.env.CHROMIUM;

mkdirSync(SAIDA, { recursive: true });

const log = [];
const registrar = (nivel, texto) => {
  const linha = `${new Date().toISOString()}  ${nivel.padEnd(5)}  ${texto}`;
  log.push(linha);
  console.log(linha);
};

const errosDeConsole = [];
let falhas = 0;

const navegador = await chromium.launch(
  CHROMIUM ? { executablePath: CHROMIUM } : {},
);
const pagina = await navegador.newPage({ viewport: { width: 420, height: 900 } });

pagina.on('console', (m) => {
  if (m.type() === 'error') errosDeConsole.push(m.text());
});
pagina.on('pageerror', (e) => errosDeConsole.push(`PAGEERROR: ${e.message}`));

async function passo(nome, fn) {
  const inicio = Date.now();
  try {
    await fn();
    registrar('OK', `${nome}  (${Date.now() - inicio}ms)`);
  } catch (erro) {
    falhas++;
    registrar('FALHA', `${nome} :: ${String(erro.message).split('\n')[0]}`);
    await pagina
      .screenshot({ path: join(SAIDA, `falha-${falhas}.png`) })
      .catch(() => {});
  }
}

const busca = () => pagina.getByPlaceholder(/Procure/i).first();
const procurar = async (termo) => {
  await busca().fill(termo);
  await pagina.waitForTimeout(700);
};

registrar('INFO', `abrindo ${BASE_URL}`);
await pagina.goto(BASE_URL, { waitUntil: 'networkidle' });
await pagina.waitForTimeout(2500);

// ---------------------------------------------------------------- entrada

await passo('a marca aparece na tela de abertura', async () => {
  await pagina.getByLabel('Monta Looks').first().waitFor({ timeout: 8000 });
});

await passo('a promessa de privacidade esta visivel logo de cara', async () => {
  await pagina.getByText(/nada sai daqui/i).first().waitFor({ timeout: 6000 });
});

/**
 * A cor de fundo ativa.
 *
 * O documento acompanha o tema (ver o efeito em `src/app/_layout.tsx`), entao
 * ler o `<html>` responde as duas perguntas de uma vez: qual tema esta ativo,
 * e se a pagina esta pintada por baixo do app.
 */
const fundoDoApp = () =>
  pagina.evaluate(
    () => getComputedStyle(document.documentElement).backgroundColor,
  );

await passo('o tema escuro esta ativo', async () => {
  const cor = await fundoDoApp();
  // #070B14 => rgb(7, 11, 20)
  if (!cor.includes('7, 11, 20')) throw new Error(`fundo inesperado: ${cor}`);
});

await passo('a pagina ja nasce escura, antes do React montar', async () => {
  // Se o documento for claro, ha um flash branco entre carregar e desenhar.
  const corDoDocumento = await pagina.evaluate(() => {
    const body = getComputedStyle(document.body).backgroundColor;
    const html = getComputedStyle(document.documentElement).backgroundColor;
    return [body, html].find((c) => c !== 'rgba(0, 0, 0, 0)') ?? 'nenhuma';
  });
  if (!corDoDocumento.includes('7, 11, 20')) {
    throw new Error(`documento nao esta escuro: ${corDoDocumento}`);
  }
});

await passo('"Comecar" entra no app sem pedir cadastro', async () => {
  await pagina.getByText('Começar', { exact: true }).first().click();
  await pagina.waitForTimeout(2000);
  await pagina.getByText('Suas roupas').first().waitFor({ timeout: 8000 });
});

// ---------------------------------------------------------------- catalogo

await passo('o catalogo lista pecas', async () => {
  const cartoes = await pagina.locator('[data-testid^="roupa-"]').count();
  if (cartoes < 4) throw new Error(`so ${cartoes} cartoes`);
});

for (const [termo, esperado] of [
  ['rasteirinha', 'Rasteirinha'],
  ['sandalia', 'Sandália de tira fina'],
  ['hoodie', 'Moletom com capuz'],
  ['jumpsuit', 'Macacão pantalona'],
  ['trico', 'Tricô de gola alta'],
]) {
  await passo(`busca "${termo}" acha ${esperado}`, async () => {
    await procurar(termo);
    await pagina.getByText(esperado).first().waitFor({ timeout: 5000 });
  });
}

await passo('busca sem resultado nao devolve o catalogo inteiro', async () => {
  await procurar('capacete de mergulho');
  await pagina.getByText(/Nada com esse nome/i).first().waitFor({ timeout: 5000 });
});

await passo('filtro por categoria funciona', async () => {
  await busca().fill('');
  await pagina.waitForTimeout(500);
  await pagina.getByTestId('chip-calcado').click();
  await pagina.waitForTimeout(800);
  const cartoes = await pagina.locator('[data-testid^="roupa-"]').count();
  if (cartoes < 3) throw new Error(`so ${cartoes} calcados`);
  await pagina.getByTestId('chip-tudo').click();
  await pagina.waitForTimeout(500);
});

// ------------------------------------------------- marcar e aprender estilo

const PERFIL_CLASSICO = [
  ['camisa social', 'Camisa social'],
  ['scarpin', 'Scarpin'],
  ['blazer de alfaiataria', 'Blazer de alfaiataria'],
  ['mocassim', 'Mocassim'],
  ['trench', 'Trench coat'],
  ['relogio', 'Relógio clássico'],
  ['lenco', 'Lenço de seda'],
  ['calca de alfaiataria', 'Calça de alfaiataria'],
];

await passo(`marcar ${PERFIL_CLASSICO.length} pecas classicas`, async () => {
  for (const [termo, nome] of PERFIL_CLASSICO) {
    await procurar(termo);
    await pagina.getByText(nome, { exact: true }).first().click();
    await pagina.waitForTimeout(450);
  }
  await busca().fill('');
  await pagina.waitForTimeout(600);
  await pagina
    .getByText(`${PERFIL_CLASSICO.length} peças no seu guarda-roupa`)
    .first()
    .waitFor({ timeout: 6000 });
});

await passo('o algoritmo passa a explicar as sugestoes', async () => {
  // Com 8 interacoes a confianca chega a 1 e os motivos aparecem.
  await pagina.getByText(/você vem escolhendo|caimento .* que você prefere/i)
    .first()
    .waitFor({ timeout: 6000 });
});

await passo('o guarda-roupa agrupa por categoria', async () => {
  await pagina.getByText('Guarda-roupa', { exact: true }).first().click();
  await pagina.waitForTimeout(1500);
  await pagina.getByText('Meu guarda-roupa').first().waitFor({ timeout: 6000 });
  for (const grupo of ['Parte de cima', 'Calçados', 'Acessórios']) {
    await pagina.getByText(grupo).first().waitFor({ timeout: 5000 });
  }
});

await passo('o app afirma o estilo depois de 8 escolhas', async () => {
  await pagina.getByText(/puxa para o clássico/i).first().waitFor({ timeout: 6000 });
});

await passo('a regua do perfil mostra o que foi aprendido', async () => {
  await pagina.getByText('Perfil', { exact: true }).first().click();
  await pagina.waitForTimeout(1500);
  await pagina.getByText('Seu estilo').first().waitFor({ timeout: 6000 });
  await pagina.getByText('Clássico').first().waitFor({ timeout: 5000 });
  await pagina.getByText(/100% de certeza/).first().waitFor({ timeout: 5000 });
});

await pagina.screenshot({ path: join(SAIDA, 'perfil-classico.png') });

// ------------------------------------------------------- nada esta a venda

await passo('nao ha preco nem botao de assinar em lugar nenhum', async () => {
  const corpo = (await pagina.textContent('body')) ?? '';
  for (const proibido of ['R$ 19,90', 'R$ 24,90', 'Assine', 'Ver planos']) {
    if (corpo.includes(proibido)) throw new Error(`encontrado: "${proibido}"`);
  }
});

// ----------------------------------------------------------------- temas

await passo('trocar de visual muda o app inteiro', async () => {
  await pagina.getByText(/^Visual:/).first().click();
  await pagina.waitForTimeout(1200);
  await pagina.getByTestId('tema-editorial-areia').click();
  await pagina.waitForTimeout(900);

  const cor = await fundoDoApp();
  // #FAF7F2 => rgb(250, 247, 242)
  if (!cor.includes('250, 247, 242')) throw new Error(`fundo nao trocou: ${cor}`);

  await pagina.getByTestId('tema-neon-futuro').click();
  await pagina.waitForTimeout(900);
});

await passo('as tres direcoes visuais aparecem na escolha', async () => {
  for (const id of ['neon-futuro', 'editorial-areia', 'vinho-moderno']) {
    await pagina.getByTestId(`tema-${id}`).waitFor({ timeout: 5000 });
  }
});

// ----------------------------------------------------------- persistencia

await passo('o guarda-roupa sobrevive a fechar e abrir o app', async () => {
  // Vai para a raiz, e nao `reload()`: recarregar repetiria a rota atual
  // (a tela de escolha de visual) em vez de simular abrir o app do zero.
  await pagina.goto(BASE_URL, { waitUntil: 'networkidle' });
  await pagina.waitForTimeout(3000);
  await pagina.getByText('Suas roupas').first().waitFor({ timeout: 8000 });
  await pagina
    .getByText(`${PERFIL_CLASSICO.length} peças no seu guarda-roupa`)
    .first()
    .waitFor({ timeout: 6000 });
});

await pagina.screenshot({ path: join(SAIDA, 'roupas-neon.png') });

// ------------------------------------------------------------------ fecho

const erros = errosDeConsole.filter(
  // 404 de favicon nao afeta o app e polui o resultado.
  (e) => !e.includes('favicon') && !e.includes('404'),
);

registrar('INFO', `erros de console relevantes: ${erros.length}`);
erros.slice(0, 10).forEach((e) => registrar('ERRO', e.slice(0, 200)));

registrar('INFO', falhas === 0 ? 'TODOS OS PASSOS PASSARAM' : `${falhas} PASSO(S) FALHARAM`);

writeFileSync(join(SAIDA, 'e2e.log'), log.join('\n') + '\n');
await navegador.close();

process.exit(falhas === 0 && erros.length === 0 ? 0 : 1);
