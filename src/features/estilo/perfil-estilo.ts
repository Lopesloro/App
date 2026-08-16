import type { TipoRoupa } from '@/features/roupas/tipos';
import {
  CAIMENTOS,
  CATEGORIAS,
  ESTACOES,
  ESTILOS,
  OCASIOES,
  ROTULO_CAIMENTO,
  ROTULO_ESTILO,
  ROTULO_OCASIAO,
  type Caimento,
  type Categoria,
  type Estacao,
  type Estilo,
  type Ocasiao,
} from './vocabulario';

/**
 * O algoritmo de estilo: como o app aprende o gosto de quem usa.
 *
 * ## O que ele faz, em uma frase
 *
 * Cada peca que a usuaria coloca no guarda-roupa e um voto nos atributos
 * dessa peca (estilo, caimento, ocasiao, categoria, estacao). O perfil e a
 * soma desses votos ao longo do tempo, e serve para ordenar o catalogo
 * colocando na frente o que se parece com o que ela ja escolheu.
 *
 * ## Por que assim, e nao com um modelo grande
 *
 * 1. **Roda no aparelho.** Nenhum dado de gosto sai do celular. Nao existe
 *    servidor guardando "o que a Ana gosta de vestir" — o que e privacidade
 *    de verdade, e nao promessa (docs/06-seguranca.md). Tambem significa que
 *    o app funciona no aviao, no metro e sem backend nenhum.
 * 2. **Cabe em pouco dado.** Um recomendador de matriz precisa de milhares
 *    de usuarias antes de acertar. Este acerta a partir da terceira peca,
 *    porque nao aprende sobre "quem se parece com voce", e sim sobre "o que
 *    voce escolheu".
 * 3. **Da para explicar.** Cada recomendacao vira uma frase em portugues
 *    ("porque voce vem escolhendo peca classica de caimento reto"). Um
 *    modelo opaco nao consegue isso, e num app de moda a usuaria precisa
 *    entender o motivo para confiar.
 *
 * ## Como cada voto entra
 *
 * peso ← peso + TAXA × sinal × (1 − |peso|)
 *
 * O termo `(1 − |peso|)` e o coracao da regra: quanto mais o app ja acredita
 * numa coisa, menos cada novo voto muda aquilo. Sem ele, dez pecas boho
 * seguidas empurrariam o peso ao infinito e nenhuma evidencia contraria
 * conseguiria trazer de volta — o perfil ficaria preso.
 *
 * ## Como o gosto muda de ideia
 *
 * A cada interacao, os atributos NAO envolvidos encolhem um pouco
 * (`DECAIMENTO`). Quem passou o inverno guardando tricô e no verao comeca a
 * guardar linho ve o perfil acompanhar em algumas semanas, em vez de carregar
 * para sempre a decisao de marco.
 *
 * ## Quando ele fica quieto
 *
 * Com poucas interacoes a `confianca` e baixa, e o ranqueamento quase nao
 * muda a ordem. Fingir que conhece alguem depois de dois toques e a forma
 * mais rapida de perder a confianca da usuaria.
 */

/**
 * Versao do formato do perfil.
 *
 * Sobe quando a estrutura muda de um jeito que o perfil antigo nao aproveita.
 * Perfil de versao diferente e descartado em vez de remendado: um peso lido
 * na chave errada e pior do que comecar do zero.
 */
export const VERSAO_PERFIL = 1;

/** Quanto cada voto move o peso. Alto demais oscila; baixo demais nao aprende. */
export const TAXA_APRENDIZADO = 0.35;

/** Quanto os atributos nao votados encolhem por interacao. */
export const DECAIMENTO = 0.02;

/** Interacoes ate o app confiar plenamente no que aprendeu. */
export const INTERACOES_PARA_CONFIAR = 8;

/**
 * Peso de cada dimensao na afinidade.
 *
 * Estilo pesa mais porque e o que a pessoa percebe primeiro numa roupa.
 * Estacao pesa pouco porque diz mais sobre o mes do que sobre o gosto.
 * Somam 1.
 */
export const PESO_DIMENSAO = {
  estilo: 0.45,
  caimento: 0.2,
  ocasiao: 0.2,
  categoria: 0.1,
  estacao: 0.05,
} as const;

export type SinalEstilo = 'guardou' | 'removeu' | 'descartou';

