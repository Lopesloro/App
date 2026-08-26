import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * A trava que impede uma chave de API de chegar ao aparelho de alguem.
 *
 * ## Por que isto e um teste, e nao uma recomendacao
 *
 * Recomendacao em documento nao segura ninguem as 2 da manha tentando fazer a
 * IA funcionar. Um teste vermelho segura, porque o CI nao deixa passar.
 *
 * O risco e concreto: o bundle de um app de celular vai inteiro para o
 * aparelho de quem instala, e qualquer pessoa consegue abrir e ler o que tem
 * dentro. Nao existe ofuscacao que resolva. Uma chave embutida e uma chave
 * publicada — e a fatura do uso indevido chega para o fundador.
 *
 * ## O que ele verifica
 *
 * 1. Nenhum formato conhecido de chave no codigo rastreado pelo git.
 * 2. Nenhuma variavel `EXPO_PUBLIC_*` com cara de segredo — o prefixo
 *    `EXPO_PUBLIC_` significa "isto vai para o bundle e fica visivel", e
 *    muita gente usa achando que e o contrario.
 * 3. Nenhum `.env` de verdade rastreado.
 * 4. O cliente de IA nao fala com o Google direto.
 */

const RAIZ = join(__dirname, '..', '..', '..');

/** Formatos publicos e conhecidos de chave. Nenhum e segredo de verdade. */
const FORMATOS_DE_CHAVE = [
  'AIza[0-9A-Za-z_\\-]{30,}', // Google / Gemini
  'sk-[A-Za-z0-9]{20,}', // OpenAI
  'ghp_[A-Za-z0-9]{30,}', // GitHub
  'AKIA[0-9A-Z]{16}', // AWS
  'xox[baprs]-[0-9A-Za-z-]{10,}', // Slack
  '-----BEGIN [A-Z ]*PRIVATE KEY-----',
].join('|');

function buscarNoGit(padrao: string, caminhos = '.'): string[] {
  try {
    const saida = execSync(
      `git grep -nIE ${JSON.stringify(padrao)} -- ${caminhos}`,
      { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
    return saida.split('\n').filter(Boolean);
  } catch {
    // `git grep` sai com codigo 1 quando nao acha nada. Sem achado = sucesso.
    return [];
  }
}

describe('nenhuma chave de API entra no aplicativo', () => {
  it('nao ha chave em formato conhecido no codigo', () => {
    // O proprio arquivo de teste contem os formatos, entao fica de fora.
    const achados = buscarNoGit(FORMATOS_DE_CHAVE).filter(
      (linha) => !linha.includes('sem-chave-exposta.test.ts'),
    );

    expect(achados).toEqual([]);
  });

  it('nenhuma variavel EXPO_PUBLIC_ tem cara de segredo', () => {
    // Tudo que comeca com EXPO_PUBLIC_ e embutido no bundle e fica visivel.
    const suspeitas = buscarNoGit(
      'EXPO_PUBLIC_[A-Z_]*(KEY|SECRET|TOKEN|SENHA|PASSWORD|CREDENTIAL)',
    );

    expect(suspeitas).toEqual([]);
  });

  it('nenhum .env de verdade esta rastreado pelo git', () => {
    const rastreados = execSync('git ls-files', {
      cwd: RAIZ,
      encoding: 'utf8',
    })
      .split('\n')
      .filter((arquivo) => arquivo.startsWith('.env') && arquivo !== '.env.example');

    expect(rastreados).toEqual([]);
  });

  it('o .gitignore bloqueia .env', () => {
    const gitignore = readFileSync(join(RAIZ, '.gitignore'), 'utf8');

    expect(gitignore).toMatch(/^\.env$/m);
    expect(gitignore).toMatch(/^\.env\.\*$/m);
  });

  it('o exemplo de env so tem valor publico', () => {
    const exemplo = readFileSync(join(RAIZ, '.env.example'), 'utf8');

    // Se alguem colar uma chave de verdade aqui "so para exemplificar",
    // ela vai para o repositorio publico junto.
    expect(exemplo).not.toMatch(new RegExp(FORMATOS_DE_CHAVE));
  });
});

describe('o app nunca fala com um provedor de IA diretamente', () => {
  it('nao ha chamada a dominio de IA no codigo do app', () => {
    const chamadasDiretas = buscarNoGit(
      'generativelanguage\\.googleapis\\.com|api\\.openai\\.com|api\\.anthropic\\.com',
      'src',
    ).filter((linha) => !linha.includes('sem-chave-exposta.test.ts'));

    // Falar direto com o provedor exigiria a chave no aparelho. Toda chamada
    // passa pelo nosso servidor — ver src/features/ia/cliente-ia.ts.
    expect(chamadasDiretas).toEqual([]);
  });

  it('o cliente de IA usa a nossa API', () => {
    const cliente = readFileSync(
      join(RAIZ, 'src', 'features', 'ia', 'cliente-ia.ts'),
      'utf8',
    );

    expect(cliente).toContain("from '@/lib/api-client'");
    expect(cliente).toContain('/ia/identificar-peca');
  });
});
