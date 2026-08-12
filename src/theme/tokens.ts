/**
 * Design tokens — fonte unica de verdade de cor, tipografia e espacamento.
 *
 * Duas direcoes esteticas foram propostas em docs/05-frontend.md secao 5.
 * A escolha final depende de teste com 5-8 usuarias-alvo (docs/08-plano-de-testes.md),
 * por isso as duas ficam versionadas aqui e so a constante `paleta` muda.
 */

export const EDITORIAL_AREIA = {
  bg: '#FAF7F2',
  surface: '#FFFFFF',
  ink: '#1C1A17',
  inkSoft: '#6E675E',
  primary: '#A65A3F',
  primarySoft: '#EAD9CF',
  accent: '#3E4A3D',
  gold: '#B8975A',
  danger: '#B3442E',
  border: '#E7DFD5',
} as const;

export const VINHO_MODERNO = {
  bg: '#F7F1EE',
  surface: '#FFFFFF',
  ink: '#2A161D',
  inkSoft: '#7A6067',
  primary: '#7A1E3C',
  primarySoft: '#F0D8DE',
  accent: '#D98E73',
  gold: '#C6A15B',
  danger: '#C03A2B',
  border: '#EADCD9',
} as const;

/**
 * Forma de uma paleta. Tipo estrutural (string), nao literal: as duas
 * direcoes precisam ser intercambiaveis em tempo de execucao.
 */
export type Paleta = {
  readonly bg: string;
  readonly surface: string;
  readonly ink: string;
  readonly inkSoft: string;
  readonly primary: string;
  readonly primarySoft: string;
  readonly accent: string;
  readonly gold: string;
  readonly danger: string;
  readonly border: string;
};

/**
 * Paleta padrao para uso FORA de componente (constantes de modulo).
 * Dentro de componente, use `usePaleta()` — so ele acompanha a troca de tema.
 */
export const paleta: Paleta = EDITORIAL_AREIA;

/** Escala de espacamento em multiplos de 4 (docs/05-frontend.md). */
export const espaco = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const raio = {
  card: 16,
  chip: 999,
  botao: 12,
} as const;

/** Escala tipografica. Familias reais entram junto com as fontes (issue de design). */
export const tipografia = {
  displayGrande: { fontSize: 32, lineHeight: 38, fontWeight: '600' },
  display: { fontSize: 24, lineHeight: 30, fontWeight: '600' },
  titulo: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  corpo: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  corpoPequeno: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  legenda: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
} as const;

/** Proporcao padrao das fotos de look (retrato de moda). */
export const PROPORCAO_FOTO = 3 / 4;