/**
 * Forca de cada sinal.
 *
 * Guardar vale o dobro de remover de proposito: guardar e uma escolha
 * deliberada, enquanto remover costuma ser correcao de toque errado ou
 * faxina de armario — punir os dois igual ensinaria o app a desaprender por
 * motivo errado.
 */
export const FORCA_SINAL: Record<SinalEstilo, number> = {
  guardou: 1,
  removeu: -0.5,
  descartou: -0.8,
};

export type PesosPorEstilo = Record<Estilo, number>;
export type PesosPorCategoria = Record<Categoria, number>;
export type PesosPorOcasiao = Record<Ocasiao, number>;
export type PesosPorCaimento = Record<Caimento, number>;
export type PesosPorEstacao = Record<Estacao, number>;

export type PerfilEstilo = {
  versao: number;
  estilos: PesosPorEstilo;
  categorias: PesosPorCategoria;
  ocasioes: PesosPorOcasiao;
  caimentos: PesosPorCaimento;
  estacoes: PesosPorEstacao;
  /** Quantos votos o perfil ja recebeu. Base da confianca. */
  interacoes: number;
  atualizadoEm: number;
};

function zerados<T extends string>(chaves: readonly T[]): Record<T, number> {
  return Object.fromEntries(chaves.map((chave) => [chave, 0])) as Record<T, number>;
}

/**
 * Perfil de quem acabou de instalar o app.
 *
 * Tudo em zero = nenhuma opiniao. Nao inventamos um estilo inicial "medio":
 * comecar chutando faz o app recomendar errado com confianca, que e pior do
 * que recomendar na ordem do catalogo.
 */
export function perfilVazio(agora = Date.now()): PerfilEstilo {
  return {
    versao: VERSAO_PERFIL,
    estilos: zerados(ESTILOS),
    categorias: zerados(CATEGORIAS),
    ocasioes: zerados(OCASIOES),
    caimentos: zerados(CAIMENTOS),
    estacoes: zerados(ESTACOES),
    interacoes: 0,
    atualizadoEm: agora,
  };
}

/** Move um peso na direcao do sinal, com retorno decrescente. */
function moverPeso(pesoAtual: number, sinal: number): number {
  const movimento = TAXA_APRENDIZADO * sinal * (1 - Math.abs(pesoAtual));
  const novo = pesoAtual + movimento;
  // A regra ja segura o valor, mas arredondamento acumulado pode passar de
  // 1 por uma fracao. O limite explicito garante a faixa em qualquer caso.
  return Math.min(1, Math.max(-1, novo));
}

/**
 * Aplica um voto a uma dimensao.
 *
 * O sinal e dividido pelo numero de valores que a peca carrega naquela
 * dimensao: a peca vale um voto, e nao um voto por etiqueta. Sem isso, uma
 * peca marcada com tres estilos ensinaria tres vezes mais que uma de estilo
 * unico, so por ser mais dificil de classificar.
 */
function votarNaDimensao<T extends string>(
  pesos: Record<T, number>,
  valores: readonly T[],
  sinal: number,
): Record<T, number> {
  const votados = new Set<string>(valores);
  const sinalPorValor = valores.length > 0 ? sinal / valores.length : 0;

  const saida = { ...pesos };
  for (const chave of Object.keys(saida) as T[]) {
    saida[chave] = votados.has(chave)
      ? moverPeso(saida[chave], sinalPorValor)
      : // Quem nao foi votado encolhe: e assim que o perfil acompanha
        // mudanca de gosto em vez de guardar rancor da escolha de marco.
        saida[chave] * (1 - DECAIMENTO);
  }
  return saida;
}

/** Aprende com uma peca. Devolve um perfil novo — o original nao muda. */
export function aprender(
  perfil: PerfilEstilo,
  roupa: TipoRoupa,
  sinal: SinalEstilo,
  agora = Date.now(),
): PerfilEstilo {
  const forca = FORCA_SINAL[sinal];

  return {
    ...perfil,
    estilos: votarNaDimensao(perfil.estilos, roupa.estilos, forca),
    categorias: votarNaDimensao(perfil.categorias, [roupa.categoria], forca),
    ocasioes: votarNaDimensao(perfil.ocasioes, roupa.ocasioes, forca),
    caimentos: votarNaDimensao(perfil.caimentos, [roupa.caimento], forca),
    estacoes: votarNaDimensao(perfil.estacoes, roupa.estacoes, forca),
    interacoes: perfil.interacoes + 1,
    atualizadoEm: agora,
  };
}

