import { buscarLook } from '../api';
import { LOOKS_EXEMPLO } from '../dados-exemplo';
import { lookSchema } from '../tipos';

describe('buscarLook', () => {
  it('encontra um look pelo id', async () => {
    const look = await buscarLook('look-001');
    expect(look?.id).toBe('look-001');
    expect(look?.titulo).toBe('Alfaiataria leve para o escritório');
  });

  it('devolve null para id inexistente em vez de quebrar', async () => {
    await expect(buscarLook('look-nao-existe')).resolves.toBeNull();
  });

  it('devolve null para id vazio', async () => {
    await expect(buscarLook('')).resolves.toBeNull();
  });

  it('o look devolvido passa pela validacao de formato', async () => {
    const look = await buscarLook('look-003');
    expect(() => lookSchema.parse(look)).not.toThrow();
  });

  it('encontra qualquer look do catalogo', async () => {
    for (const esperado of LOOKS_EXEMPLO) {
      const look = await buscarLook(esperado.id);
      expect(look?.id).toBe(esperado.id);
    }
  });
});

describe('catalogo de exemplo', () => {
  it('tem pecas com link de compra e pecas sem, para cobrir os dois casos', () => {
    const pecas = LOOKS_EXEMPLO.flatMap((l) => l.pecas);
    expect(pecas.some((p) => p.urlLoja !== null)).toBe(true);
    expect(pecas.some((p) => p.urlLoja === null)).toBe(true);
  });

  it('todo link de compra e https', () => {
    const comLink = LOOKS_EXEMPLO.flatMap((l) => l.pecas).filter((p) => p.urlLoja);
    for (const peca of comLink) {
      expect(peca.urlLoja).toMatch(/^https:\/\//);
    }
  });
});
