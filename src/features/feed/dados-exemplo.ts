import type { Look } from './tipos';

/**
 * Looks de exemplo para desenvolver e demonstrar o app antes da API existir.
 *
 * As fotos ainda sao nulas de proposito: quem publica imagem e a curadoria
 * (issue #22), e inventar URL de foto aqui criaria dependencia de servico
 * externo que quebra sem aviso. Ate la o cartao mostra o blurhash, que ja da
 * a cor e o ritmo visual do feed.
 *
 * Marcas e faixas de preco seguem o varejo brasileiro real (docs/03-concorrentes.md).
 */
export const LOOKS_EXEMPLO: Look[] = [
  {
    id: 'look-001',
    titulo: 'Alfaiataria leve para o escritorio',
    ocasiao: 'trabalho',
    estilo: 'classico',
    fotoUrl: null,
    blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
    geradoPorIa: false,
    pecas: [
      { id: 'p-001', nome: 'Blazer de alfaiataria', marca: 'Renner', precoCentavos: 18990, urlLoja: 'https://www.lojasrenner.com.br/p/blazer-alfaiataria/1001' },
      { id: 'p-002', nome: 'Calca wide leg', marca: 'C&A', precoCentavos: 12990, urlLoja: 'https://www.cea.com.br/p/calca-wide-leg/1002' },
      { id: 'p-003', nome: 'Mule bico fino', marca: 'Arezzo', precoCentavos: 29990, urlLoja: 'https://www.arezzo.com.br/p/mule-bico-fino/1003' },
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
      { id: 'p-004', nome: 'Camisa de linho', marca: 'Hering', precoCentavos: 9990, urlLoja: 'https://www.hering.com.br/p/camisa-linho/1004' },
      { id: 'p-005', nome: 'Jeans reto', marca: 'Levis', precoCentavos: 34990, urlLoja: 'https://www.levi.com.br/p/jeans-reto/1005' },
      { id: 'p-006', nome: 'Tenis branco', marca: 'Vert', precoCentavos: 59990, urlLoja: null },
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
      { id: 'p-007', nome: 'Vestido midi de cetim', marca: 'Amaro', precoCentavos: 39990, urlLoja: 'https://www.amaro.com/p/vestido-midi-cetim/1007' },
      { id: 'p-008', nome: 'Sandalia de tira fina', marca: 'Schutz', precoCentavos: 44990, urlLoja: 'https://www.schutz.com.br/p/sandalia-tira-fina/1008' },
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
      { id: 'p-009', nome: 'Body de malha canelada', marca: 'Farm', precoCentavos: 21990, urlLoja: 'https://www.farmrio.com.br/p/body-canelado/1009' },
      { id: 'p-010', nome: 'Saia lapis', marca: 'Zara', precoCentavos: 25990, urlLoja: null },
    ],
  },
  {
    id: 'look-005',
    titulo: 'Conforto para o treino da manha',
    ocasiao: 'academia',
    estilo: 'esportivo',
    fotoUrl: null,
    blurhash: 'LNAdApj[00aymkj[?bj[D%ayt7of',
    geradoPorIa: false,
    pecas: [
      { id: 'p-011', nome: 'Top de sustentacao media', marca: 'Track&Field', precoCentavos: 15990, urlLoja: 'https://www.trackfield.com.br/p/top-sustentacao/1011' },
      { id: 'p-012', nome: 'Legging cintura alta', marca: 'Alto Giro', precoCentavos: 17990, urlLoja: 'https://www.altogiro.com.br/p/legging-cintura-alta/1012' },
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
      { id: 'p-013', nome: 'Saida de praia de croche', marca: 'Osklen', precoCentavos: 32990, urlLoja: null },
      { id: 'p-014', nome: 'Chapeu de palha', marca: 'Riachuelo', precoCentavos: 7990, urlLoja: null },
    ],
  },
  {
    id: 'look-007',
    titulo: 'Tricot e trench para dia frio',
    ocasiao: 'trabalho',
    estilo: 'classico',
    fotoUrl: null,
    blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.',
    geradoPorIa: false,
    pecas: [
      { id: 'p-015', nome: 'Tricot gola alta', marca: 'Renner', precoCentavos: 13990, urlLoja: 'https://www.lojasrenner.com.br/p/tricot-gola-alta/1015' },
      { id: 'p-016', nome: 'Trench coat', marca: 'Zara', precoCentavos: 49990, urlLoja: null },
      { id: 'p-017', nome: 'Bota de cano curto', marca: 'Arezzo', precoCentavos: 45990, urlLoja: null },
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
      { id: 'p-018', nome: 'Slip dress acetinado', marca: 'Amaro', precoCentavos: 27990, urlLoja: 'https://www.amaro.com/p/slip-dress/1018' },
      { id: 'p-019', nome: 'Jaqueta jeans oversized', marca: 'C&A', precoCentavos: 15990, urlLoja: null },
    ],
  },
];
