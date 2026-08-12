import { config } from './config';
import { CHAVES, ler, limparCredenciais } from './armazenamento-seguro';

/**
 * Cliente HTTP do app.
 *
 * Regras de seguranca aplicadas aqui (docs/06-seguranca.md):
 * - o token sai do cofre a cada chamada e nunca fica em variavel de modulo;
 * - 401 limpa a sessao local em vez de tentar reusar credencial invalida;
 * - o corpo do erro nunca e ecoado cru na UI (pode conter detalhe interno);
 * - toda requisicao tem timeout, para a tela nao ficar presa.
 */

const TIMEOUT_PADRAO_MS = 15_000;

export class ErroApi extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string,
    mensagem: string,
  ) {
    super(mensagem);
    this.name = 'ErroApi';
  }
}

/** Mensagens em pt-BR; nada de detalhe tecnico vazando para a usuaria. */
function mensagemPorStatus(status: number): string {
  if (status === 401) return 'Sua sessao expirou. Entre novamente.';
  if (status === 403) return 'Voce nao tem acesso a este conteudo.';
  if (status === 404) return 'Nao encontramos o que voce procura.';
  if (status === 429) return 'Muitas tentativas. Aguarde um instante.';
  if (status >= 500) return 'Tivemos um problema. Tente de novo em instantes.';
  return 'Nao foi possivel completar a acao.';
}

type Opcoes = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** Rotas publicas (login, cadastro) nao devem mandar token. */
  autenticada?: boolean;
  timeoutMs?: number;
};

export async function requisitar<T>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  const {
    autenticada = true,
    timeoutMs = TIMEOUT_PADRAO_MS,
    body,
    headers,
    ...resto
  } = opcoes;

  const cabecalhos = new Headers(headers);
  cabecalhos.set('Accept', 'application/json');
  if (body !== undefined) {
    cabecalhos.set('Content-Type', 'application/json');
  }

  if (autenticada) {
    const token = await ler(CHAVES.tokenAcesso);
    if (token) {
      cabecalhos.set('Authorization', `Bearer ${token}`);
    }
  }

  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), timeoutMs);

  let resposta: Response;
  try {
    resposta = await fetch(`${config.apiUrl}${caminho}`, {
      ...resto,
      headers: cabecalhos,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controlador.signal,
    });
  } catch (erro) {
    if (erro instanceof Error && erro.name === 'AbortError') {
      throw new ErroApi(0, 'timeout', 'A conexao demorou demais. Tente de novo.');
    }
    throw new ErroApi(0, 'rede', 'Sem conexao. Verifique sua internet.');
  } finally {
    clearTimeout(timeout);
  }

  if (resposta.status === 401 && autenticada) {
    // Credencial invalida ou revogada: nao insistir com ela.
    await limparCredenciais();
    throw new ErroApi(401, 'nao_autenticada', mensagemPorStatus(401));
  }

  if (!resposta.ok) {
    let codigo = 'erro_desconhecido';
    try {
      const corpo = (await resposta.json()) as { codigo?: unknown };
      if (typeof corpo.codigo === 'string') codigo = corpo.codigo;
    } catch {
      // Resposta sem JSON: mantemos o codigo generico.
    }
    throw new ErroApi(resposta.status, codigo, mensagemPorStatus(resposta.status));
  }

  if (resposta.status === 204) {
    return undefined as T;
  }

  return (await resposta.json()) as T;
}

export const api = {
  get: <T>(caminho: string, opcoes?: Opcoes) =>
    requisitar<T>(caminho, { ...opcoes, method: 'GET' }),
  post: <T>(caminho: string, body?: unknown, opcoes?: Opcoes) =>
    requisitar<T>(caminho, { ...opcoes, method: 'POST', body }),
  patch: <T>(caminho: string, body?: unknown, opcoes?: Opcoes) =>
    requisitar<T>(caminho, { ...opcoes, method: 'PATCH', body }),
  delete: <T>(caminho: string, opcoes?: Opcoes) =>
    requisitar<T>(caminho, { ...opcoes, method: 'DELETE' }),
};
