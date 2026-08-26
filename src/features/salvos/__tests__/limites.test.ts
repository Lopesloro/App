import {
  LIMITE_LOOKS_SALVOS,
  limiteDoPlano,
  limiteVigente,
  mensagemLimite,
  podeSalvarMais,
  vagasRestantes,
} from '../limites';

/**
 * Aqui a monetizacao esta DESLIGADA (valor real de `MONETIZACAO_ATIVA`).
 * O comportamento com ela ligada e testado em
 * `limites-com-monetizacao.test.ts`, que troca a chave por mock.
 */

describe('tabela de planos (contrato de produto, mesmo desligada)', () => {
  it('respeita os limites definidos em docs/04-assinaturas-precos.md', () => {
    expect(LIMITE_LOOKS_SALVOS.gratis).toBe(10);
    expect(LIMITE_LOOKS_SALVOS.medium).toBe(100);
    expect(LIMITE_LOOKS_SALVOS.premium).toBe(Infinity);
  });

  it('cada plano pago cabe mais que o anterior', () => {
    expect(limiteDoPlano('medium')).toBeGreaterThan(limiteDoPlano('gratis'));
    expect(limiteDoPlano('premium')).toBeGreaterThan(limiteDoPlano('medium'));
  });
});

describe('limite vigente com a monetizacao desligada', () => {
  it('nenhum plano tem teto', () => {
    expect(limiteVigente('gratis')).toBe(Infinity);
    expect(limiteVigente('medium')).toBe(Infinity);
    expect(limiteVigente('premium')).toBe(Infinity);
  });

  it('ninguem e barrado, nem muito acima do limite da tabela', () => {
    expect(podeSalvarMais('gratis', 0)).toBe(true);
    expect(podeSalvarMais('gratis', 10)).toBe(true);
    expect(podeSalvarMais('gratis', 100_000)).toBe(true);
  });

  it('nao promete numero de vagas que nao existe', () => {
    expect(vagasRestantes('gratis', 3)).toBe(Infinity);
  });

  it('nao convida a assinar o que nao esta a venda', () => {
    expect(mensagemLimite('gratis')).toBe('');
    expect(mensagemLimite('medium')).toBe('');
    expect(mensagemLimite('premium')).toBe('');
  });
});
