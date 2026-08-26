/**
 * Sobe o servidor, roda o teste de ponta a ponta e derruba tudo no fim.
 *
 * Serve para `npm run e2e` ser um comando so, e para o servidor nao ficar
 * ligado quando o teste falha — o que na tentativa seguinte da "porta em uso"
 * e manda a pessoa depurar a coisa errada.
 */

import { spawn } from 'node:child_process';
import { setTimeout as esperar } from 'node:timers/promises';

const PORTA = Number(process.env.PORTA ?? 8099);
const PASTA = process.env.PASTA ?? '.web-build';
const BASE_URL = `http://localhost:${PORTA}`;

const servidor = spawn('node', ['e2e/servidor.mjs', PASTA, String(PORTA)], {
  stdio: 'inherit',
});

const encerrar = (codigo) => {
  servidor.kill('SIGTERM');
  process.exit(codigo);
};

process.on('SIGINT', () => encerrar(130));
process.on('SIGTERM', () => encerrar(143));

// Espera o servidor responder em vez de dormir um tempo fixo: em maquina
// lenta o tempo fixo falha, e em maquina rapida ele so desperdica segundos.
let pronto = false;
for (let tentativa = 0; tentativa < 40; tentativa++) {
  try {
    const resposta = await fetch(BASE_URL);
    if (resposta.ok) {
      pronto = true;
      break;
    }
  } catch {
    // Ainda subindo.
  }
  await esperar(250);
}

if (!pronto) {
  console.error(`servidor nao respondeu em ${BASE_URL} — a pasta ${PASTA} existe?`);
  encerrar(1);
}

const teste = spawn('node', ['e2e/fluxo-completo.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, BASE_URL },
});

teste.on('exit', (codigo) => encerrar(codigo ?? 1));
