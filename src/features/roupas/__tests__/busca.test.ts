import { CATALOGO_ROUPAS } from '../catalogo';
import {
  buscarRoupaPorId,
  buscarRoupas,
  normalizarTexto,
  passaNosFiltros,
  pontuarTexto,
} from '../busca';
import type { TipoRoupa } from '../tipos';

const ids = (resultado: ReturnType<typeof buscarRoupas>) =>
  resultado.map((r) => r.roupa.id);

describe('normalizar texto', () => {
  it('tira acento, que quase ninguem digita no celular', () => {
    expect(normalizarTexto('Sandália')).toBe('sandalia');
    expect(normalizarTexto('Calção')).toBe('calcao');
    expect(normalizarTexto('Tênis')).toBe('tenis');
    expect(normalizarTexto('Blusão')).toBe('blusao');
  });

  it('ignora caixa e espaco sobrando', () => {
    expect(normalizarTexto('  CAMISA   Social ')).toBe('camisa social');
  });

  it('nao quebra com texto vazio', () => {
    expect(normalizarTexto('')).toBe('');
    expect(normalizarTexto('   ')).toBe('');
  });
});

describe('busca por texto', () => {
  it('sem termo, devolve o catalogo inteiro', () => {
    expect(buscarRoupas()).toHaveLength(CATALOGO_ROUPAS.length);
  });

  it('acha a peca pelo nome', () => {
    expect(ids(buscarRoupas({ texto: 'camisa social' }))).toContain('camisa-social');
  });

  it('acha a peca escrita sem acento', () => {
    expect(ids(buscarRoupas({ texto: 'sandalia' }))).toContain('sandalia-tira-fina');
    expect(ids(buscarRoupas({ texto: 'trico' }))).toContain('trico-gola-alta');
  });

  it('acha pelo apelido que a pessoa usa de verdade', () => {
    expect(ids(buscarRoupas({ texto: 'rasteirinha' }))).toContain('rasteirinha');
    expect(ids(buscarRoupas({ texto: 'hoodie' }))).toContain('moletom-capuz');
    expect(ids(buscarRoupas({ texto: 'jumpsuit' }))).toContain('macacao-pantalona');
    expect(ids(buscarRoupas({ texto: 'crossbody' }))).toContain('bolsa-transversal');
  });

  it('acha por sensacao, nao so por nome de peca', () => {
    expect(ids(buscarRoupas({ texto: 'boho' })).length).toBeGreaterThan(2);
    expect(ids(buscarRoupas({ texto: 'academia' })).length).toBeGreaterThan(1);
  });

  it('mostra primeiro a peca cujo nome bate melhor', () => {
    const resultado = ids(buscarRoupas({ texto: 'camisa' }));

    // "Camisa jeans"/"Camisa polo" comecam com o termo; peca que so menciona
    // camisa na descricao vem depois de todas elas.
    expect(resultado[0]).toMatch(/^camisa-/);
    expect(resultado.indexOf('vestido-camisa')).toBeGreaterThan(
      resultado.indexOf('camisa-jeans'),
    );
  });

  it('termo que nao existe devolve lista vazia em vez de tudo', () => {
    expect(buscarRoupas({ texto: 'capacete de mergulho' })).toEqual([]);
  });

  it('a mesma busca devolve sempre a mesma ordem', () => {
    expect(ids(buscarRoupas({ texto: 'bolsa' }))).toEqual(
      ids(buscarRoupas({ texto: 'bolsa' })),
    );
  });
});

describe('filtros de chip', () => {
  it('filtra por categoria', () => {
    const resultado = buscarRoupas({ categoria: 'calcado' });

    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado.every((r) => r.roupa.categoria === 'calcado')).toBe(true);
  });

  it('filtra por estilo', () => {
    const resultado = buscarRoupas({ estilo: 'esportivo' });

    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado.every((r) => r.roupa.estilos.includes('esportivo'))).toBe(true);
  });

  it('filtra por ocasiao', () => {
    const resultado = buscarRoupas({ ocasiao: 'trabalho' });

    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado.every((r) => r.roupa.ocasioes.includes('trabalho'))).toBe(true);
  });

  it('filtra por estacao', () => {
    const resultado = buscarRoupas({ estacao: 'inverno' });

    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado.every((r) => r.roupa.estacoes.includes('inverno'))).toBe(true);
  });

  it('combina texto e filtro', () => {
    const resultado = buscarRoupas({ texto: 'calca', categoria: 'parte-de-baixo' });

    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado.every((r) => r.roupa.categoria === 'parte-de-baixo')).toBe(true);
  });

  it('combinacao sem resultado nao quebra', () => {
    expect(buscarRoupas({ categoria: 'calcado', ocasiao: 'academia', estacao: 'inverno' }))
      .toBeInstanceOf(Array);
  });
});

describe('pontuacao', () => {
  const peca: TipoRoupa = {
    id: 'teste-peca',
    nome: 'Camisa de teste',
    categoria: 'parte-de-cima',
    sinonimos: ['blusa de teste'],
    estilos: ['classico'],
    ocasioes: ['trabalho'],
    estacoes: ['verao'],
    caimento: 'reto',
    descricao: 'Peça usada apenas nos testes automatizados do aplicativo.',
  };

  it('nome exato vale mais que comeco de nome', () => {
    expect(pontuarTexto(peca, 'camisa de teste')).toBeGreaterThan(
      pontuarTexto(peca, 'camisa'),
    );
  });

  it('nome vale mais que sinonimo', () => {
    expect(pontuarTexto(peca, 'camisa')).toBeGreaterThan(pontuarTexto(peca, 'blusa'));
  });

  it('sinonimo vale mais que descricao', () => {
    expect(pontuarTexto(peca, 'blusa')).toBeGreaterThan(pontuarTexto(peca, 'automatizados'));
  });

  it('termo ausente vale zero', () => {
    expect(pontuarTexto(peca, 'guarda-chuva')).toBe(0);
  });

  it('sem termo, toda peca vale igual', () => {
    expect(pontuarTexto(peca, '')).toBe(1);
    expect(pontuarTexto(peca, '   ')).toBe(1);
  });
});

describe('passaNosFiltros', () => {
  it('sem filtro, tudo passa', () => {
    expect(CATALOGO_ROUPAS.every((r) => passaNosFiltros(r, {}))).toBe(true);
  });
});

describe('buscar por id', () => {
  it('acha a peca', () => {
    expect(buscarRoupaPorId('camisa-social')?.nome).toBe('Camisa social');
  });

  it('id que nao existe devolve null, e nao quebra a tela', () => {
    expect(buscarRoupaPorId('peca-que-nao-existe')).toBeNull();
  });
});
