import {
  limiteVigente,
  mensagemLimite,
  podeSalvarMais,
  vagasRestantes,
} from '../limites';

// `jest.mock` e movido para o topo pelo babel, entao os imports acima ja
// recebem a chave trocada. Ficam aqui em cima para o lint nao reclamar.
jest.mock('@/lib/flags', () => ({
  ...jest.requireActual<typeof import('@/lib/flags')>('@/lib/flags'),
  MONETIZACAO_ATIVA: true,
}));

/**
 * A monetizacao esta desligada hoje, mas o codigo dela continua no app para
 * voltar quando houver o que vender. Estes testes sao a garantia de que o
 * caminho de volta ainda funciona: se alguem quebrar o gating enquanto ele
 * esta invisivel, o erro aparece aqui e nao seis meses depois, em producao.
 */
describe('gating por plano quando a monetizacao volta a valer', () => {
  it('cada plano volta ao teto da tabela', () => {
    expect(limiteVigente('gratis')).toBe(10);
    expect(limiteVigente('medium')).toBe(100);
    expect(limiteVigente('premium')).toBe(Infinity);
  });

  it('deixa salvar enquanto ha vaga', () => {
    expect(podeSalvarMais('gratis', 0)).toBe(true);
    expect(podeSalvarMais('gratis', 9)).toBe(true);
  });

  it('bloqueia exatamente no limite, nao depois', () => {
    expect(podeSalvarMais('gratis', 10)).toBe(false);
    expect(podeSalvarMais('medium', 100)).toBe(false);
  });

  it('nunca bloqueia o Premium', () => {
    expect(podeSalvarMais('premium', 100_000)).toBe(true);
  });

  it('nao devolve vaga negativa apos downgrade de plano', () => {
    expect(vagasRestantes('gratis', 40)).toBe(0);
  });

  it('conta quantas ainda cabem', () => {
    expect(vagasRestantes('gratis', 3)).toBe(7);
    expect(vagasRestantes('medium', 100)).toBe(0);
  });

  it('convida a assinar sem culpar a usuaria', () => {
    const mensagem = mensagemLimite('gratis');
    expect(mensagem).toContain('10 looks');
    expect(mensagem).toContain('Assine');
    expect(mensagem.toLowerCase()).not.toContain('erro');
    expect(mensagem.toLowerCase()).not.toContain('não pode');
  });

  it('nao mostra mensagem para quem ja tem plano sem teto', () => {
    expect(mensagemLimite('premium')).toBe('');
  });
});
