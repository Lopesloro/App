import { z } from 'zod';

import { idSeguroSchema, lookSchema, urlSeguraSchema } from '../tipos';
import { LOOKS_EXEMPLO } from '../dados-exemplo';

/**
 * Testes da fronteira de confianca: o catalogo de pecas vem de planilha e de
 * API de parceiro, fontes que nao controlamos. Estes testes garantem que dado
 * hostil e recusado ANTES de virar rota, imagem ou link.
 */

describe('idSeguroSchema', () => {
  it.each(['look-001', 'p_042', 'abc123', 'A-B_c-9'])('aceita id normal: %s', (id) => {
    expect(idSeguroSchema.safeParse(id).success).toBe(true);
  });

  it.each([
    ['../paywall', 'salto de rota'],
    ['x/../../perfil', 'travessia de caminho'],
    ['look?redirect=evil', 'injecao de query'],
    ['look#fragmento', 'fragmento'],
    ['look 001', 'espaco'],
    ['look%2f001', 'barra codificada'],
    ['', 'vazio'],
  ])('recusa %s (%s)', (id) => {
    expect(idSeguroSchema.safeParse(id).success).toBe(false);
  });

  it('recusa id absurdamente longo', () => {
    expect(idSeguroSchema.safeParse('a'.repeat(65)).success).toBe(false);
  });
});

describe('urlSeguraSchema', () => {
  it.each(['https://loja.com.br/p/1', 'http://loja.com.br/p/1'])(
    'aceita %s',
    (url) => {
      expect(urlSeguraSchema.safeParse(url).success).toBe(true);
    },
  );

  it.each([
    ['javascript:alert(1)', 'executaria codigo'],
    ['file:///etc/passwd', 'leria arquivo do aparelho'],
    ['data:text/html,<script>alert(1)</script>', 'injetaria pagina'],
    ['intent://x#Intent;scheme=http;end', 'abriria outro app'],
    ['nao-e-url', 'malformada'],
  ])('recusa %s (%s)', (url) => {
    expect(urlSeguraSchema.safeParse(url).success).toBe(false);
  });

  it('o url() do zod sozinho NAO bastaria — por isso este schema existe', () => {
    // Documenta a razao de nao usar z.string().url() direto.
    expect(z.string().url().safeParse('javascript:alert(1)').success).toBe(true);
    expect(urlSeguraSchema.safeParse('javascript:alert(1)').success).toBe(false);
  });
});

describe('look vindo de catalogo hostil', () => {
  const base = LOOKS_EXEMPLO[0];

  it('recusa look com id que muda a rota', () => {
    expect(lookSchema.safeParse({ ...base, id: '../paywall' }).success).toBe(false);
  });

  it('recusa foto apontando para arquivo local', () => {
    expect(
      lookSchema.safeParse({ ...base, fotoUrl: 'file:///data/data/app/senha.txt' }).success,
    ).toBe(false);
  });

  it('recusa peca com link javascript', () => {
    const pecaHostil = { ...base.pecas[0], urlLoja: 'javascript:alert(1)' };
    expect(lookSchema.safeParse({ ...base, pecas: [pecaHostil] }).success).toBe(false);
  });

  it('aceita o catalogo legitimo inteiro', () => {
    for (const look of LOOKS_EXEMPLO) {
      expect(lookSchema.safeParse(look).success).toBe(true);
    }
  });
});
