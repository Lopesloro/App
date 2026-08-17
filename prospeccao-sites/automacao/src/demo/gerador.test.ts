// O gerador é o produto que o cliente vê. Estes testes garantem que:
// 1) toda variante gera uma demo que passa 100% no QA automático;
// 2) as variantes são de fato DIFERENTES entre si (não a mesma base);
// 3) o QA reprova página quebrada (senão ele não protege nada).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarDados, PRESETS } from './dados.ts';
import { escapar, gerarDemo, linkZap } from './gerador.ts';
import { validarDemo } from './qa.ts';
import { carregarVariantes } from '../estilo.ts';

const DADOS = montarDados({
  nomeEmpresa: 'Clínica Sorriso',
  segmento: 'clinica',
  cidade: 'São Paulo',
  whatsapp: '5511999999999',
  dominio: 'clinicasorriso.com.br',
  endereco: 'Rua das Flores, 123 — Centro',
});

test('toda variante gera demo aprovada no QA', () => {
  for (const variante of carregarVariantes()) {
    const { html } = gerarDemo(DADOS, variante.id);
    const qa = validarDemo(html, DADOS.whatsapp);
    const falhas = qa.itens.filter((i) => !i.ok).map((i) => `${i.id}: ${i.detalhe}`);
    assert.ok(qa.passou, `variante ${variante.id} reprovou no QA → ${falhas.join(' | ')}`);
  }
});

test('variantes produzem páginas realmente diferentes entre si', () => {
  const paginas = carregarVariantes().map((v) => gerarDemo(DADOS, v.id).html);
  for (let a = 0; a < paginas.length; a++) {
    for (let b = a + 1; b < paginas.length; b++) {
      const cssA = paginas[a].match(/<style>([\s\S]*)<\/style>/)?.[1] ?? '';
      const cssB = paginas[b].match(/<style>([\s\S]*)<\/style>/)?.[1] ?? '';
      assert.notEqual(cssA, cssB, 'duas variantes com o mesmo CSS');
      // Corpo também muda (estrutura de serviços, faixas, selos) — não só o CSS.
      const corpoA = paginas[a].replace(/<style>[\s\S]*<\/style>/, '');
      const corpoB = paginas[b].replace(/<style>[\s\S]*<\/style>/, '');
      assert.notEqual(corpoA, corpoB, 'duas variantes com o mesmo corpo HTML');
    }
  }
});

test('CSS da variante vem DEPOIS do base (senão o base vence na cascata)', () => {
  // Já custou um botão escuro sobre fundo escuro no v06: regras de mesma
  // especificidade são decididas pela ordem, então a variante tem que ser a última.
  const { html } = gerarDemo(DADOS, 'v06-foto-imersiva');
  const css = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
  const posBase = css.indexOf('.zap-flutuante{position:fixed');
  const posVariante = css.indexOf('--fonte-titulo:\'Helvetica Neue\'');
  assert.ok(posBase >= 0 && posVariante >= 0, 'blocos de CSS não encontrados');
  assert.ok(posVariante > posBase, 'CSS da variante precisa vir depois do base');
});

test('sem variante forçada, usa a variante determinística do domínio', () => {
  const { variante } = gerarDemo(DADOS);
  const repetida = gerarDemo(DADOS);
  assert.equal(variante.id, repetida.variante.id);
});

test('link de WhatsApp leva o número e mensagem pré-preenchida', () => {
  const link = linkZap(DADOS);
  assert.ok(link.startsWith('https://wa.me/5511999999999?text='));
  assert.ok(decodeURIComponent(link).includes('Clínica Sorriso'));
});

test('dados da empresa são escapados (nome malicioso não injeta HTML)', () => {
  const dados = montarDados({
    nomeEmpresa: 'Empresa <script>alert(1)</script>',
    whatsapp: '5511888888888',
  });
  const { html } = gerarDemo(dados, 'v01-minimal-claro');
  assert.ok(!html.includes('<script>alert(1)</script>'));
  assert.ok(html.includes('&lt;script&gt;'));
});

test('escapar cobre os caracteres perigosos', () => {
  assert.equal(escapar('<a href="x">&</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
});

test('QA reprova página sem viewport, âncora quebrada e recurso externo', () => {
  const quebrada = '<html><head><title>Página de teste x</title></head><body><a href="#nada">x</a><img src="https://cdn.x.com/a.png"></body></html>';
  const qa = validarDemo(quebrada, '5511999999999');
  assert.equal(qa.passou, false);
  const falhas = new Set(qa.itens.filter((i) => !i.ok).map((i) => i.id));
  assert.ok(falhas.has('viewport'));
  assert.ok(falhas.has('ancoras'));
  assert.ok(falhas.has('autocontida'));
  assert.ok(falhas.has('whatsapp'));
});

test('todos os presets de segmento montam dados completos', () => {
  for (const chave of Object.keys(PRESETS)) {
    const dados = montarDados({ nomeEmpresa: 'Teste', segmento: chave, cidade: 'Campinas', whatsapp: '5519999999999' });
    assert.ok(dados.servicos.length >= 3, chave);
    assert.ok(dados.slogan.length > 5, chave);
    const { html } = gerarDemo(dados, 'v03-vibrante-comercial');
    assert.ok(validarDemo(html, dados.whatsapp).passou, `preset ${chave} reprovou no QA`);
  }
});
