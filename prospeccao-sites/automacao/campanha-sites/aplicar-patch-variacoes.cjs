// Aplica no server.js do wpp-server o suporte a VARIACOES da primeira mensagem.
//
//   node aplicar-patch-variacoes.js /caminho/do/wpp-server/server.js
//
// O que muda: hoje o motor usa sempre a mesma frase (campo "saudacao").
// Depois do patch ele sorteia uma das frases do array "saudacoes" do
// oferta-<campanha>.json. Sem o array, o comportamento antigo continua igual.
// Idempotente: rodar duas vezes nao duplica nada. Faz backup antes.

const fs = require('fs');

const ALVO = `  if (o.saudacao) {
    return String(o.saudacao)`;

const NOVO = `  // VARIACOES: sorteia entre as frases de "saudacoes". Mandar sempre a mesma
  // frase dezenas de vezes por dia e o padrao que faz o WhatsApp marcar como
  // spam. Sem o array, cai no campo "saudacao" de antes.
  const _variacoes = Array.isArray(o.saudacoes) && o.saudacoes.length
    ? o.saudacoes
    : (o.saudacao ? [o.saudacao] : []);
  if (_variacoes.length) {
    return String(_variacoes[Math.floor(Math.random() * _variacoes.length)])`;

const caminho = process.argv[2];
if (!caminho) {
  console.error('Uso: node aplicar-patch-variacoes.js /caminho/do/wpp-server/server.js');
  process.exit(2);
}

const original = fs.readFileSync(caminho, 'utf8');

if (original.includes('_variacoes')) {
  console.log('Patch ja aplicado — nada a fazer.');
  process.exit(0);
}
if (!original.includes(ALVO)) {
  console.error('ERRO: nao encontrei o trecho esperado no server.js.');
  console.error('Provavel que o arquivo tenha mudado. Aplique a mao: em textoSaudacao(),');
  console.error('troque o uso de o.saudacao por um sorteio dentro de o.saudacoes.');
  process.exit(1);
}

fs.writeFileSync(caminho + '.bak-' + Date.now(), original);
fs.writeFileSync(caminho, original.replace(ALVO, NOVO));
console.log('Patch aplicado. Backup salvo ao lado do server.js.');
console.log('Agora o motor sorteia entre as frases de "saudacoes" do oferta-sites.json.');