/** Media dos pesos que a peca carrega nesta dimensao. Faixa: -1 a 1. */
function mediaDosPesos<T extends string>(
  pesos: Record<T, number>,
  valores: readonly T[],
): number {
  if (valores.length === 0) return 0;
  const soma = valores.reduce((total, valor) => total + (pesos[valor] ?? 0), 0);
  return soma / valores.length;
}

/**
 * Quanto a peca combina com o perfil. Faixa: 0 (nada) a 1 (muito).
 *
 * Meio (0,5) e o valor de quem nao sabe: perfil vazio devolve 0,5 para tudo,
 * e nao um numero qualquer que a tela mostraria como se fosse opiniao.
 */
export function afinidade(perfil: PerfilEstilo, roupa: TipoRoupa): number {
  const bruto =
    PESO_DIMENSAO.estilo * mediaDosPesos(perfil.estilos, roupa.estilos) +
    PESO_DIMENSAO.caimento * mediaDosPesos(perfil.caimentos, [roupa.caimento]) +
    PESO_DIMENSAO.ocasiao * mediaDosPesos(perfil.ocasioes, roupa.ocasioes) +
    PESO_DIMENSAO.categoria * mediaDosPesos(perfil.categorias, [roupa.categoria]) +
    PESO_DIMENSAO.estacao * mediaDosPesos(perfil.estacoes, roupa.estacoes);

  // De [-1, 1] para [0, 1].
  return (bruto + 1) / 2;
}

/**
 * Quanto o app confia no que aprendeu. Faixa: 0 a 1.
 *
 * Cresce com o numero de interacoes e satura. Quem usa a confianca e o
 * ranqueamento: com pouca, a ordem quase nao muda.
 */
export function confianca(perfil: PerfilEstilo): number {
  return Math.min(1, perfil.interacoes / INTERACOES_PARA_CONFIAR);
}

export type PesoNomeado<T extends string> = { valor: T; peso: number };

function maiorPeso<T extends string>(
  pesos: Record<T, number>,
  minimo = 0.15,
): PesoNomeado<T> | null {
  let melhor: PesoNomeado<T> | null = null;

  for (const chave of Object.keys(pesos) as T[]) {
    const peso = pesos[chave];
    if (peso < minimo) continue;
    if (!melhor || peso > melhor.peso) melhor = { valor: chave, peso };
  }

  return melhor;
}

/**
 * O estilo mais forte do perfil, ou null quando ainda nao da para dizer.
 *
 * `null` e resposta legitima e comum no comeco. A tela precisa lidar com ele
 * mostrando "ainda estamos aprendendo", e nao um estilo escolhido no chute.
 */
export function estiloDominante(perfil: PerfilEstilo): PesoNomeado<Estilo> | null {
  if (confianca(perfil) < 0.5) return null;
  return maiorPeso(perfil.estilos);
}

export function caimentoPreferido(perfil: PerfilEstilo): PesoNomeado<Caimento> | null {
  if (confianca(perfil) < 0.5) return null;
  return maiorPeso(perfil.caimentos);
}

export function ocasiaoPrincipal(perfil: PerfilEstilo): PesoNomeado<Ocasiao> | null {
  if (confianca(perfil) < 0.5) return null;
  return maiorPeso(perfil.ocasioes);
}

/**
 * Frase que explica por que a peca esta sendo sugerida.
 *
 * Devolve `null` quando nao ha motivo honesto para dar. Inventar explicacao
 * ("achamos que voce vai gostar") ensina a usuaria a ignorar o texto.
 */
