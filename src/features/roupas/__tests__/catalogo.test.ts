import { CATEGORIAS } from '@/features/estilo/vocabulario';
import { CATALOGO_ROUPAS } from '../catalogo';
import { agruparPorCategoria, catalogoSchema, matizDaRoupa } from '../tipos';

describe('integridade do catalogo', () => {
  it('todo item passa pelo schema', () => {
    expect(() => catalogoSchema.parse(CATALOGO_ROUPAS)).not.toThrow();
  });

  it('nao ha id repetido', () => {
    const ids = CATALOGO_ROUPAS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('nao ha nome repetido', () => {
    const nomes = CATALOGO_ROUPAS.map((r) => r.nome);
    expect(new Set(nomes).size).toBe(nomes.length);
  });

  it('nenhum item vende nada: sem preco, sem marca, sem link', () => {
    // Guarda da decisao do fundador: o catalogo e vocabulario de moda, nao
    // vitrine. Se alguem colar um produto de loja aqui, o teste avisa.
    //
    // A checagem e nos CAMPOS, e nao no texto: a palavra "marca" aparece
    // legitimamente em descricao ("marca a cintura"), e proibir a palavra
    // proibiria escrever sobre roupa.
    const camposProibidos = ['marca', 'preco', 'precoCentavos', 'urlLoja', 'sku'];

    for (const roupa of CATALOGO_ROUPAS) {
      for (const campo of camposProibidos) {
        expect(Object.keys(roupa)).not.toContain(campo);
      }
    }

    expect(JSON.stringify(CATALOGO_ROUPAS)).not.toContain('http');
  });

  it('cobre todas as categorias', () => {
    const presentes = new Set(CATALOGO_ROUPAS.map((r) => r.categoria));
    for (const categoria of CATEGORIAS) {
      expect(presentes).toContain(categoria);
    }
  });

  it('tem peca suficiente para montar um guarda-roupa de verdade', () => {
    // Abaixo disto a usuaria acaba o catalogo antes de terminar o armario
    // dela, e o algoritmo de estilo nao tem o que ranquear.
    expect(CATALOGO_ROUPAS.length).toBeGreaterThanOrEqual(50);
  });

  it('nenhuma peca e classificada como tudo ao mesmo tempo', () => {
    // Peca marcada com todos os estilos nao ensina nada ao algoritmo: ela
    // combina igualmente com qualquer perfil e vira ruido no ranqueamento.
    for (const roupa of CATALOGO_ROUPAS) {
      expect(roupa.estilos.length).toBeLessThanOrEqual(3);
      expect(roupa.ocasioes.length).toBeLessThanOrEqual(4);
    }
  });

  it('nenhuma peca fica sem sinonimo E sem descricao util', () => {
    for (const roupa of CATALOGO_ROUPAS) {
      expect(roupa.descricao.length).toBeGreaterThan(20);
    }
  });
});

describe('matiz da peca', () => {
  it('a mesma peca tem sempre a mesma cor', () => {
    expect(matizDaRoupa('camisa-social')).toBe(matizDaRoupa('camisa-social'));
  });

  it('fica dentro do circulo de cores', () => {
    for (const roupa of CATALOGO_ROUPAS) {
      const matiz = matizDaRoupa(roupa.id);
      expect(matiz).toBeGreaterThanOrEqual(0);
      expect(matiz).toBeLessThan(360);
    }
  });

  it('pecas diferentes nao caem quase todas na mesma cor', () => {
    const matizes = new Set(CATALOGO_ROUPAS.map((r) => matizDaRoupa(r.id)));
    expect(matizes.size).toBeGreaterThan(CATALOGO_ROUPAS.length / 2);
  });
});

describe('agrupar por categoria', () => {
  it('segue a ordem do corpo, de cima para baixo', () => {
    const grupos = agruparPorCategoria(CATALOGO_ROUPAS);
    const ordem = grupos.map((g) => g.categoria);

    expect(ordem[0]).toBe('parte-de-cima');
    expect(ordem[ordem.length - 1]).toBe('acessorio');
  });

  it('nao inventa grupo vazio', () => {
    const grupos = agruparPorCategoria(
      CATALOGO_ROUPAS.filter((r) => r.categoria === 'calcado'),
    );

    expect(grupos).toHaveLength(1);
    expect(grupos[0].categoria).toBe('calcado');
  });

  it('nao perde nem duplica peca', () => {
    const grupos = agruparPorCategoria(CATALOGO_ROUPAS);
    const total = grupos.reduce((soma, g) => soma + g.roupas.length, 0);

    expect(total).toBe(CATALOGO_ROUPAS.length);
  });

  it('lista vazia devolve nenhum grupo', () => {
    expect(agruparPorCategoria([])).toEqual([]);
  });
});
