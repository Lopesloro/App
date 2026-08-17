import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { publicarComVerificacao, urlDaDemo } from './publicar.ts';

test('URL do Pages é montada no formato certo', () => {
  assert.equal(urlDaDemo('Lopesloro/prospeccao-demos', 'clinica-sorriso'), 'https://lopesloro.github.io/prospeccao-demos/clinica-sorriso/');
});

test('demo reprovada no QA local nem chega a ser publicada', async () => {
  const pasta = mkdtempSync(join(tmpdir(), 'demo-ruim-'));
  try {
    // Página quebrada de propósito: sem viewport, sem wa.me, com recurso externo.
    writeFileSync(join(pasta, 'index.html'), '<html><head><title>x</title></head><body><img src="https://cdn.x/a.png"></body></html>', 'utf8');
    const resultado = await publicarComVerificacao(pasta, 'teste', '5511999999999');
    assert.equal(resultado.publicado, false, 'não pode publicar demo reprovada');
    assert.equal(resultado.liberarLink, false);
    assert.match(resultado.motivo, /QA local reprovou/);
  } finally {
    rmSync(pasta, { recursive: true, force: true });
  }
});
