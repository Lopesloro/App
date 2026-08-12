import { EDITORIAL_AREIA, VINHO_MODERNO, type Paleta } from './tokens';

/**
 * Os dois fronts (direcoes esteticas) do app, lado a lado.
 *
 * docs/05-frontend.md propos duas direcoes e deixou a escolha para um teste
 * de preferencia com 5-8 usuarias-alvo. Em vez de escolher no escuro, as
 * duas estao implementadas e trocaveis dentro do app: a usuaria (ou o
 * fundador, no teste) ve as duas no proprio celular e decide.
 *
 * Quando a direcao for escolhida, sobra apagar a outra entrada daqui — os
 * componentes leem sempre `useTema()`, nunca uma paleta fixa.
 */

export type IdTema = 'editorial-areia' | 'vinho-moderno';

export type Tema = {
  id: IdTema;
  nome: string;
  /** Como a direcao deve ser percebida — usado na tela de escolha. */
  descricao: string;
  paleta: Paleta;
  /** Raios de borda: cada direcao tem uma "dureza" propria. */
  raio: { card: number; chip: number; botao: number };
};

export const TEMAS: Record<IdTema, Tema> = {
  'editorial-areia': {
    id: 'editorial-areia',
    nome: 'Editorial Areia',
    descricao: 'Revista de moda, luz natural, tons quentes de linho e terracota.',
    paleta: EDITORIAL_AREIA,
    // Cantos mais suaves: reforca a sensacao calma e editorial.
    raio: { card: 16, chip: 999, botao: 12 },
  },
  'vinho-moderno': {
    id: 'vinho-moderno',
    nome: 'Vinho Moderno',
    descricao: 'Vitrine noturna, contraste alto, burgundy e coral.',
    paleta: VINHO_MODERNO,
    // Cantos mais secos: leitura urbana e mais grafica.
    raio: { card: 10, chip: 999, botao: 8 },
  },
};

export const TEMA_PADRAO: IdTema = 'editorial-areia';

export const LISTA_TEMAS: Tema[] = Object.values(TEMAS);

export function ehIdTema(valor: unknown): valor is IdTema {
  return typeof valor === 'string' && valor in TEMAS;
}
