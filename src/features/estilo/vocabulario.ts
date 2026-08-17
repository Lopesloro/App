/**
 * Vocabulario de moda do app — as palavras com que descrevemos uma peca.
 *
 * Fica isolado, sem depender de nada, porque tres partes precisam concordar
 * exatamente nos mesmos termos:
 *
 * 1. o catalogo, que classifica cada tipo de roupa;
 * 2. a busca, que filtra por eles;
 * 3. o algoritmo de estilo, que aprende um peso para cada um.
 *
 * Se cada parte tivesse a propria lista, o algoritmo aprenderia sobre
 * "romantico" enquanto o catalogo dissesse "romantica", e o perfil da usuaria
 * ficaria cheio de pesos que nunca combinam com nada.
 *
 * REGRA: so acrescentar termo no fim da lista. Remover ou renomear invalida o
 * perfil ja aprendido no aparelho das usuarias — ver `migrarPerfil` em
 * `perfil-estilo.ts`.
 */

/** Como a peca se parece — a dimensao que o algoritmo mais usa. */
export const ESTILOS = [
  'classico',
  'moderno',
  'romantico',
  'esportivo',
  'boho',
  'minimalista',
  'streetwear',
] as const;

export type Estilo = (typeof ESTILOS)[number];

/** Para onde a pessoa vai vestindo a peca. */
export const OCASIOES = [
  'trabalho',
  'casual',
  'festa',
  'encontro',
  'academia',
  'praia',
] as const;

export type Ocasiao = (typeof OCASIOES)[number];

/**
 * Estacao. "Meia-estacao" existe porque o Brasil quase nao tem inverno de
 * verdade: a maior parte do pais veste peca de meia-estacao o ano inteiro, e
 * um catalogo so com verao/inverno empurraria a usuaria para os extremos.
 */
export const ESTACOES = ['verao', 'meia-estacao', 'inverno'] as const;

export type Estacao = (typeof ESTACOES)[number];

/** Como a peca veste o corpo. */
export const CAIMENTOS = ['justo', 'reto', 'solto', 'oversized'] as const;

export type Caimento = (typeof CAIMENTOS)[number];

/** Onde a peca entra no corpo — organiza o guarda-roupa. */
export const CATEGORIAS = [
  'parte-de-cima',
  'parte-de-baixo',
  'vestido',
  'sobreposicao',
  'calcado',
  'bolsa',
  'acessorio',
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

/**
 * Rotulos em pt-BR. Os identificadores acima sao sem acento de proposito
 * (viram chave de armazenamento e nome de arquivo); o que a usuaria le sai
 * daqui, escrito direito.
 */
export const ROTULO_CATEGORIA: Record<Categoria, string> = {
  'parte-de-cima': 'Parte de cima',
  'parte-de-baixo': 'Parte de baixo',
  vestido: 'Vestidos e macacões',
  sobreposicao: 'Casacos e sobreposições',
  calcado: 'Calçados',
  bolsa: 'Bolsas',
  acessorio: 'Acessórios',
};

export const ROTULO_ESTILO: Record<Estilo, string> = {
  classico: 'Clássico',
  moderno: 'Moderno',
  romantico: 'Romântico',
  esportivo: 'Esportivo',
  boho: 'Boho',
  minimalista: 'Minimalista',
  streetwear: 'Streetwear',
};

export const ROTULO_OCASIAO: Record<Ocasiao, string> = {
  trabalho: 'Trabalho',
  casual: 'Casual',
  festa: 'Festa',
  encontro: 'Encontro',
  academia: 'Academia',
  praia: 'Praia',
};

export const ROTULO_ESTACAO: Record<Estacao, string> = {
  verao: 'Verão',
  'meia-estacao': 'Meia-estação',
  inverno: 'Inverno',
};

export const ROTULO_CAIMENTO: Record<Caimento, string> = {
  justo: 'Justo',
  reto: 'Reto',
  solto: 'Solto',
  oversized: 'Oversized',
};

/**
 * Ordem em que as categorias aparecem na tela — de cima para baixo do corpo,
 * como qualquer pessoa organiza um armario de verdade.
 */
export const ORDEM_CATEGORIAS: readonly Categoria[] = CATEGORIAS;
