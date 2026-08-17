import AsyncStorage from '@react-native-async-storage/async-storage';

import { CHAVES_LOCAIS } from '@/lib/armazenamento-local';
import { useGuardaRoupa } from '../guarda-roupa-store';

beforeEach(async () => {
  await AsyncStorage.clear();
  useGuardaRoupa.setState({ pecas: [], carregado: true });
});

describe('marcar e desmarcar peca', () => {
  it('marcar coloca a peca no armario', async () => {
    const resultado = await useGuardaRoupa.getState().alternar('camisa-social');

    expect(resultado).toEqual({ ok: true, guardada: true });
    expect(useGuardaRoupa.getState().estaGuardada('camisa-social')).toBe(true);
  });

  it('tocar de novo tira do armario', async () => {
    await useGuardaRoupa.getState().alternar('camisa-social');
    const resultado = await useGuardaRoupa.getState().alternar('camisa-social');

    expect(resultado).toEqual({ ok: true, guardada: false });
    expect(useGuardaRoupa.getState().estaGuardada('camisa-social')).toBe(false);
  });

  it('a mais recente fica no topo', async () => {
    await useGuardaRoupa.getState().alternar('camisa-social');
    await useGuardaRoupa.getState().alternar('scarpin');

    expect(useGuardaRoupa.getState().pecas.map((p) => p.id)).toEqual([
      'scarpin',
      'camisa-social',
    ]);
  });

  it('nao duplica a mesma peca', async () => {
    await useGuardaRoupa.getState().alternar('camisa-social');
    await useGuardaRoupa.getState().alternar('camisa-social');
    await useGuardaRoupa.getState().alternar('camisa-social');

    const ids = useGuardaRoupa.getState().pecas.map((p) => p.id);
    expect(ids.filter((id) => id === 'camisa-social')).toHaveLength(1);
  });

  it('guarda quando a peca entrou no armario', async () => {
    await useGuardaRoupa.getState().alternar('camisa-social', 1_700_000_000_000);

    expect(useGuardaRoupa.getState().pecas[0].guardadaEm).toBe(1_700_000_000_000);
  });

  it('nao ha teto: o armario aceita o catalogo inteiro', async () => {
    for (let i = 0; i < 80; i++) {
      await useGuardaRoupa.getState().alternar(`peca-${i}`);
    }

    expect(useGuardaRoupa.getState().pecas).toHaveLength(80);
  });
});

describe('corrida com a leitura do aparelho', () => {
  it('marcar antes de carregar nao apaga o armario que ja existia', async () => {
    await AsyncStorage.setItem(
      CHAVES_LOCAIS.guardaRoupa,
      JSON.stringify([
        { id: 'camisa-social', guardadaEm: 1 },
        { id: 'scarpin', guardadaEm: 2 },
      ]),
    );
    useGuardaRoupa.setState({ pecas: [], carregado: false });

    const resultado = await useGuardaRoupa.getState().alternar('legging');
    expect(resultado).toEqual({ ok: false, motivo: 'ainda-carregando' });

    await useGuardaRoupa.getState().restaurar();
    expect(useGuardaRoupa.getState().pecas).toHaveLength(2);
  });
});

describe('persistencia entre aberturas do app', () => {
  it('o armario continua la depois de fechar e abrir', async () => {
    await useGuardaRoupa.getState().alternar('camisa-social');

    useGuardaRoupa.setState({ pecas: [], carregado: false });
    await useGuardaRoupa.getState().restaurar();

    expect(useGuardaRoupa.getState().estaGuardada('camisa-social')).toBe(true);
    expect(useGuardaRoupa.getState().carregado).toBe(true);
  });

  it('primeira abertura, armario vazio, nao quebra', async () => {
    await useGuardaRoupa.getState().restaurar();

    expect(useGuardaRoupa.getState().pecas).toEqual([]);
  });

  it('arquivo corrompido volta ao vazio em vez de derrubar o app', async () => {
    await AsyncStorage.setItem(CHAVES_LOCAIS.guardaRoupa, 'isso-nao-e-json{{');
    await useGuardaRoupa.getState().restaurar();

    expect(useGuardaRoupa.getState().pecas).toEqual([]);
  });

  it('arquivo adulterado guarda so o que tem forma de peca', async () => {
    await AsyncStorage.setItem(
      CHAVES_LOCAIS.guardaRoupa,
      JSON.stringify([
        { id: 'camisa-social', guardadaEm: 10 },
        42,
        null,
        { semId: true },
        { id: '', guardadaEm: 1 },
        { id: 'scarpin' },
      ]),
    );
    await useGuardaRoupa.getState().restaurar();

    const pecas = useGuardaRoupa.getState().pecas;
    expect(pecas.map((p) => p.id)).toEqual(['camisa-social', 'scarpin']);
    // Peca sem data nao some: entra com data zero e cai no fim do armario.
    expect(pecas[1].guardadaEm).toBe(0);
  });

  it('id repetido no arquivo aparece uma vez so', async () => {
    await AsyncStorage.setItem(
      CHAVES_LOCAIS.guardaRoupa,
      JSON.stringify([
        { id: 'camisa-social', guardadaEm: 10 },
        { id: 'camisa-social', guardadaEm: 20 },
      ]),
    );
    await useGuardaRoupa.getState().restaurar();

    expect(useGuardaRoupa.getState().pecas).toHaveLength(1);
  });

  it('limpar esvazia tambem no aparelho', async () => {
    await useGuardaRoupa.getState().alternar('camisa-social');
    await useGuardaRoupa.getState().limpar();

    useGuardaRoupa.setState({ pecas: [], carregado: false });
    await useGuardaRoupa.getState().restaurar();

    expect(useGuardaRoupa.getState().pecas).toEqual([]);
  });
});
