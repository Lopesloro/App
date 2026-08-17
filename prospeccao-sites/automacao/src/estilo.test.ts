// A regra de negócio aqui é uma só: as demos não podem sair todas da mesma
// base. Determinismo por domínio + espalhamento no lote.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { carregarVariantes, distribuirVariantes, escolherVariante, hashFnv1a } from './estilo.ts';

const VARIANTES = carregarVariantes();

test('arquivo de referências tem pelo menos 4 variantes com tokens completos', () => {
  assert.ok(VARIANTES.length >= 4);
  for (const v of VARIANTES) {
    assert.ok(v.id && v.nome && v.descricao);
    assert.ok(v.tokens.paleta && v.tokens.tipografia && v.tokens.layout && v.tokens.tom);
    assert.ok(Array.isArray(v.links));
  }
});

test('mesmo domínio recebe sempre a mesma variante (determinístico)', () => {
  const a = escolherVariante('clinicasorriso.com.br', VARIANTES);
  const b = escolherVariante('clinicasorriso.com.br', VARIANTES);
  const c = escolherVariante('CLINICASORRISO.com.br', VARIANTES);
  assert.equal(a.id, b.id);
  assert.equal(a.id, c.id);
});

test('hash é estável e não-negativo', () => {
  assert.equal(hashFnv1a('abc'), hashFnv1a('abc'));
  assert.notEqual(hashFnv1a('abc'), hashFnv1a('abd'));
  assert.ok(hashFnv1a('qualquer-coisa') >= 0);
});

test('lote pequeno não concentra tudo na mesma base', () => {
  const dominios = Array.from({ length: VARIANTES.length }, (_, i) => `empresa-${i}.com.br`);
  const distribuicao = distribuirVariantes(dominios, VARIANTES);
  const usadas = new Set([...distribuicao.values()].map((v) => v.id));
  // Com N domínios e N variantes, todas as variantes são usadas exatamente 1x.
  assert.equal(usadas.size, VARIANTES.length);
});

test('lote grande fica equilibrado entre as variantes', () => {
  const dominios = Array.from({ length: VARIANTES.length * 10 }, (_, i) => `negocio-${i}.com.br`);
  const distribuicao = distribuirVariantes(dominios, VARIANTES);
  const contagem = new Map<string, number>();
  for (const v of distribuicao.values()) contagem.set(v.id, (contagem.get(v.id) ?? 0) + 1);
  for (const total of contagem.values()) {
    assert.ok(Math.abs(total - 10) <= 1, `distribuição desequilibrada: ${[...contagem.entries()]}`);
  }
});
