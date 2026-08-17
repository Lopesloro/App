import { test } from 'node:test';
import assert from 'node:assert/strict';
import { avancar, deveResponder, ehFinal, podeExtrairSiteAntigo } from './conversa.ts';

test('automação responde em qualquer estado, menos depois do veredito', () => {
  assert.equal(deveResponder('novo'), true);
  assert.equal(deveResponder('aguardando_resposta'), true);
  assert.equal(deveResponder('conversando'), true);
  assert.equal(deveResponder('quer_ver'), true);
  assert.equal(deveResponder('demo_enviada'), true);
  assert.equal(deveResponder('gostou'), false);
  assert.equal(deveResponder('nao_gostou'), false);
});

test('extração do site antigo só depois do "quero ver"', () => {
  assert.equal(podeExtrairSiteAntigo('novo'), false);
  assert.equal(podeExtrairSiteAntigo('aguardando_resposta'), false);
  assert.equal(podeExtrairSiteAntigo('conversando'), false);
  assert.equal(podeExtrairSiteAntigo('quer_ver'), true);
  assert.equal(podeExtrairSiteAntigo('demo_enviada'), true);
});

test('aceite leva para quer_ver e libera a extração', () => {
  const t = avancar('conversando', 'Pode mandar sim, quero ver');
  assert.equal(t.estado, 'quer_ver');
  assert.equal(podeExtrairSiteAntigo(t.estado), true);
});

test('resposta neutra mantém a conversa andando', () => {
  const t = avancar('aguardando_resposta', 'quem é?');
  assert.equal(t.estado, 'conversando');
  assert.equal(t.chamarFundador, false);
});

test('veredito positivo só conta depois da demo enviada', () => {
  // Antes da demo, "gostei" é simpatia — não encerra.
  assert.notEqual(avancar('conversando', 'gostei da ideia').estado, 'gostou');
  const t = avancar('demo_enviada', 'Gostei, ficou muito bom! Quanto fica?');
  assert.equal(t.estado, 'gostou');
  assert.equal(t.chamarFundador, true);
  assert.equal(deveResponder(t.estado), false);
});

test('veredito negativo encerra e chama o fundador', () => {
  const t = avancar('demo_enviada', 'Não gostei, prefiro o atual');
  assert.equal(t.estado, 'nao_gostou');
  assert.equal(t.chamarFundador, true);
});

test('desinteresse antes da demo também encerra', () => {
  const t = avancar('conversando', 'não tenho interesse, obrigado');
  assert.equal(t.estado, 'nao_gostou');
  assert.equal(t.chamarFundador, true);
});

test('estado final nunca volta atrás', () => {
  assert.equal(avancar('gostou', 'qualquer coisa').estado, 'gostou');
  assert.equal(avancar('nao_gostou', 'mudei de ideia').estado, 'nao_gostou');
  assert.equal(ehFinal('gostou'), true);
});
