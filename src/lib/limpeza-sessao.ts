/**
 * Registro de limpezas de sessao.
 *
 * Quando a usuaria sai, nao basta apagar o token: cada parte do app que
 * guardou algo dela em memoria precisa esquecer tambem. Sem um lugar unico,
 * cada store novo vira um vazamento que so aparece quando duas pessoas usam
 * o mesmo celular — e a segunda ve a colecao da primeira.
 *
 * Cada store se inscreve aqui no proprio arquivo, ao lado da definicao. Assim
 * quem cria um store novo ve o vizinho fazendo isso e nao esquece, em vez de
 * precisar lembrar de editar uma lista distante.
 */

type Limpeza = () => void | Promise<void>;

const limpezas = new Set<Limpeza>();

/** Inscreve uma limpeza. Devolve a funcao que cancela a inscricao. */
export function registrarLimpezaDeSessao(limpeza: Limpeza): () => void {
  limpezas.add(limpeza);
  return () => limpezas.delete(limpeza);
}

/**
 * Roda todas as limpezas inscritas.
 *
 * Uma limpeza que falha nao pode impedir as outras: sair da conta e uma acao
 * de seguranca, e limpar quase tudo e melhor do que parar no primeiro erro e
 * deixar o resto intacto.
 */
export async function limparTudoDaSessao(): Promise<void> {
  await Promise.allSettled([...limpezas].map((limpeza) => limpeza()));
}