export function explicarAfinidade(
  perfil: PerfilEstilo,
  roupa: TipoRoupa,
): string | null {
  if (confianca(perfil) < 0.5) return null;

  const estilo = estiloDominante(perfil);
  const caimento = caimentoPreferido(perfil);

  const combinaNoEstilo = estilo && roupa.estilos.includes(estilo.valor);
  const combinaNoCaimento = caimento && roupa.caimento === caimento.valor;

  if (combinaNoEstilo && combinaNoCaimento) {
    return `Tem o ${ROTULO_ESTILO[estilo.valor].toLowerCase()} e o caimento ${ROTULO_CAIMENTO[
      caimento.valor
    ].toLowerCase()} que você vem escolhendo.`;
  }

  if (combinaNoEstilo) {
    return `Combina com o ${ROTULO_ESTILO[estilo.valor].toLowerCase()} que você vem escolhendo.`;
  }

  if (combinaNoCaimento) {
    return `Tem o caimento ${ROTULO_CAIMENTO[
      caimento.valor
    ].toLowerCase()} que você prefere.`;
  }

  const ocasiao = ocasiaoPrincipal(perfil);
  if (ocasiao && roupa.ocasioes.includes(ocasiao.valor)) {
    return `Serve para ${ROTULO_OCASIAO[ocasiao.valor].toLowerCase()}, que é o seu forte.`;
  }

  return null;
}

/** Resumo do perfil em uma frase, para a tela de perfil. */
export function resumirPerfil(perfil: PerfilEstilo): string {
  if (perfil.interacoes === 0) {
    return 'Ainda não sei nada sobre o seu estilo. Guarde algumas peças e eu começo a entender.';
  }

  const estilo = estiloDominante(perfil);
  if (!estilo) {
    const faltam = INTERACOES_PARA_CONFIAR - perfil.interacoes;
    return faltam > 0
      ? `Estou começando a entender. Mais ${faltam === 1 ? 'uma peça' : `${faltam} peças`} e já consigo te dizer o seu estilo.`
      : 'Você mistura bastante — não há um estilo que domine o seu guarda-roupa.';
  }

  const caimento = caimentoPreferido(perfil);
  const parteCaimento = caimento
    ? ` com caimento ${ROTULO_CAIMENTO[caimento.valor].toLowerCase()}`
    : '';

  return `Seu estilo puxa para o ${ROTULO_ESTILO[estilo.valor].toLowerCase()}${parteCaimento}.`;
}

/** Pesos ordenados do maior para o menor, para a tela mostrar a régua. */
export function ranking<T extends string>(pesos: Record<T, number>): PesoNomeado<T>[] {
  return (Object.keys(pesos) as T[])
    .map((valor) => ({ valor, peso: pesos[valor] }))
    .sort((a, b) => b.peso - a.peso || a.valor.localeCompare(b.valor));
}

/**
 * Le um perfil vindo do aparelho, aceitando so o que faz sentido.
 *
 * O arquivo pode ser de uma versao anterior, ter sido adulterado, ou ter sido
 * gravado antes de o vocabulario ganhar um termo novo. Em vez de confiar,
 * reconstruimos o perfil por cima de um vazio: chave que nao existe mais e
 * ignorada, chave nova entra em zero, e valor fora da faixa e descartado.
 */
export function migrarPerfil(bruto: unknown, agora = Date.now()): PerfilEstilo {
  const base = perfilVazio(agora);

  if (typeof bruto !== 'object' || bruto === null) return base;

  const dados = bruto as Partial<PerfilEstilo>;

  // Formato de outra versao: comecar limpo e mais honesto do que adivinhar
  // qual peso ia em qual chave.
  if (dados.versao !== VERSAO_PERFIL) return base;

  const copiar = <T extends string>(
    destino: Record<T, number>,
    origem: unknown,
  ): Record<T, number> => {
    if (typeof origem !== 'object' || origem === null) return destino;
    const valores = origem as Record<string, unknown>;
    const saida = { ...destino };

    for (const chave of Object.keys(saida) as T[]) {
      const valor = valores[chave];
      if (typeof valor === 'number' && Number.isFinite(valor)) {
        saida[chave] = Math.min(1, Math.max(-1, valor));
      }
    }
    return saida;
  };

  const interacoes =
    typeof dados.interacoes === 'number' && Number.isFinite(dados.interacoes)
      ? Math.max(0, Math.floor(dados.interacoes))
      : 0;

  return {
    versao: VERSAO_PERFIL,
    estilos: copiar(base.estilos, dados.estilos),
    categorias: copiar(base.categorias, dados.categorias),
    ocasioes: copiar(base.ocasioes, dados.ocasioes),
    caimentos: copiar(base.caimentos, dados.caimentos),
    estacoes: copiar(base.estacoes, dados.estacoes),
    interacoes,
    atualizadoEm:
      typeof dados.atualizadoEm === 'number' && Number.isFinite(dados.atualizadoEm)
        ? dados.atualizadoEm
        : agora,
  };
}
