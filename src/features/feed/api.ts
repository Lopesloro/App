import { api } from '@/lib/api-client';
import { config } from '@/lib/config';
import { LOOKS_EXEMPLO } from './dados-exemplo';
import {
  lookSchema,
  looksPaginaSchema,
  type Look,
  type LooksPagina,
  type Ocasiao,
} from './tipos';

/**
 * Fonte de dados do feed.
 *
 * Enquanto a API nao existe, servimos os looks de exemplo com a MESMA forma
 * de resposta que o backend vai devolver (paginada e validada pelo schema).
 * Assim a troca para a API de verdade e so apagar o ramo do exemplo — os
 * componentes e os testes nao mudam.
 */

export const TAMANHO_PAGINA = 4;

export type FiltroFeed = {
  ocasiao?: Ocasiao;
};

/** Usa dados de exemplo ate a API de looks entrar no ar (issue #22). */
const USAR_EXEMPLO = config.apiUrl.includes('localhost');

function buscarNoExemplo(cursor: number, filtro: FiltroFeed): LooksPagina {
  const filtrados = filtro.ocasiao
    ? LOOKS_EXEMPLO.filter((look) => look.ocasiao === filtro.ocasiao)
    : LOOKS_EXEMPLO;

  const pagina = filtrados.slice(cursor, cursor + TAMANHO_PAGINA);
  const fim = cursor + TAMANHO_PAGINA;

  return {
    looks: pagina,
    proximoCursor: fim < filtrados.length ? fim : null,
    total: filtrados.length,
  };
}

export async function buscarLooks(
  cursor = 0,
  filtro: FiltroFeed = {},
): Promise<LooksPagina> {
  if (USAR_EXEMPLO) {
    // Valida tambem o exemplo: se o formato divergir do schema, o erro
    // aparece em desenvolvimento e nao so quando a API real chegar.
    return looksPaginaSchema.parse(buscarNoExemplo(cursor, filtro));
  }

  const parametros = new URLSearchParams({ cursor: String(cursor) });
  if (filtro.ocasiao) parametros.set('ocasiao', filtro.ocasiao);

  const resposta = await api.get<unknown>(`/looks?${parametros.toString()}`);
  return looksPaginaSchema.parse(resposta);
}

/** Busca um look pelo id. Devolve null quando nao existe. */
export async function buscarLook(id: string): Promise<Look | null> {
  if (USAR_EXEMPLO) {
    const look = LOOKS_EXEMPLO.find((l) => l.id === id);
    return look ? lookSchema.parse(look) : null;
  }

  // O id vai no caminho da URL: precisa ser escapado para nao permitir que
  // um valor com barra ou query mude a rota chamada.
  const resposta = await api.get<unknown>(`/looks/${encodeURIComponent(id)}`);
  return lookSchema.parse(resposta);
}
