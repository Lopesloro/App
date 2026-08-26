import type {
  Categoria,
  Estacao,
  Estilo,
  Ocasiao,
} from '@/features/estilo/vocabulario';
import { CATALOGO_ROUPAS } from './catalogo';
import type { TipoRoupa } from './tipos';

/**
 * Busca e filtro do catalogo de roupas.
 *
 * Roda inteira no aparelho, em cima de uma lista pequena. Nao ha chamada de
 * rede, entao nao ha o que esperar: o resultado muda enquanto a usuaria
 * digita. E, como nada do que ela procura sai do celular, o app nao aprende
 * nada sobre ela num servidor — o que ela busca por roupa e informacao
 * pessoal (docs/06-seguranca.md).
 */

/**
 * Tabela de acentos, em vez de `String.prototype.normalize('NFD')`.
 *
 * O suporte a normalizacao Unicode em React Native depende de o build do
 * Hermes ter ICU completo — no Android ele costuma vir sem. Uma busca que
 * funciona no simulador e falha no celular de uma usuaria e pior do que uma
 * tabela explicita de 30 caracteres.
 */
const ACENTOS: Record<string, string> = {
  á: 'a', à: 'a', ã: 'a', â: 'a', ä: 'a',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  í: 'i', ì: 'i', î: 'i', ï: 'i',
  ó: 'o', ò: 'o', õ: 'o', ô: 'o', ö: 'o',
  ú: 'u', ù: 'u', û: 'u', ü: 'u',
  ç: 'c', ñ: 'n',
};

/**
 * Deixa o texto comparavel: minusculo, sem acento, sem espaco sobrando.
 *
 * Quem digita no celular quase nunca acentua. Sem isto, procurar "sandalia"
 * nao acharia "Sandália de tira fina" — e a usuaria concluiria que o app nao
 * tem a peca.
 */
export function normalizarTexto(texto: string): string {
  let saida = '';
  for (const caractere of texto.toLowerCase()) {
    saida += ACENTOS[caractere] ?? caractere;
  }
  return saida.trim().replace(/\s+/g, ' ');
}

export type FiltroRoupas = {
  texto?: string;
  categoria?: Categoria;
  estilo?: Estilo;
  ocasiao?: Ocasiao;
  estacao?: Estacao;
};

/**
 * Quanto a peca combina com o texto digitado.
 *
 * Zero significa "nao aparece". Os degraus existem para a lista abrir com o
 * que a usuaria provavelmente quis dizer: quem digita "camisa" espera a
 * camisa antes da "camisa jeans", e as duas antes de uma peca cuja descricao
 * apenas menciona camisa.
 */
export function pontuarTexto(roupa: TipoRoupa, termo: string): number {
  const busca = normalizarTexto(termo);
  if (busca.length === 0) return 1;

  const nome = normalizarTexto(roupa.nome);

  if (nome === busca) return 100;
  if (nome.startsWith(busca)) return 80;
  if (nome.includes(busca)) return 60;

  for (const sinonimo of roupa.sinonimos) {
    const alternativo = normalizarTexto(sinonimo);
    if (alternativo === busca) return 70;
    if (alternativo.startsWith(busca)) return 50;
    if (alternativo.includes(busca)) return 40;
  }

  // Buscar pela sensacao ("boho", "festa") e tao legitimo quanto buscar pelo
  // nome da peca, mas vale menos que o nome exato.
  if (roupa.estilos.some((estilo) => normalizarTexto(estilo).includes(busca))) return 30;
  if (roupa.ocasioes.some((ocasiao) => normalizarTexto(ocasiao).includes(busca))) return 25;

  if (normalizarTexto(roupa.descricao).includes(busca)) return 10;

  return 0;
}

/** A peca passa pelos filtros de chip (categoria, estilo, ocasiao, estacao)? */
export function passaNosFiltros(roupa: TipoRoupa, filtro: FiltroRoupas): boolean {
  if (filtro.categoria && roupa.categoria !== filtro.categoria) return false;
  if (filtro.estilo && !roupa.estilos.includes(filtro.estilo)) return false;
  if (filtro.ocasiao && !roupa.ocasioes.includes(filtro.ocasiao)) return false;
  if (filtro.estacao && !roupa.estacoes.includes(filtro.estacao)) return false;
  return true;
}

export type RoupaEncontrada = {
  roupa: TipoRoupa;
  /** Pontuacao de texto, para quem quiser reordenar depois (ver `ordenar-por-estilo`). */
  pontuacaoTexto: number;
};

/**
 * Filtra e ordena o catalogo.
 *
 * A ordenacao aqui e so por texto. Quem coloca o gosto da usuaria na frente e
 * o algoritmo de estilo, num passo separado — assim da para testar "a busca
 * achou a peca certa?" sem que o perfil aprendido interfira no resultado.
 */
export function buscarRoupas(
  filtro: FiltroRoupas = {},
  catalogo: readonly TipoRoupa[] = CATALOGO_ROUPAS,
): RoupaEncontrada[] {
  const termo = filtro.texto ?? '';

  const encontradas: RoupaEncontrada[] = [];

  for (const roupa of catalogo) {
    if (!passaNosFiltros(roupa, filtro)) continue;

    const pontuacaoTexto = pontuarTexto(roupa, termo);
    if (pontuacaoTexto === 0) continue;

    encontradas.push({ roupa, pontuacaoTexto });
  }

  // Empate resolvido pelo nome: sem isto, duas buscas iguais poderiam
  // devolver ordens diferentes e a lista "pularia" sem motivo aparente.
  return encontradas.sort(
    (a, b) =>
      b.pontuacaoTexto - a.pontuacaoTexto || a.roupa.nome.localeCompare(b.roupa.nome, 'pt-BR'),
  );
}

/** Busca uma peca pelo id. Devolve null quando o id nao existe mais. */
export function buscarRoupaPorId(
  id: string,
  catalogo: readonly TipoRoupa[] = CATALOGO_ROUPAS,
): TipoRoupa | null {
  return catalogo.find((roupa) => roupa.id === id) ?? null;
}
