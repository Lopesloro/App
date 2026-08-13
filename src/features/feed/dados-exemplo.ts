import type { Look } from './tipos';

/**
 * Looks de exemplo para desenvolver e demonstrar o app antes da API existir.
 *
 * As pecas trazem categoria, cor e tamanho — e com isso o app DESENHA o look
 * (ver `IlustracaoLook`). Nao dependemos de foto de catalogo, que exigiria
 * licenca de imagem de cada marca, nem de servico externo que sai do ar.
 * Quando a curadoria tiver fotos licenciadas, `fotoUrl` passa a valer e o
 * desenho vira so o estado de carregamento.
 *
 * Sem marca e sem preco de proposito: nada e vendido no app por enquanto.
 */
export const LOOKS_EXEMPLO: Look[] = [
  {
    id: 'look-001',
    titulo: 'Alfaiataria leve para o escritório',
    ocasiao: 'trabalho',
    estilo: 'classico',
    fotoUrl: null,
    blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
    geradoPorIa: false,
    pecas: [
      { id: 'p-001', nome: 'Blazer de alfaiataria', categoria: 'blazer', cor: 'bege', tamanho: 'M' },
      { id: 'p-002', nome: 'Calça wide leg', categoria: 'calca', cor: 'preto', tamanho: '40' },
      { id: 'p-003', nome: 'Mule bico fino', categoria: 'sapato', cor: 'preto', tamanho: '37' },
    ],
  },
  {
    id: 'look-002',
    titulo: 'Jeans e camisa para sexta casual',
    ocasiao: 'casual',
    estilo: 'moderno',
    fotoUrl: null,
    blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
    geradoPorIa: false,
    pecas: [
      { id: 'p-004', nome: 'Camisa de linho', categoria: 'camisa', cor: 'branco', tamanho: 'M' },
      { id: 'p-005', nome: 'Jeans reto', categoria: 'calca', cor: 'azul', tamanho: '40' },
      { id: 'p-006', nome: 'Tênis branco', categoria: 'sapato', cor: 'branco', tamanho: '37' },
    ],
  },
  {
    id: 'look-003',
    titulo: 'Vestido fluido para casamento de dia',
    ocasiao: 'festa',
    estilo: 'romantico',
    fotoUrl: null,
    blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH',
    geradoPorIa: true,
    pecas: [
      { id: 'p-007', nome: 'Vestido midi de cetim', categoria: 'vestido', cor: 'rosa', tamanho: 'M' },
      { id: 'p-008', nome: 'Sandália de tira fina', categoria: 'sapato', cor: 'bege', tamanho: '37' },
      { id: 'p-020', nome: 'Bolsa pequena', categoria: 'bolsa', cor: 'bege', tamanho: 'Único' },
    ],
  },
  {
    id: 'look-004',
    titulo: 'Preto e dourado para jantar',
    ocasiao: 'encontro',
    estilo: 'moderno',
    fotoUrl: null,
    blurhash: 'L03[?[t7fQt7~qofayof9Ffk?bj[',
    geradoPorIa: true,
    pecas: [
      { id: 'p-009', nome: 'Blusa de malha canelada', categoria: 'blusa', cor: 'preto', tamanho: 'P' },
      { id: 'p-010', nome: 'Saia lápis', categoria: 'saia', cor: 'preto', tamanho: '38' },
      { id: 'p-021', nome: 'Colar dourado', categoria: 'acessorio', cor: 'amarelo', tamanho: 'Único' },
    ],
  },
  {
    id: 'look-005',
    titulo: 'Conforto para o treino da manhã',
    ocasiao: 'academia',
    estilo: 'esportivo',
    fotoUrl: null,
    blurhash: 'LNAdApj[00aymkj[?bj[D%ayt7of',
    geradoPorIa: false,
    pecas: [
      { id: 'p-011', nome: 'Camiseta de treino', categoria: 'camiseta', cor: 'cinza', tamanho: 'P' },
      { id: 'p-012', nome: 'Legging cintura alta', categoria: 'calca', cor: 'preto', tamanho: '38' },
      { id: 'p-022', nome: 'Tênis de corrida', categoria: 'sapato', cor: 'branco', tamanho: '37' },
    ],
  },
  {
    id: 'look-006',
    titulo: 'Linho e palha para o fim de semana',
    ocasiao: 'praia',
    estilo: 'boho',
    fotoUrl: null,
    blurhash: 'LlMF%n00%#MwS|WCWEM{R*bbWBbH',
    geradoPorIa: false,
    pecas: [
      { id: 'p-013', nome: 'Saída de praia', categoria: 'vestido', cor: 'branco', tamanho: 'M' },
      { id: 'p-014', nome: 'Bolsa de palha', categoria: 'bolsa', cor: 'amarelo', tamanho: 'Único' },
      { id: 'p-023', nome: 'Rasteirinha', categoria: 'sapato', cor: 'bege', tamanho: '37' },
    ],
  },
  {
    id: 'look-007',
    titulo: 'Tricô e trench para dia frio',
    ocasiao: 'trabalho',
    estilo: 'classico',
    fotoUrl: null,
    blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.',
    geradoPorIa: false,
    pecas: [
      { id: 'p-015', nome: 'Tricô gola alta', categoria: 'blusa', cor: 'bege', tamanho: 'M' },
      { id: 'p-016', nome: 'Trench coat', categoria: 'casaco', cor: 'bege', tamanho: 'M' },
      { id: 'p-017', nome: 'Bota de cano curto', categoria: 'sapato', cor: 'marrom', tamanho: '37' },
    ],
  },
  {
    id: 'look-008',
    titulo: 'Slip dress com jaqueta jeans',
    ocasiao: 'encontro',
    estilo: 'romantico',
    fotoUrl: null,
    blurhash: 'LTI};?WB00of%MayIUj[00fQ~qay',
    geradoPorIa: true,
    pecas: [
      { id: 'p-018', nome: 'Slip dress acetinado', categoria: 'vestido', cor: 'verde', tamanho: 'M' },
      { id: 'p-019', nome: 'Jaqueta jeans oversized', categoria: 'jaqueta', cor: 'azul', tamanho: 'G' },
      { id: 'p-024', nome: 'Tênis branco', categoria: 'sapato', cor: 'branco', tamanho: '37' },
    ],
  },
];
