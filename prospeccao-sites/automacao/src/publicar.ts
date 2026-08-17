// Publica uma demo no GitHub Pages e SÓ libera o link depois de verificar a
// página publicada de verdade (não a local).
//
//   npm run publicar -- --demo saida/demos/<slug> --slug clinica-sorriso
//
// Requisitos: GITHUB_TOKEN no ambiente e o repositório de demos já criado.
// Configuração por env: DEMOS_REPO (padrão Lopesloro/prospeccao-demos),
// DEMOS_BRANCH (padrão main).

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { formatarQa, validarDemo, type ResultadoQa } from './demo/qa.ts';

const REPO = process.env.DEMOS_REPO ?? 'Lopesloro/prospeccao-demos';
const BRANCH = process.env.DEMOS_BRANCH ?? 'main';

export interface ResultadoPublicacao {
  url: string;
  publicado: boolean;
  verificado: boolean;
  qaLocal: ResultadoQa;
  qaPublicado?: ResultadoQa;
  httpStatus?: number;
  liberarLink: boolean;
  motivo: string;
}

export function urlDaDemo(repo: string, slug: string): string {
  const [dono, nome] = repo.split('/');
  return `https://${dono.toLowerCase()}.github.io/${nome}/${slug}/`;
}

function git(args: string[], cwd: string): void {
  execFileSync('git', args, { cwd, stdio: 'pipe' });
}

/** Sobe a pasta da demo para o repositório de demos, na subpasta do slug. */
export function publicarNoPages(pastaDemo: string, slug: string, repo = REPO, branch = BRANCH): void {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN não definido — sem ele não dá para publicar.');
  if (!existsSync(join(pastaDemo, 'index.html'))) throw new Error(`index.html não encontrado em ${pastaDemo}`);

  const trabalho = mkdtempSync(join(tmpdir(), 'demo-pages-'));
  try {
    const remoto = `https://x-access-token:${token}@github.com/${repo}.git`;
    git(['clone', '--depth', '1', '--branch', branch, remoto, trabalho], tmpdir());

    const destino = join(trabalho, slug);
    rmSync(destino, { recursive: true, force: true });
    cpSync(pastaDemo, destino, { recursive: true });

    // .nojekyll evita o Jekyll ignorar arquivos/pastas iniciados por _.
    writeFileSync(join(trabalho, '.nojekyll'), '', 'utf8');

    git(['add', '-A'], trabalho);
    git(['-c', 'user.email=bot@prospeccao.local', '-c', 'user.name=Prospeccao Bot', 'commit', '-m', `demo: ${slug}`], trabalho);
    git(['push', 'origin', branch], trabalho);
  } finally {
    rmSync(trabalho, { recursive: true, force: true });
  }
}

/**
 * Verificação pós-publicação: busca a página NO AR e roda o mesmo QA.
 * O Pages leva alguns segundos para propagar, então tenta algumas vezes.
 */
export async function verificarPublicado(
  url: string,
  whatsapp: string,
  tentativas = 6,
  esperaMs = 10_000,
): Promise<{ ok: boolean; status?: number; qa?: ResultadoQa }> {
  for (let i = 1; i <= tentativas; i++) {
    try {
      const resposta = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15_000) });
      if (resposta.ok) {
        const html = await resposta.text();
        return { ok: true, status: resposta.status, qa: validarDemo(html, whatsapp) };
      }
      if (i === tentativas) return { ok: false, status: resposta.status };
    } catch {
      if (i === tentativas) return { ok: false };
    }
    await new Promise((r) => setTimeout(r, esperaMs));
  }
  return { ok: false };
}

/**
 * Fluxo completo: QA local → publica → QA da página publicada → libera link.
 * O link só é liberado se a página publicada passar em tudo.
 */
export async function publicarComVerificacao(
  pastaDemo: string,
  slug: string,
  whatsapp: string,
  repo = REPO,
): Promise<ResultadoPublicacao> {
  const html = readFileSync(join(pastaDemo, 'index.html'), 'utf8');
  const qaLocal = validarDemo(html, whatsapp);
  const url = urlDaDemo(repo, slug);

  if (!qaLocal.passou) {
    return {
      url,
      publicado: false,
      verificado: false,
      qaLocal,
      liberarLink: false,
      motivo: 'QA local reprovou — nem publica',
    };
  }

  publicarNoPages(pastaDemo, slug, repo);
  const verificacao = await verificarPublicado(url, whatsapp);

  if (!verificacao.ok) {
    return {
      url,
      publicado: true,
      verificado: false,
      qaLocal,
      httpStatus: verificacao.status,
      liberarLink: false,
      motivo: `página publicada não respondeu (HTTP ${verificacao.status ?? 'sem resposta'}) — NÃO enviar o link`,
    };
  }

  const qaPublicado = verificacao.qa!;
  return {
    url,
    publicado: true,
    verificado: true,
    qaLocal,
    qaPublicado,
    httpStatus: verificacao.status,
    liberarLink: qaPublicado.passou,
    motivo: qaPublicado.passou
      ? 'página no ar e aprovada — link liberado'
      : 'página no ar mas reprovou no QA — NÃO enviar o link',
  };
}

if (process.argv[1]?.endsWith('publicar.ts')) {
  const args = process.argv.slice(2);
  const valor = (flag: string) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const pasta = valor('--demo');
  const slug = valor('--slug');
  const whatsapp = (valor('--whatsapp') ?? '').replace(/\D/g, '');

  if (!pasta || !slug || !whatsapp) {
    console.error('Uso: npm run publicar -- --demo saida/demos/<pasta> --slug <slug> --whatsapp 5511999999999');
    process.exit(2);
  }

  const resultado = await publicarComVerificacao(pasta, slug, whatsapp);
  console.log(`\nURL: ${resultado.url}`);
  console.log(`Publicado: ${resultado.publicado ? 'sim' : 'não'} | Verificado no ar: ${resultado.verificado ? 'sim' : 'não'}`);
  if (resultado.qaPublicado) console.log(formatarQa(resultado.qaPublicado));
  console.log(resultado.liberarLink ? `\n✅ ${resultado.motivo}` : `\n❌ ${resultado.motivo}`);
  if (!resultado.liberarLink) process.exitCode = 1;
}
