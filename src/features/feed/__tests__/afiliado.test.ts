import { AVISO_COMISSAO, ORIGEM_AFILIADO, montarUrlCompra } from '../afiliado';
import { LOOKS_EXEMPLO } from '../dados-exemplo';
import type { Look, Peca } from '../tipos';

const look: Look = LOOKS_EXEMPLO[0];
const pecaComLoja: Peca = {
  id: 'p-teste',
  nome: 'Blazer',
  marca: 'Renner',
  precoCentavos: 18990,
  urlLoja: 'https://www.lojasrenner.com.br/p/blazer/123',
};

const rastreio = { origemInterna: 'detalhe-look' };

describe('montagem do link de compra', () => {
  it('acrescenta os parametros de rastreio', () => {
    const url = new URL(montarUrlCompra(pecaComLoja, look, rastreio)!);

    expect(url.searchParams.get('utm_source')).toBe(ORIGEM_AFILIADO);
    expect(url.searchParams.get('utm_medium')).toBe('app');
    expect(url.searchParams.get('utm_campaign')).toBe('detalhe-look');
  });

  it('marca qual look gerou o clique', () => {
    const url = new URL(montarUrlCompra(pecaComLoja, look, rastreio)!);
    expect(url.searchParams.get('utm_content')).toBe(look.id);
  });

  it('mantem o endereco original da loja', () => {
    const url = new URL(montarUrlCompra(pecaComLoja, look, rastreio)!);
    expect(url.hostname).toBe('www.lojasrenner.com.br');
    expect(url.pathname).toBe('/p/blazer/123');
  });

  it('preserva parametros que a loja ja tinha', () => {
    const comParametro: Peca = {
      ...pecaComLoja,
      urlLoja: 'https://loja.com.br/p/1?cor=preto',
    };
    const url = new URL(montarUrlCompra(comParametro, look, rastreio)!);

    expect(url.searchParams.get('cor')).toBe('preto');
    expect(url.searchParams.get('utm_source')).toBe(ORIGEM_AFILIADO);
  });

  it('devolve null quando a peca nao esta a venda', () => {
    expect(montarUrlCompra({ ...pecaComLoja, urlLoja: null }, look, rastreio)).toBeNull();
  });
});

describe('privacidade do link', () => {
  it('nao leva nenhum dado pessoal para a loja parceira', () => {
    const url = montarUrlCompra(pecaComLoja, look, rastreio)!;
    const proibidos = ['email', 'e-mail', 'usuaria', 'user', 'cpf', 'telefone', 'lat', 'lon'];

    for (const termo of proibidos) {
      expect(url.toLowerCase()).not.toContain(termo);
    }
  });

  it('so envia parametros conhecidos', () => {
    const url = new URL(montarUrlCompra(pecaComLoja, look, rastreio)!);
    const chaves = [...url.searchParams.keys()].sort();
    expect(chaves).toEqual(['utm_campaign', 'utm_content', 'utm_medium', 'utm_source']);
  });
});

describe('protecao contra endereco perigoso', () => {
  it.each([
    ['javascript:alert(1)'],
    ['intent://loja#Intent;scheme=http;end'],
    ['file:///etc/passwd'],
    ['data:text/html,<script>alert(1)</script>'],
  ])('recusa o esquema %s', (endereco) => {
    expect(montarUrlCompra({ ...pecaComLoja, urlLoja: endereco }, look, rastreio)).toBeNull();
  });

  it('recusa endereco malformado em vez de quebrar', () => {
    expect(
      montarUrlCompra({ ...pecaComLoja, urlLoja: 'nao-e-url' }, look, rastreio),
    ).toBeNull();
  });

  it('aceita http e https', () => {
    expect(
      montarUrlCompra({ ...pecaComLoja, urlLoja: 'http://loja.com.br/p/1' }, look, rastreio),
    ).not.toBeNull();
    expect(
      montarUrlCompra({ ...pecaComLoja, urlLoja: 'https://loja.com.br/p/1' }, look, rastreio),
    ).not.toBeNull();
  });
});

describe('aviso de comissao', () => {
  it('deixa claro que ha comissao e que o preco nao muda', () => {
    expect(AVISO_COMISSAO).toContain('comissão');
    expect(AVISO_COMISSAO).toContain('preço para você é o mesmo');
  });
});
