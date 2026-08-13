import AsyncStorage from '@react-native-async-storage/async-storage';

import { CHAVES_LOCAIS } from '@/lib/armazenamento-local';
import { LIMITE_PECAS, useCloset } from '../closet-store';

beforeEach(async () => {
  await AsyncStorage.clear();
  useCloset.setState({ pecas: [], carregado: false });
});

const blusa = {
  nome: 'Blusa branca',
  categoria: 'blusa' as const,
  cor: 'branco' as const,
  tamanho: 'M',
  origem: { tipo: 'catalogo' as const, idCatalogo: 'cat-004' },
};

const fotoPessoal = {
  nome: 'Vestido da festa',
  categoria: 'vestido' as const,
  cor: 'preto' as const,
  tamanho: 'M',
  origem: { tipo: 'foto' as const, caminhoLocal: 'file:///local/foto1.jpg' },
};

describe('adicionar pecas ao closet', () => {
  it('adiciona peca do catalogo', async () => {
    const r = await useCloset.getState().adicionar(blusa, 'gratis');
    expect(r.ok).toBe(true);
    expect(useCloset.getState().pecas).toHaveLength(1);
  });

  it('adiciona peca fotografada', async () => {
    const r = await useCloset.getState().adicionar(fotoPessoal, 'gratis');
    expect(r.ok && r.peca.origem.tipo).toBe('foto');
  });

  it('coloca a mais recente no topo', async () => {
    await useCloset.getState().adicionar(blusa, 'gratis');
    await useCloset.getState().adicionar(fotoPessoal, 'gratis');
    expect(useCloset.getState().pecas[0].nome).toBe('Vestido da festa');
  });

  it('gera ids diferentes para cada peca', async () => {
    for (let i = 0; i < 5; i++) {
      await useCloset.getState().adicionar(blusa, 'gratis');
    }
    const ids = useCloset.getState().pecas.map((p) => p.id);
    expect(new Set(ids).size).toBe(5);
  });

  it('corta nome absurdamente longo em vez de guardar', async () => {
    const r = await useCloset.getState().adicionar(
      { ...blusa, nome: 'a'.repeat(200) },
      'gratis',
    );
    expect(r.ok && r.peca.nome.length).toBeLessThanOrEqual(60);
  });
});

describe('limite de pecas por plano', () => {
  it('respeita os limites de docs/04-assinaturas-precos', () => {
    expect(LIMITE_PECAS.gratis).toBe(20);
    expect(LIMITE_PECAS.medium).toBe(200);
    expect(LIMITE_PECAS.premium).toBe(Infinity);
  });

  it('bloqueia ao passar do limite do Gratis', async () => {
    for (let i = 0; i < 20; i++) {
      await useCloset.getState().adicionar(blusa, 'gratis');
    }
    const r = await useCloset.getState().adicionar(blusa, 'gratis');
    expect(r).toEqual({ ok: false, motivo: 'limite-atingido' });
  });

  it('o mesmo closet no Medium continua aceitando', async () => {
    for (let i = 0; i < 20; i++) {
      await useCloset.getState().adicionar(blusa, 'gratis');
    }
    const r = await useCloset.getState().adicionar(blusa, 'medium');
    expect(r.ok).toBe(true);
  });

  it('remover sempre funciona, mesmo no limite', async () => {
    for (let i = 0; i < 20; i++) {
      await useCloset.getState().adicionar(blusa, 'gratis');
    }
    const primeiro = useCloset.getState().pecas[0].id;
    await useCloset.getState().remover(primeiro);
    expect(useCloset.getState().pecas).toHaveLength(19);
  });
});

describe('a foto nunca vira endereco publico', () => {
  it('guarda o caminho local, nao uma URL de servidor', async () => {
    const r = await useCloset.getState().adicionar(fotoPessoal, 'gratis');
    expect(r.ok && r.peca.origem).toEqual({
      tipo: 'foto',
      caminhoLocal: 'file:///local/foto1.jpg',
    });
  });

  it('nenhuma peca gravada contem endereco http', async () => {
    await useCloset.getState().adicionar(fotoPessoal, 'gratis');
    const gravado = await AsyncStorage.getItem(CHAVES_LOCAIS.pecasCloset);
    expect(gravado).not.toContain('http://');
    expect(gravado).not.toContain('https://');
  });
});

describe('persistencia entre aberturas', () => {
  it('o closet continua la depois de reabrir o app', async () => {
    await useCloset.getState().adicionar(blusa, 'gratis');

    useCloset.setState({ pecas: [], carregado: false });
    await useCloset.getState().restaurar();

    expect(useCloset.getState().pecas).toHaveLength(1);
    expect(useCloset.getState().carregado).toBe(true);
  });

  it('primeira abertura, closet vazio, nao quebra', async () => {
    await useCloset.getState().restaurar();
    expect(useCloset.getState().pecas).toEqual([]);
  });

  it('arquivo corrompido volta ao closet vazio', async () => {
    await AsyncStorage.setItem(CHAVES_LOCAIS.pecasCloset, 'nao-e-json{{');
    await useCloset.getState().restaurar();
    expect(useCloset.getState().pecas).toEqual([]);
  });

  it('descarta so a peca invalida, mantendo as boas', async () => {
    await useCloset.getState().adicionar(blusa, 'gratis');
    const boas = useCloset.getState().pecas;

    await AsyncStorage.setItem(
      CHAVES_LOCAIS.pecasCloset,
      JSON.stringify([...boas, { id: 'quebrada' }, null, 42]),
    );
    useCloset.setState({ pecas: [], carregado: false });
    await useCloset.getState().restaurar();

    expect(useCloset.getState().pecas).toHaveLength(1);
  });

  it('limpar apaga tudo, inclusive no aparelho', async () => {
    await useCloset.getState().adicionar(blusa, 'gratis');
    await useCloset.getState().limpar();

    useCloset.setState({ pecas: [], carregado: false });
    await useCloset.getState().restaurar();

    expect(useCloset.getState().pecas).toEqual([]);
  });
});
