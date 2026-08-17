// Esta é a suíte mais importante do projeto: ela protege a conta pessoal do
// fundador. Se um destes testes falhar, a automação NÃO pode rodar.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizarTelefone, pediuParaParar, RegistroDeContatos } from './guardrail.ts';

const LEAD = {
  telefone: '5511999999999',
  dominio: 'clinicaexemplo.com.br',
  contactadoEm: '2026-08-17T10:00:00.000Z',
};

test('responde APENAS para quem nós contactamos primeiro', () => {
  const registro = new RegistroDeContatos([LEAD]);
  assert.equal(registro.podeResponder('5511999999999').podeResponder, true);
  assert.equal(registro.podeResponder('5511999999999@c.us').podeResponder, true);
});

test('NUNCA responde número desconhecido (mãe, amigo, cliente antigo…)', () => {
  const registro = new RegistroDeContatos([LEAD]);
  const decisao = registro.podeResponder('5511888887777');
  assert.equal(decisao.podeResponder, false);
  assert.equal(decisao.motivo, 'nao_iniciado_por_nos');
});

test('registro vazio bloqueia todo mundo (padrão é NÃO responder)', () => {
  const registro = new RegistroDeContatos();
  assert.equal(registro.podeResponder('5511999999999').podeResponder, false);
  assert.equal(registro.podeResponder('5511000000000').podeResponder, false);
});

test('NUNCA responde grupo, status ou broadcast', () => {
  const registro = new RegistroDeContatos([LEAD]);
  assert.equal(registro.podeResponder('120363000000000000@g.us').motivo, 'grupo');
  assert.equal(registro.podeResponder('status@broadcast').motivo, 'broadcast');
  assert.equal(registro.podeResponder('5511999999999@broadcast').motivo, 'broadcast');
});

test('grupo é bloqueado mesmo que o número do lead esteja no id', () => {
  const registro = new RegistroDeContatos([LEAD]);
  const decisao = registro.podeResponder('5511999999999@g.us');
  assert.equal(decisao.podeResponder, false, 'grupo jamais pode passar');
  assert.equal(decisao.motivo, 'grupo');
});

test('lead encerrado deixa de receber resposta', () => {
  const registro = new RegistroDeContatos([LEAD]);
  registro.encerrar('5511999999999', 'pediu para parar');
  const decisao = registro.podeResponder('5511999999999');
  assert.equal(decisao.podeResponder, false);
  assert.equal(decisao.motivo, 'lead_encerrado');
});

test('identificador inválido é bloqueado', () => {
  const registro = new RegistroDeContatos([LEAD]);
  assert.equal(registro.podeResponder('').motivo, 'numero_invalido');
  assert.equal(registro.podeResponder('abc').motivo, 'numero_invalido');
  assert.equal(registro.podeResponder('123').motivo, 'numero_invalido');
});

test('normalização aceita formatos escritos de várias formas', () => {
  assert.equal(normalizarTelefone('+55 (11) 99999-9999'), '5511999999999');
  assert.equal(normalizarTelefone('5511999999999@c.us'.split('@')[0]), '5511999999999');
  assert.equal(normalizarTelefone('123'), undefined);
  assert.equal(normalizarTelefone(''), undefined);
});

test('mesmo número em formatos diferentes é o mesmo lead', () => {
  const registro = new RegistroDeContatos([{ ...LEAD, telefone: '+55 (11) 99999-9999' }]);
  assert.equal(registro.podeResponder('5511999999999').podeResponder, true);
});

test('telefone inválido não entra no registro', () => {
  assert.throws(() => new RegistroDeContatos([{ ...LEAD, telefone: '123' }]));
});

test('pedido de parada é detectado', () => {
  assert.equal(pediuParaParar('Por favor, pare de mandar mensagem'), true);
  assert.equal(pediuParaParar('NÃO QUERO nada disso'), true);
  assert.equal(pediuParaParar('isso é spam'), true);
  assert.equal(pediuParaParar('Sim, sou eu o responsável'), false);
});
