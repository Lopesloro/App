import AsyncStorage from '@react-native-async-storage/async-storage';

import { CHAVES_LOCAIS } from '@/lib/armazenamento-local';
import { useSalvos } from '../salvos-store';

beforeEach(async () => {
  await AsyncStorage.clear();
  // `carregado: true` = o app ja leu o que estava no aparelho. E o estado em
  // que a usuaria consegue tocar no coracao; ver o teste de corrida abaixo.
  useSalvos.setState({ ids: [], carregado: true });
});

describe('salvar e remover look', () => {
  it('salva um look', async () => {
    const resultado = await useSalvos.getState().alternar('look-001', 'gratis');

    expect(resultado).toEqual({ ok: true, salvo: true });
    expect(useSalvos.getState().estaSalvo('look-001')).toBe(true);
  });

  it('tocar de novo remove o look', async () => {
    await useSalvos.getState().alternar('look-001', 'gratis');
    const resultado = await useSalvos.getState().alternar('look-001', 'gratis');

    expect(resultado).toEqual({ ok: true, salvo: false });
    expect(useSalvos.getState().estaSalvo('look-001')).toBe(false);
  });

  it('coloca o mais recente no topo da lista', async () => {
    await useSalvos.getState().alternar('look-001', 'gratis');
    await useSalvos.getState().alternar('look-002', 'gratis');

    expect(useSalvos.getState().ids).toEqual(['look-002', 'look-001']);
  });

  it('nao duplica o mesmo look', async () => {
    await useSalvos.getState().alternar('look-001', 'gratis');
    await useSalvos.getState().alternar('look-002', 'gratis');
    await useSalvos.getState().alternar('look-001', 'gratis'); // remove
    await useSalvos.getState().alternar('look-001', 'gratis'); // salva de novo

    const ids = useSalvos.getState().ids;
    expect(ids.filter((i) => i === 'look-001')).toHaveLength(1);
  });
});

describe('sem monetizacao, nada barra a usuaria', () => {
  it('salva muito acima do antigo limite do plano Gratis', async () => {
    for (let i = 0; i < 30; i++) {
      await useSalvos.getState().alternar(`look-${i}`, 'gratis');
    }

    expect(useSalvos.getState().ids).toHaveLength(30);
  });
});

describe('corrida com a leitura do aparelho', () => {
  it('nao grava por cima do que ainda esta sendo lido', async () => {
    // Coloca uma colecao no aparelho, como se fosse de outra sessao.
    await AsyncStorage.setItem(
      CHAVES_LOCAIS.looksSalvos,
      JSON.stringify(['look-antigo-1', 'look-antigo-2']),
    );
    useSalvos.setState({ ids: [], carregado: false });

    // Toque no coracao antes de `restaurar()` terminar.
    const resultado = await useSalvos.getState().alternar('look-novo', 'gratis');
    expect(resultado).toEqual({ ok: false, motivo: 'ainda-carregando' });

    await useSalvos.getState().restaurar();
    expect(useSalvos.getState().ids).toEqual(['look-antigo-1', 'look-antigo-2']);
  });

  it('depois de carregar, o mesmo toque funciona', async () => {
    useSalvos.setState({ ids: [], carregado: false });
    await useSalvos.getState().restaurar();

    const resultado = await useSalvos.getState().alternar('look-novo', 'gratis');
    expect(resultado).toEqual({ ok: true, salvo: true });
  });
});

describe('persistencia entre aberturas do app', () => {
  it('o que foi salvo continua la depois de reabrir', async () => {
    await useSalvos.getState().alternar('look-001', 'gratis');

    // Simula fechar e abrir o app: estado zerado, dados no aparelho.
    useSalvos.setState({ ids: [], carregado: false });
    await useSalvos.getState().restaurar();

    expect(useSalvos.getState().estaSalvo('look-001')).toBe(true);
    expect(useSalvos.getState().carregado).toBe(true);
  });

  it('primeira abertura, sem nada salvo, nao quebra', async () => {
    await useSalvos.getState().restaurar();
    expect(useSalvos.getState().ids).toEqual([]);
  });

  it('arquivo corrompido volta ao padrao em vez de derrubar o app', async () => {
    await AsyncStorage.setItem(CHAVES_LOCAIS.looksSalvos, 'isso-nao-e-json{{');
    await useSalvos.getState().restaurar();

    expect(useSalvos.getState().ids).toEqual([]);
  });

  it('arquivo adulterado com lixo no meio guarda so os ids validos', async () => {
    await AsyncStorage.setItem(
      CHAVES_LOCAIS.looksSalvos,
      JSON.stringify(['look-001', 42, null, 'look-002']),
    );
    await useSalvos.getState().restaurar();

    expect(useSalvos.getState().ids).toEqual(['look-001', 'look-002']);
  });

  it('limpar apaga tudo, inclusive no aparelho', async () => {
    await useSalvos.getState().alternar('look-001', 'gratis');
    await useSalvos.getState().limpar();

    useSalvos.setState({ ids: [], carregado: false });
    await useSalvos.getState().restaurar();

    expect(useSalvos.getState().ids).toEqual([]);
  });
});
