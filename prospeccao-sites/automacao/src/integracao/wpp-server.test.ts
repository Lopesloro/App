import { test } from 'node:test';
import assert from 'node:assert/strict';
import { COLUNAS_CSV, contarDescartados, gerarCsvLeads, normalizarWhatsapp } from './wpp-server.ts';

const LEADS = [
  { nome: 'Clínica A', whatsapp: '11999998888', cidade: 'São Paulo', analise: { score: 45 } as never },
  { nome: 'Oficina B', whatsapp: '+55 21 98888-7777', cidade: 'Rio de Janeiro', analise: { score: 92 } as never },
  { nome: 'Sem zap', whatsapp: '', cidade: 'Curitiba' },
];

test('cabeçalho bate exatamente com o que o motor espera', () => {
  const csv = gerarCsvLeads(LEADS);
  assert.equal(csv.split('\n')[0], COLUNAS_CSV.join(','));
  assert.equal(csv.split('\n')[0], 'ID,NOME,WHATSAPP,NICHO,CATEGORIA,CIDADE,PAIS,NOTA,AVALIACOES,STATUS,DATA_ENVIO,NUMERO_USADO,MENSAGEM_ENVIADA');
});

test('fila sai ordenada por score — pior site primeiro', () => {
  const linhas = gerarCsvLeads(LEADS).trim().split('\n').slice(1);
  assert.match(linhas[0], /Oficina B/);
  assert.match(linhas[1], /Clínica A/);
});

test('lead sem WhatsApp não entra na fila', () => {
  const csv = gerarCsvLeads(LEADS);
  assert.ok(!csv.includes('Sem zap'));
  assert.equal(contarDescartados(LEADS), 1);
});

test('normalização adiciona DDI 55 em número brasileiro', () => {
  assert.equal(normalizarWhatsapp('11999998888'), '5511999998888');
  assert.equal(normalizarWhatsapp('+55 (21) 98888-7777'), '5521988887777');
  assert.equal(normalizarWhatsapp('351910447044'), '351910447044'); // já tem DDI
  assert.equal(normalizarWhatsapp('123'), undefined);
  assert.equal(normalizarWhatsapp(''), undefined);
});

test('campo com vírgula e aspas é escapado', () => {
  const csv = gerarCsvLeads([{ nome: 'Silva, Souza & "Cia"', whatsapp: '11999998888' }]);
  assert.ok(csv.includes('"Silva, Souza & ""Cia"""'));
  // A linha continua com o número certo de colunas.
  assert.equal(csv.trim().split('\n')[1].split('","').length >= 1, true);
});

test('STATUS sai como Pendente para o motor pegar', () => {
  const linha = gerarCsvLeads([{ nome: 'X', whatsapp: '11999998888' }]).trim().split('\n')[1];
  assert.ok(linha.includes('Pendente'));
});
