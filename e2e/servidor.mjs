/**
 * Servidor estatico para rodar o app exportado nos testes.
 *
 * Existe por causa de um detalhe que engana: um servidor estatico ingenuo
 * (`python3 -m http.server`, por exemplo) serve `/login.html`, mas nao serve
 * `/login`. O roteador do app entao recebe a URL com `.html`, nao acha rota
 * com esse nome e mostra "Unmatched Route" — parece bug do app, e nao e.
 *
 * Este servidor faz o que qualquer hospedagem de verdade faz: tenta o caminho
 * exato, depois `caminho.html`, depois `caminho/index.html`.
 *
 * Uso:  node e2e/servidor.mjs [pasta] [porta]
 */

import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const PASTA = process.argv[2] ?? '.web-build';
const PORTA = Number(process.argv[3] ?? 8099);

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

function resolver(caminhoUrl) {
  // `normalize` + prefixo fixo: impede `../../etc/passwd` sair da pasta.
  const relativo = normalize(decodeURIComponent(caminhoUrl)).replace(/^(\.\.[/\\])+/, '');
  const base = join(PASTA, relativo);

  const candidatos =
    relativo === '/' || relativo === '' || relativo === '.'
      ? [join(PASTA, 'index.html')]
      : [base, `${base}.html`, join(base, 'index.html')];

  for (const candidato of candidatos) {
    try {
      if (statSync(candidato).isFile()) return candidato;
    } catch {
      // Candidato nao existe: tenta o proximo.
    }
  }
  return null;
}

createServer((requisicao, resposta) => {
  const caminho = new URL(requisicao.url ?? '/', 'http://local').pathname;
  const arquivo = resolver(caminho);

  if (!arquivo) {
    resposta.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    resposta.end('nao encontrado');
    return;
  }

  resposta.writeHead(200, {
    'Content-Type': TIPOS[extname(arquivo)] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  createReadStream(arquivo).pipe(resposta);
}).listen(PORTA, () => {
  console.log(`servindo ${PASTA} em http://localhost:${PORTA}`);
});
