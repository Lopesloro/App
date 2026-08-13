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
  it('toda peca tem categoria, cor e tamanho', () => {
    for (const look of LOOKS_EXEMPLO) {
      for (const peca of look.pecas) {
        expect(peca.categoria).toBeTruthy();
        expect(peca.cor).toBeTruthy();
        expect(peca.tamanho).toBeTruthy();
      }
    }
  });

  it('todo look tem pelo menos uma peca de calcado ou corpo', () => {
    for (const look of LOOKS_EXEMPLO) {
      expect(look.pecas.length).toBeGreaterThanOrEqual(2);
    }
  });
});
