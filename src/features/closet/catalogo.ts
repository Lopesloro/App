import type { Categoria, CorPeca } from './tipos';

/**
 * Catalogo de pecas prontas para a usuaria adicionar ao closet SEM fotografar.
 *
 * Por que existe: fotografar 30 pecas antes de ver qualquer valor e o motivo
 * numero um de abandono nos apps concorrentes (docs/03-concorrentes.md).
 * Aqui ela monta um closet de partida em dois minutos tocando nas pecas
 * parecidas com as dela, e fotografa depois so o que for especial.
 *
 * Sao pecas genericas de guarda-roupa brasileiro — sem marca, sem preco, sem
 * link de compra. Nao e vitrine: e atalho de cadastro.
 */

export type ItemCatalogo = {
  id: string;
  nome: string;
  categoria: Categoria;
  cor: CorPeca;
  /** Agrupa na tela de escolha. */
  grupo: 'basicos' | 'trabalho' | 'sair' | 'conforto' | 'calcados' | 'complementos';
};

export const CATALOGO: readonly ItemCatalogo[] = [
  // Basicos — o que quase toda mulher tem
  { id: 'cat-001', nome: 'Camiseta branca', categoria: 'camiseta', cor: 'branco', grupo: 'basicos' },
  { id: 'cat-002', nome: 'Camiseta preta', categoria: 'camiseta', cor: 'preto', grupo: 'basicos' },
  { id: 'cat-003', nome: 'Camiseta cinza', categoria: 'camiseta', cor: 'cinza', grupo: 'basicos' },
  { id: 'cat-004', nome: 'Blusa de alcinha', categoria: 'blusa', cor: 'branco', grupo: 'basicos' },
  { id: 'cat-005', nome: 'Blusa de manga longa', categoria: 'blusa', cor: 'preto', grupo: 'basicos' },
  { id: 'cat-006', nome: 'Calça jeans escura', categoria: 'calca', cor: 'azul', grupo: 'basicos' },
  { id: 'cat-007', nome: 'Calça jeans clara', categoria: 'calca', cor: 'azul', grupo: 'basicos' },
  { id: 'cat-008', nome: 'Calça preta', categoria: 'calca', cor: 'preto', grupo: 'basicos' },
  { id: 'cat-009', nome: 'Jaqueta jeans', categoria: 'jaqueta', cor: 'azul', grupo: 'basicos' },
  { id: 'cat-010', nome: 'Cardigã bege', categoria: 'casaco', cor: 'bege', grupo: 'basicos' },

  // Trabalho
  { id: 'cat-011', nome: 'Camisa social branca', categoria: 'camisa', cor: 'branco', grupo: 'trabalho' },
  { id: 'cat-012', nome: 'Camisa de linho', categoria: 'camisa', cor: 'bege', grupo: 'trabalho' },
  { id: 'cat-013', nome: 'Blazer preto', categoria: 'blazer', cor: 'preto', grupo: 'trabalho' },
  { id: 'cat-014', nome: 'Blazer bege', categoria: 'blazer', cor: 'bege', grupo: 'trabalho' },
  { id: 'cat-015', nome: 'Calça de alfaiataria', categoria: 'calca', cor: 'preto', grupo: 'trabalho' },
  { id: 'cat-016', nome: 'Calça wide leg', categoria: 'calca', cor: 'bege', grupo: 'trabalho' },
  { id: 'cat-017', nome: 'Saia midi', categoria: 'saia', cor: 'preto', grupo: 'trabalho' },
  { id: 'cat-018', nome: 'Saia lápis', categoria: 'saia', cor: 'cinza', grupo: 'trabalho' },
  { id: 'cat-019', nome: 'Vestido chemise', categoria: 'vestido', cor: 'azul', grupo: 'trabalho' },

  // Sair
  { id: 'cat-020', nome: 'Vestido preto', categoria: 'vestido', cor: 'preto', grupo: 'sair' },
  { id: 'cat-021', nome: 'Vestido floral', categoria: 'vestido', cor: 'estampado', grupo: 'sair' },
  { id: 'cat-022', nome: 'Vestido vermelho', categoria: 'vestido', cor: 'vermelho', grupo: 'sair' },
  { id: 'cat-023', nome: 'Slip dress', categoria: 'vestido', cor: 'rosa', grupo: 'sair' },
  { id: 'cat-024', nome: 'Blusa de cetim', categoria: 'blusa', cor: 'verde', grupo: 'sair' },
  { id: 'cat-025', nome: 'Macacão preto', categoria: 'macacao', cor: 'preto', grupo: 'sair' },
  { id: 'cat-026', nome: 'Saia longa', categoria: 'saia', cor: 'estampado', grupo: 'sair' },
  { id: 'cat-027', nome: 'Casaco de alfaiataria', categoria: 'casaco', cor: 'marrom', grupo: 'sair' },

  // Conforto
  { id: 'cat-028', nome: 'Moletom', categoria: 'casaco', cor: 'cinza', grupo: 'conforto' },
  { id: 'cat-029', nome: 'Legging preta', categoria: 'calca', cor: 'preto', grupo: 'conforto' },
  { id: 'cat-030', nome: 'Short jeans', categoria: 'short', cor: 'azul', grupo: 'conforto' },
  { id: 'cat-031', nome: 'Short de moletom', categoria: 'short', cor: 'cinza', grupo: 'conforto' },
  { id: 'cat-032', nome: 'Camiseta oversized', categoria: 'camiseta', cor: 'bege', grupo: 'conforto' },
  { id: 'cat-033', nome: 'Vestido de malha', categoria: 'vestido', cor: 'cinza', grupo: 'conforto' },

  // Calcados
  { id: 'cat-034', nome: 'Tênis branco', categoria: 'sapato', cor: 'branco', grupo: 'calcados' },
  { id: 'cat-035', nome: 'Tênis preto', categoria: 'sapato', cor: 'preto', grupo: 'calcados' },
  { id: 'cat-036', nome: 'Sandália de tira', categoria: 'sapato', cor: 'bege', grupo: 'calcados' },
  { id: 'cat-037', nome: 'Scarpin preto', categoria: 'sapato', cor: 'preto', grupo: 'calcados' },
  { id: 'cat-038', nome: 'Bota de cano curto', categoria: 'sapato', cor: 'marrom', grupo: 'calcados' },
  { id: 'cat-039', nome: 'Rasteirinha', categoria: 'sapato', cor: 'bege', grupo: 'calcados' },
  { id: 'cat-040', nome: 'Mule', categoria: 'sapato', cor: 'preto', grupo: 'calcados' },

  // Complementos
  { id: 'cat-041', nome: 'Bolsa preta', categoria: 'bolsa', cor: 'preto', grupo: 'complementos' },
  { id: 'cat-042', nome: 'Bolsa bege', categoria: 'bolsa', cor: 'bege', grupo: 'complementos' },
  { id: 'cat-043', nome: 'Bolsa de palha', categoria: 'bolsa', cor: 'amarelo', grupo: 'complementos' },
  { id: 'cat-044', nome: 'Colar dourado', categoria: 'acessorio', cor: 'amarelo', grupo: 'complementos' },
  { id: 'cat-045', nome: 'Cinto marrom', categoria: 'acessorio', cor: 'marrom', grupo: 'complementos' },
  { id: 'cat-046', nome: 'Lenço estampado', categoria: 'acessorio', cor: 'estampado', grupo: 'complementos' },
] as const;

export const ROTULO_GRUPO: Record<ItemCatalogo['grupo'], string> = {
  basicos: 'Básicos do dia a dia',
  trabalho: 'Para trabalhar',
  sair: 'Para sair',
  conforto: 'Conforto e treino',
  calcados: 'Calçados',
  complementos: 'Bolsas e acessórios',
};

export const GRUPOS = [
  'basicos',
  'trabalho',
  'sair',
  'conforto',
  'calcados',
  'complementos',
] as const;

export function itensDoGrupo(grupo: ItemCatalogo['grupo']): ItemCatalogo[] {
  return CATALOGO.filter((i) => i.grupo === grupo);
}

export function buscarItemCatalogo(id: string): ItemCatalogo | null {
  return CATALOGO.find((i) => i.id === id) ?? null;
}
