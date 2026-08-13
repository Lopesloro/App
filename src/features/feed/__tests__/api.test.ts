import { buscarLooks, TAMANHO_PAGINA } from '../api';
import { LOOKS_EXEMPLO } from '../dados-exemplo';
import { looksPaginaSchema, resumoPecas, tamanhosDoLook } from '../tipos';

describe('paginacao do feed', () => {
  it('devolve a primeira pagina com o tamanho definido', async () => {
    const pagina = await buscarLooks();
    expect(pagina.looks).toHaveLength(TAMANHO_PAGINA);
    expect(pagina.total).toBe(LOOKS_EXEMPLO.length);
  });

  it('aponta o cursor da proxima pagina enquanto houver looks', async () => {
    const pagina = await buscarLooks(0);
    expect(pagina.proximoCursor).toBe(TAMANHO_PAGINA);
  });

  it('zera o cursor na ultima pagina', async () => {
    let cursor: number | null = 0;
    let paginas = 0;

    while (cursor !== null) {
      const pagina = await buscarLooks(cursor);
      cursor = pagina.proximoCursor;
      paginas++;
      if (paginas > 20) throw new Error('paginacao nao terminou — possivel loop');
    }

    expect(paginas).toBe(Math.ceil(LOOKS_EXEMPLO.length / TAMANHO_PAGINA));
  });

  it('percorrer todas as paginas devolve cada look uma unica vez', async () => {
    const vistos: string[] = [];
    let cursor: number | null = 0;

    while (cursor !== null) {
      const pagina = await buscarLooks(cursor);
      vistos.push(...pagina.looks.map((l) => l.id));
      cursor = pagina.proximoCursor;
    }

    expect(vistos).toHaveLength(LOOKS_EXEMPLO.length);
    expect(new Set(vistos).size).toBe(LOOKS_EXEMPLO.length);
  });
});

describe('filtro por ocasiao', () => {
  it('devolve somente looks da ocasiao pedida', async () => {
    const pagina = await buscarLooks(0, { ocasiao: 'trabalho' });
    expect(pagina.looks.length).toBeGreaterThan(0);
    expect(pagina.looks.every((l) => l.ocasiao === 'trabalho')).toBe(true);
  });

  it('conta o total ja filtrado, nao o catalogo inteiro', async () => {
    const pagina = await buscarLooks(0, { ocasiao: 'praia' });
    const esperado = LOOKS_EXEMPLO.filter((l) => l.ocasiao === 'praia').length;
    expect(pagina.total).toBe(esperado);
  });

  it('devolve lista vazia sem quebrar quando nao ha resultado', async () => {
    // Nao existe look de academia alem do unico cadastrado; usamos cursor
    // alem do fim para simular pagina vazia.
    const pagina = await buscarLooks(99, { ocasiao: 'academia' });
    expect(pagina.looks).toEqual([]);
    expect(pagina.proximoCursor).toBeNull();
  });
});

describe('validacao dos dados', () => {
  it('toda pagina passa pelo schema antes de chegar na tela', async () => {
    const pagina = await buscarLooks();
    expect(() => looksPaginaSchema.parse(pagina)).not.toThrow();
  });

  it('todo look de exemplo tem pelo menos uma peca', () => {
    for (const look of LOOKS_EXEMPLO) {
      expect(look.pecas.length).toBeGreaterThan(0);
    }
  });

  it('nao ha id de look repetido', () => {
    const ids = LOOKS_EXEMPLO.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('nao ha id de peca repetido entre looks diferentes', () => {
    const ids = LOOKS_EXEMPLO.flatMap((l) => l.pecas.map((p) => p.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('resumo das pecas', () => {
  it('descreve quantas pecas o look tem', () => {
    const look = LOOKS_EXEMPLO[0];
    expect(resumoPecas(look)).toBe(`${look.pecas.length} peças`);
  });

  it('usa singular para look de uma peca so', () => {
    expect(resumoPecas({ ...LOOKS_EXEMPLO[0], pecas: [LOOKS_EXEMPLO[0].pecas[0]] })).toBe('1 peça');
  });

  it('lista os tamanhos do look sem repetir', () => {
    const look = LOOKS_EXEMPLO[0];
    const esperado = [...new Set(look.pecas.map((p) => p.tamanho))].join(' · ');
    expect(tamanhosDoLook(look)).toBe(esperado);
  });

  it('nao mostra preco: nada e vendido no app', () => {
    // Trava de produto: se alguem reintroduzir preco na peca, este teste cai.
    for (const look of LOOKS_EXEMPLO) {
      for (const peca of look.pecas) {
        expect(peca).not.toHaveProperty('precoCentavos');
        expect(peca).not.toHaveProperty('urlLoja');
      }
    }
  });
});
