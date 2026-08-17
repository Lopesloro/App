// Testa as heurísticas de HTML com fixtures mínimas — cada check ativa quando
// deve e, tão importante quanto, NÃO ativa quando não deve (falso positivo
// vira mensagem para a empresa errada).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  analisarHtml,
  checarAbandono,
  checarConteudoMisto,
  checarCta,
  checarDesignAntigo,
  checarLayoutMobile,
  checarViewport,
  extrairLinksInternos,
} from './checks.ts';

const ANO = 2026;

const SITE_MODERNO = `<!doctype html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head><body>
<a href="https://wa.me/5511999999999">Fale conosco no WhatsApp</a>
<footer>© 2026 Empresa</footer>
</body></html>`;

const SITE_ANTIGO = `<html><head></head><body>
<table width="960" bgcolor="#cccccc"><tr><td>
<font face="Verdana">Bem-vindo ao nosso site!</font>
<marquee>Promoção!</marquee>
</td></tr></table>
<script src="/js/jquery-1.8.2.min.js"></script>
<div>Copyright 2015 Empresa</div>
</body></html>`;

test('site moderno não ativa nenhum check', () => {
  assert.deepEqual(analisarHtml(SITE_MODERNO, 'https://exemplo.com.br/', ANO), []);
});

test('site antigo ativa os checks esperados', () => {
  const criterios = analisarHtml(SITE_ANTIGO, 'http://exemplo.com.br/', ANO).map((d) => d.criterio);
  assert.ok(criterios.includes('nao_responsivo'));
  assert.ok(criterios.includes('layout_ruim_celular'));
  assert.ok(criterios.includes('design_antigo'));
  assert.ok(criterios.includes('parece_abandonado'));
  assert.ok(criterios.includes('sem_cta'));
});

test('viewport presente/ausente', () => {
  assert.equal(checarViewport(SITE_MODERNO).length, 0);
  assert.equal(checarViewport('<html><body>oi</body></html>').length, 1);
});

test('layout mobile: largura fixa grande ativa, largura pequena não', () => {
  assert.equal(checarLayoutMobile('<table width="960">').length, 1);
  assert.equal(checarLayoutMobile('<table width="300">').length, 0);
  assert.equal(checarLayoutMobile('<div style="min-width: 1200px">').length, 1);
});

test('design antigo lista os sinais na evidência', () => {
  const [d] = checarDesignAntigo(SITE_ANTIGO);
  assert.ok(d.evidencia.includes('jQuery 1.x'));
  assert.ok(d.evidencia.includes('<marquee>'));
});

test('abandono: copyright de 3+ anos atrás ativa; recente não', () => {
  assert.equal(checarAbandono('© 2023 Empresa', ANO).length, 1);
  assert.equal(checarAbandono('© 2024 Empresa', ANO).length, 0);
  assert.equal(checarAbandono('sem copyright', ANO).length, 0);
  // Pega o MAIOR ano quando há vários (footer antigo + ano atualizado).
  assert.equal(checarAbandono('© 2015 … Copyright 2026', ANO).length, 0);
});

test('CTA: wa.me, tel:, mailto: ou palavra de contato satisfazem', () => {
  assert.equal(checarCta('<a href="tel:+5511999999999">ligue</a>').length, 0);
  assert.equal(checarCta('<a href="mailto:a@b.com">e-mail</a>').length, 0);
  assert.equal(checarCta('Solicite um orçamento hoje').length, 0);
  assert.equal(checarCta('<p>somente texto institucional</p>').length, 1);
});

test('conteúdo misto só conta em página https', () => {
  const html = '<img src="http://exemplo.com/foto.jpg">';
  assert.equal(checarConteudoMisto(html, 'https://exemplo.com/').length, 1);
  assert.equal(checarConteudoMisto(html, 'http://exemplo.com/').length, 0);
});

test('extração de links internos ignora externos, âncoras e arquivos', () => {
  const html = `
    <a href="/servicos">Serviços</a>
    <a href="https://exemplo.com/contato">Contato</a>
    <a href="https://outrosite.com/x">Externo</a>
    <a href="#topo">Topo</a>
    <a href="/catalogo.pdf">PDF</a>
    <a href="mailto:a@b.com">Email</a>`;
  const links = extrairLinksInternos(html, 'https://exemplo.com/', 5);
  assert.deepEqual(links.sort(), ['https://exemplo.com/contato', 'https://exemplo.com/servicos'].sort());
});
