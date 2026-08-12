import { PLANOS, buscarPlano, formatarPreco } from '../planos';

/**
 * Teste de guarda dos precos.
 *
 * Os valores sao decisao do fundador (AGENTS.md). Este teste existe para que
 * uma mudanca acidental — refactor, merge torto, copiar-colar — quebre o CI
 * em vez de chegar na loja.
 */
describe('precos fixos dos planos', () => {
  it('mantem Gratis sem cobranca', () => {
    expect(buscarPlano('gratis').precoCentavos).toBe(0);
  });

  it('mantem Medium em R$ 19,90', () => {
    const medium = buscarPlano('medium');
    expect(medium.precoCentavos).toBe(1990);
    expect(medium.precoFormatado).toBe('R$ 19,90');
  });

  it('mantem Premium em R$ 24,90', () => {
    const premium = buscarPlano('premium');
    expect(premium.precoCentavos).toBe(2490);
    expect(premium.precoFormatado).toBe('R$ 24,90');
  });

  it('mantem o Premium acima do Medium (ancoragem de R$ 5)', () => {
    const diferenca =
      buscarPlano('premium').precoCentavos - buscarPlano('medium').precoCentavos;
    expect(diferenca).toBe(500);
  });
});

describe('integridade do catalogo', () => {
  it('tem exatamente tres planos', () => {
    expect(PLANOS).toHaveLength(3);
  });

  it('destaca um unico plano', () => {
    expect(PLANOS.filter((p) => p.destaque)).toHaveLength(1);
  });

  it('so o plano gratuito fica sem SKU de loja', () => {
    for (const plano of PLANOS) {
      if (plano.precoCentavos === 0) {
        expect(plano.sku).toBeNull();
      } else {
        expect(plano.sku).not.toBeNull();
      }
    }
  });

  it('mantem o preco formatado coerente com os centavos', () => {
    for (const plano of PLANOS.filter((p) => p.precoCentavos > 0)) {
      expect(plano.precoFormatado).toBe(formatarPreco(plano.precoCentavos));
    }
  });

  it('lanca erro para plano desconhecido', () => {
    // @ts-expect-error verificacao em tempo de execucao
    expect(() => buscarPlano('ouro')).toThrow('Plano desconhecido');
  });
});

describe('formatarPreco', () => {
  it.each([
    [0, 'R$ 0,00'],
    [1990, 'R$ 19,90'],
    [2490, 'R$ 24,90'],
    [19900, 'R$ 199,00'],
    [5, 'R$ 0,05'],
    [50, 'R$ 0,50'],
  ])('formata %i centavos como %s', (centavos, esperado) => {
    expect(formatarPreco(centavos)).toBe(esperado);
  });

  // Look completo passa facil de R$ 1.000 — sem separador viraria
  // "R$ 1049,70", que nao e como se escreve dinheiro no Brasil.
  it.each([
    [104970, 'R$ 1.049,70'],
    [100000, 'R$ 1.000,00'],
    [99999, 'R$ 999,99'],
    [1234567, 'R$ 12.345,67'],
    [123456789, 'R$ 1.234.567,89'],
  ])('usa separador de milhar: %i vira %s', (centavos, esperado) => {
    expect(formatarPreco(centavos)).toBe(esperado);
  });

  it('formata valor negativo (estorno) sem quebrar', () => {
    expect(formatarPreco(-1990)).toBe('-R$ 19,90');
  });
});
