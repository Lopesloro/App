// Guarda a tabela de pontos e as faixas da nota 03-score-de-qualidade.md.
// Se alguém mudar um peso aqui sem atualizar o vault (ou vice-versa), este
// teste é o alarme.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcularScore, CORTE_IA, CRITERIOS, detectar, faixaDoScore, SCORE_MAXIMO } from './score.ts';

test('tabela de pontos bate com a nota 03 do vault', () => {
  assert.equal(CRITERIOS.site_nao_abre.pontos, 30);
  assert.equal(CRITERIOS.extremamente_lento.pontos, 20);
  assert.equal(CRITERIOS.nao_responsivo.pontos, 20);
  assert.equal(CRITERIOS.layout_ruim_celular.pontos, 20);
  assert.equal(CRITERIOS.design_antigo.pontos, 15);
  assert.equal(CRITERIOS.parece_abandonado.pontos, 15);
  assert.equal(CRITERIOS.https_problematico.pontos, 10);
  assert.equal(CRITERIOS.botoes_quebrados.pontos, 10);
  assert.equal(CRITERIOS.sem_cta.pontos, 10);
});

test('faixas de decisão nos limites exatos', () => {
  assert.equal(faixaDoScore(0), 'ignorar');
  assert.equal(faixaDoScore(30), 'ignorar');
  assert.equal(faixaDoScore(31), 'talvez');
  assert.equal(faixaDoScore(60), 'talvez');
  assert.equal(faixaDoScore(61), 'prospectar');
  assert.equal(faixaDoScore(80), 'prospectar');
  assert.equal(faixaDoScore(81), 'prioridade_maxima');
  assert.equal(faixaDoScore(100), 'prioridade_maxima');
});

test('corte de IA é o início da faixa prospectar', () => {
  assert.equal(CORTE_IA, 61);
  assert.equal(faixaDoScore(CORTE_IA), 'prospectar');
  assert.equal(faixaDoScore(CORTE_IA - 1), 'talvez');
});

test('score soma as detecções e trava em 100', () => {
  assert.equal(calcularScore([]), 0);
  assert.equal(calcularScore([detectar('sem_cta', 'x'), detectar('design_antigo', 'y')]), 25);
  const todas = (Object.keys(CRITERIOS) as (keyof typeof CRITERIOS)[]).map((id) => detectar(id, 'e'));
  assert.equal(calcularScore(todas), SCORE_MAXIMO);
});
