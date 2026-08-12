import {
  LIMITE_LOOKS_SALVOS,
  limiteDoPlano,
  mensagemLimite,
  podeSalvarMais,
  vagasRestantes,
} from '../limites';

describe('limite de looks salvos por plano', () => {
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

describe('podeSalvarMais', () => {
  it('deixa salvar enquanto ha vaga', () => {
    expect(podeSalvarMais('gratis', 0)).toBe(true);
    expect(podeSalvarMais('gratis', 9)).toBe(true);
  });

  it('bloqueia exatamente no limite, nao depois', () => {
    expect(podeSalvarMais('gratis', 10)).toBe(false);
    expect(podeSalvarMais('medium', 100)).toBe(false);
  });

  it('nunca bloqueia o Premium', () => {
    expect(podeSalvarMais('premium', 0)).toBe(true);
    expect(podeSalvarMais('premium', 100_000)).toBe(true);
  });

  it('nao quebra se a conta ja passou do limite (ex.: downgrade de plano)', () => {
    expect(podeSalvarMais('gratis', 50)).toBe(false);
  });
});

describe('vagasRestantes', () => {
  it('conta quantas ainda cabem', () => {
    expect(vagasRestantes('gratis', 3)).toBe(7);
    expect(vagasRestantes('medium', 100)).toBe(0);
  });

  it('nunca devolve numero negativo apos downgrade', () => {
    expect(vagasRestantes('gratis', 40)).toBe(0);
  });

  it('devolve infinito no Premium', () => {
    expect(vagasRestantes('premium', 999)).toBe(Infinity);
  });
});

describe('mensagem de limite', () => {
  it('diz o numero certo do plano da usuaria', () => {
    expect(mensagemLimite('gratis')).toContain('10 looks');
    expect(mensagemLimite('medium')).toContain('100 looks');
  });

  it('convida a assinar sem culpar a usuaria', () => {
    const mensagem = mensagemLimite('gratis');
    expect(mensagem).toContain('Assine');
    expect(mensagem.toLowerCase()).not.toContain('erro');
    expect(mensagem.toLowerCase()).not.toContain('não pode');
  });

  it('nao mostra mensagem para quem ja e Premium', () => {
    expect(mensagemLimite('premium')).toBe('');
  });
});
