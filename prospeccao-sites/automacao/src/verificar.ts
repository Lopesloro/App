// Verifica uma demo JA PUBLICADA: busca a pagina no ar e roda o mesmo QA de
// 12 itens contra ela. So depois de passar aqui o link pode ir para o cliente.
//
//   npm run verificar -- https://lopesloro.github.io/prospecao-demos-/slug/ 5511999999999

import { formatarQa, validarDemo } from './demo/qa.ts';

const [, , url, whatsappBruto] = process.argv;
if (!url || !whatsappBruto) {
  console.error('Uso: npm run verificar -- <url-da-demo> <whatsapp-com-ddi>');
  console.error('Ex.:  npm run verificar -- https://lopesloro.github.io/prospecao-demos-/maisfamiliaclinica/ 5511934489686');
  process.exit(2);
}
const whatsapp = whatsappBruto.replace(/\D/g, '');

console.log(`Buscando ${url} ...\n`);

// O Pages leva alguns segundos para propagar depois do push.
let html: string | undefined;
let status = 0;
for (let tentativa = 1; tentativa <= 6; tentativa++) {
  try {
    const resposta = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15_000) });
    status = resposta.status;
    if (resposta.ok) {
      html = await resposta.text();
      break;
    }
    console.log(`  tentativa ${tentativa}: HTTP ${status} — aguardando propagação...`);
  } catch (erro) {
    console.log(`  tentativa ${tentativa}: sem resposta (${erro instanceof Error ? erro.message : erro})`);
  }
  if (tentativa < 6) await new Promise((r) => setTimeout(r, 10_000));
}

if (!html) {
  console.error(`\n❌ A página não respondeu (último status: ${status || 'sem resposta'}).`);
  console.error('   NÃO envie o link. Verifique se o GitHub Pages está ativado nas configurações do repositório.');
  process.exit(1);
}

const qa = validarDemo(html, whatsapp);
console.log(`HTTP ${status} · ${(Buffer.byteLength(html, 'utf8') / 1024).toFixed(0)} KB\n`);
console.log(formatarQa(qa));

if (!qa.passou) {
  console.error('\n❌ Reprovou no QA — NÃO envie o link para o cliente.');
  process.exit(1);
}
console.log('\n✅ Página no ar e aprovada. Pode enviar o link.');
