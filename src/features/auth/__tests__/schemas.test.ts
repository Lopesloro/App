import { credenciaisSchema, forcaSenha, senhaSchema } from '../schemas';

describe('validacao de credenciais', () => {
  it('aceita e-mail e senha validos', () => {
    const resultado = credenciaisSchema.safeParse({
      email: 'ana@exemplo.com',
      senha: 'senhaSegura1',
    });
    expect(resultado.success).toBe(true);
  });

  it('recusa e-mail invalido', () => {
    const resultado = credenciaisSchema.safeParse({
      email: 'ana@',
      senha: 'senhaSegura1',
    });
    expect(resultado.success).toBe(false);
  });

  it('recusa senha com menos de 8 caracteres', () => {
    expect(senhaSchema.safeParse('curta1').success).toBe(false);
  });

  it('limita o tamanho da senha para evitar payload abusivo', () => {
    expect(senhaSchema.safeParse('a'.repeat(129)).success).toBe(false);
  });

  it('normaliza espacos ao redor do e-mail', () => {
    const resultado = credenciaisSchema.safeParse({
      email: '  ana@exemplo.com  ',
      senha: 'senhaSegura1',
    });
    expect(resultado.success && resultado.data.email).toBe('ana@exemplo.com');
  });
});

describe('forcaSenha', () => {
  it.each([
    ['curta', 'fraca'],
    ['12345678', 'fraca'],
    ['senhalonga', 'media'],
    ['Senha123', 'media'],
    ['SenhaLonga123', 'forte'],
    ['S3nha!Muito#Boa', 'forte'],
  ])('classifica %s como %s', (senha, esperado) => {
    expect(forcaSenha(senha)).toBe(esperado);
  });
});
