import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, rmSync } from 'node:fs';
import { classificarSite, extrairDominio, gerarPlanilha, prepararLeads } from './preparar-planilha.ts';

test('classifica o que NÃO é site próprio', () => {
  assert.equal(classificarSite('https://clinicaexemplo.com.br/'), 'site_proprio');
  assert.equal(classificarSite('https://www.instagram.com/clinica/'), 'instagram');
  assert.equal(classificarSite('https://l.instagram.com/?u=https%3A%2F%2Fwa.me%2F'), 'whatsapp');
  assert.equal(classificarSite('https://wa.me/5511999999999'), 'whatsapp');
  assert.equal(classificarSite('https://www.facebook.com/clinica'), 'facebook');
  assert.equal(classificarSite('https://linktr.ee/clinica'), 'agregador');
  assert.equal(classificarSite('https://sites.google.com/view/adv'), 'agregador');
  assert.equal(classificarSite(''), 'sem_site');
});

test('domínio é extraído sem www', () => {
  assert.equal(extrairDominio('https://www.clinica.com.br/pagina'), 'clinica.com.br');
  assert.equal(extrairDominio('nao-e-url'), '');
});

test('lead sem telefone é descartado e duplicado é removido', () => {
  const leads = prepararLeads([
    { title: 'Com telefone', phoneUnformatted: '+5511999998888', website: 'https://a.com.br' },
    { title: 'Duplicada', phoneUnformatted: '+55 11 99999-8888', website: 'https://b.com.br' },
    { title: 'Sem telefone', phoneUnformatted: '', website: 'https://c.com.br' },
  ]);
  assert.equal(leads.length, 1);
  assert.equal(leads[0].nome, 'Com telefone');
});

test('site próprio vem primeiro; entre iguais, mais avaliado primeiro', () => {
  const leads = prepararLeads([
    { title: 'Instagram', phoneUnformatted: '+5511911111111', website: 'https://instagram.com/x', reviewsCount: 900 },
    { title: 'Site pouco avaliado', phoneUnformatted: '+5511922222222', website: 'https://a.com.br', reviewsCount: 10 },
    { title: 'Site muito avaliado', phoneUnformatted: '+5511933333333', website: 'https://b.com.br', reviewsCount: 500 },
  ]);
  assert.deepEqual(
    leads.map((l) => l.nome),
    ['Site muito avaliado', 'Site pouco avaliado', 'Instagram'],
  );
});

test('planilha é gerada com as duas abas', async () => {
  const caminho = '/tmp/teste-planilha.xlsx';
  const leads = prepararLeads([
    { title: 'Clínica X', phoneUnformatted: '+5511999998888', website: 'https://x.com.br', city: 'São Paulo', categoryName: 'Dentista', totalScore: 4.8, reviewsCount: 120 },
  ]);
  try {
    await gerarPlanilha(leads, caminho);
    assert.ok(existsSync(caminho));
    const ExcelJS = (await import('exceljs')).default;
    const livro = new ExcelJS.Workbook();
    await livro.xlsx.readFile(caminho);
    assert.ok(livro.getWorksheet('Leads'));
    assert.ok(livro.getWorksheet('Resumo'));
    assert.equal(livro.getWorksheet('Leads')!.getCell('B2').value, 'Clínica X');
    assert.equal(livro.getWorksheet('Leads')!.getCell('F2').value, 'Site próprio');
  } finally {
    rmSync(caminho, { force: true });
  }
});
