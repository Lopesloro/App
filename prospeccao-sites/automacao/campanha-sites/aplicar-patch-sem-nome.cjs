// Torna a IDENTIDADE do robo controlada pela campanha, em vez de fixa no codigo.
//
//   node aplicar-patch-sem-nome.cjs /caminho/do/wpp-server/server.js
//
// Hoje o server.js manda a IA se apresentar como "Gabriel, da BlueShieldPro",
// assinar no final e incluir o link blueshieldpro.com.br — tudo escrito no
// codigo. Depois do patch isso vem do oferta-<campanha>.json:
//
//   "marca": ""        -> nao cita empresa nenhuma
//   "site": ""         -> nao inclui link
//   "assinatura": ""   -> nao assina
//
// Campanhas antigas (casas, carros, advocacia) continuam iguais: sem esses
// campos no JSON, o patch usa os valores de antes. Idempotente, faz backup.

const fs = require('fs');

const SYS_ANTIGO = `  const sys = 'Você é ' + nome + ', da BlueShieldPro (blueshieldpro.com.br), empresa de tecnologia que cria ' +`;

const SYS_NOVO = `  // IDENTIDADE vem da campanha. Vazio = nao se apresenta, nao cita marca, nao assina.
  const _marca = (o.marca === undefined) ? 'BlueShieldPro' : String(o.marca || '');
  const _site = (o.site === undefined) ? 'https://blueshieldpro.com.br/' : String(o.site || '');
  const _assina = (o.assinatura === undefined) ? (nome + ', BlueShieldPro') : String(o.assinatura || '');
  const _quemSou = _marca
    ? ('Você é ' + nome + ', da ' + _marca + ', empresa de tecnologia que cria ')
    : ('Você escreve mensagens de WhatsApp para empresas. NUNCA se apresente pelo nome, NUNCA cite o nome de nenhuma empresa ou marca, NUNCA assine a mensagem. Você oferece ');
  const sys = _quemSou +`;

const TRECHO2_ANTIGO = `    'humana, criando conexão; (2) diga em uma frase que a BlueShieldPro desenvolve soluções digitais sob medida para ' +`;
const TRECHO2_NOVO = `    'humana, criando conexão; (2) diga em uma frase o que você faz por ' +`;

const TRECHO3_ANTIGO = `    'Brasil. INCLUA o link https://blueshieldpro.com.br/ uma única vez, encaixado de forma natural. Termine ' +
    'assinando "' + nome + ', BlueShieldPro". OBJETIVO: gerar confiança e conseguir um "pode preparar" / "quero ver", ' +
    'nunca forçar o fechamento.';`;
const TRECHO3_NOVO = `    'Brasil. ' +
    (_site ? ('INCLUA o link ' + _site + ' uma única vez, encaixado de forma natural. ') : 'NÃO inclua nenhum link. ') +
    (_assina ? ('Termine assinando "' + _assina + '". ') : 'NÃO assine a mensagem, NÃO escreva seu nome nem nome de empresa em lugar nenhum. ') +
    (o.regras_pitch ? ('REGRAS ADICIONAIS OBRIGATÓRIAS: ' + [].concat(o.regras_pitch).join(' ') + ' ') : '') +
    'OBJETIVO: gerar confiança e conseguir um "pode preparar" / "quero ver", ' +
    'nunca forçar o fechamento.';`;

const FALLBACK_ANTIGO = `  return 'Perfeito, obrigado pelo retorno. Nós da BlueShieldPro desenvolvemos soluções digitais sob medida para ' +
    o.publico + ' — ' + o.descricao + '. Posso preparar uma demonstração, sem custo e sem compromisso, para ' +
    (lead.NOME || 'você') + ' ver como ficaria — e se não gostar ou não for o momento, é só me dizer, sem problema nenhum. Pode ser? ' +
    'Mais em https://blueshieldpro.com.br/\\n\\n' + nome + ', BlueShieldPro';`;

const FALLBACK_NOVO = `  const _marca = (o.marca === undefined) ? 'BlueShieldPro' : String(o.marca || '');
  const _site = (o.site === undefined) ? 'https://blueshieldpro.com.br/' : String(o.site || '');
  const _assina = (o.assinatura === undefined) ? (nome + ', BlueShieldPro') : String(o.assinatura || '');
  return 'Perfeito, obrigado pelo retorno. ' +
    (_marca ? ('Nós da ' + _marca + ' trabalhamos com ') : 'Trabalho com ') + o.descricao + '. ' +
    'Posso preparar uma demonstração, sem custo e sem compromisso, para ' +
    (lead.NOME || 'você') + ' ver como ficaria — e se não gostar ou não for o momento, é só me dizer, sem problema nenhum. Pode ser?' +
    (_site ? ('\\nMais em ' + _site) : '') +
    (_assina ? ('\\n\\n' + _assina) : '');`;

const caminho = process.argv[2];
if (!caminho) {
  console.error('Uso: node aplicar-patch-sem-nome.cjs /caminho/do/wpp-server/server.js');
  process.exit(2);
}

let src = fs.readFileSync(caminho, 'utf8');

if (src.includes('_quemSou')) {
  console.log('Patch ja aplicado — nada a fazer.');
  process.exit(0);
}

const trocas = [
  ['prompt do sistema', SYS_ANTIGO, SYS_NOVO],
  ['frase da marca', TRECHO2_ANTIGO, TRECHO2_NOVO],
  ['link e assinatura', TRECHO3_ANTIGO, TRECHO3_NOVO],
  ['fallback', FALLBACK_ANTIGO, FALLBACK_NOVO],
];

for (const [rotulo, de] of trocas) {
  if (!src.includes(de)) {
    console.error('ERRO: nao encontrei o trecho "' + rotulo + '" no server.js.');
    console.error('O arquivo mudou. Nada foi alterado.');
    process.exit(1);
  }
}

fs.writeFileSync(caminho + '.bak-semnome-' + Date.now(), src);
for (const [rotulo, de, para] of trocas) {
  src = src.replace(de, para);
  console.log('  ok: ' + rotulo);
}
fs.writeFileSync(caminho, src);

console.log('\nPatch aplicado. Backup salvo ao lado do server.js.');
console.log('Agora "marca", "site" e "assinatura" do oferta-sites.json mandam na identidade.');
console.log('Como estao vazios: o robo NAO diz nome, NAO cita empresa e NAO assina.');
