import { buscarItemCatalogo, CATALOGO, GRUPOS, itensDoGrupo, ROTULO_GRUPO } from '../catalogo';
import {
  CATEGORIAS,
  PARTE_DA_CATEGORIA,
  tamanhosDaCategoria,
  TAMANHO_UNICO,
} from '../tipos';

describe('catalogo de pecas prontas', () => {
  it('tem peca suficiente para montar um closet de partida', () => {
    // Menos que isso e a usuaria nao encontra nada parecido com o dela.
    expect(CATALOGO.length).toBeGreaterThanOrEqual(40);
  });

  it('nao repete id', () => {
    const ids = CATALOGO.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('todo grupo tem pelo menos 3 pecas', () => {
    for (const grupo of GRUPOS) {
      expect(itensDoGrupo(grupo).length).toBeGreaterThanOrEqual(3);
    }
  });

  it('todo grupo tem rotulo em portugues', () => {
    for (const grupo of GRUPOS) {
      expect(ROTULO_GRUPO[grupo]).toBeTruthy();
    }
  });

  it('toda peca cai em um grupo conhecido', () => {
    for (const item of CATALOGO) {
      expect(GRUPOS).toContain(item.grupo);
    }
  });

  it('cobre roupa de cima, de baixo, corpo inteiro e calcado', () => {
    const partes = new Set(CATALOGO.map((i) => PARTE_DA_CATEGORIA[i.categoria]));
    expect(partes).toContain('cima');
    expect(partes).toContain('baixo');
    expect(partes).toContain('corpo-inteiro');
    expect(partes).toContain('pes');
  });

  it('encontra peca pelo id', () => {
    expect(buscarItemCatalogo('cat-001')?.nome).toBe('Camiseta branca');
  });

  it('devolve null para id inexistente em vez de quebrar', () => {
    expect(buscarItemCatalogo('cat-999')).toBeNull();
  });

  it('nao tem marca nem preco — nao e vitrine, e atalho de cadastro', () => {
    for (const item of CATALOGO) {
      expect(item).not.toHaveProperty('marca');
      expect(item).not.toHaveProperty('precoCentavos');
      expect(item).not.toHaveProperty('urlLoja');
    }
  });
});

describe('tamanhos por tipo de peca', () => {
  it('roupa usa escala de manequim', () => {
    expect(tamanhosDaCategoria('blusa')).toContain('M');
  });

  it('calca e saia usam numeracao', () => {
    expect(tamanhosDaCategoria('calca')).toContain('40');
    expect(tamanhosDaCategoria('saia')).toContain('38');
  });

  it('calcado usa a propria numeracao', () => {
    expect(tamanhosDaCategoria('sapato')).toContain('37');
    expect(tamanhosDaCategoria('sapato')).not.toContain('M');
  });

  it('bolsa e acessorio sao tamanho unico', () => {
    expect(tamanhosDaCategoria('bolsa')).toEqual([TAMANHO_UNICO]);
    expect(tamanhosDaCategoria('acessorio')).toEqual([TAMANHO_UNICO]);
  });

  it('toda categoria tem pelo menos um tamanho possivel', () => {
    for (const categoria of CATEGORIAS) {
      expect(tamanhosDaCategoria(categoria).length).toBeGreaterThan(0);
    }
  });

  it('toda categoria sabe onde entra no look', () => {
    for (const categoria of CATEGORIAS) {
      expect(PARTE_DA_CATEGORIA[categoria]).toBeTruthy();
    }
  });
});
