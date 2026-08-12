import AsyncStorage from '@react-native-async-storage/async-storage';

import { CHAVES_LOCAIS } from '@/lib/armazenamento-local';
import { useSalvos } from '../salvos-store';

beforeEach(async () => {
  await AsyncStorage.clear();
  useSalvos.setState({ ids: [], carregado: false });
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

describe('limite do plano', () => {
  async function encher(quantidade: number) {
    for (let i = 0; i < quantidade; i++) {
      await useSalvos.getState().alternar(`look-${i}`, 'gratis');
    }
  }

  it('bloqueia ao passar do limite do plano Gratis', async () => {
    await encher(10);
    const resultado = await useSalvos.getState().alternar('look-extra', 'gratis');

    expect(resultado).toEqual({ ok: false, motivo: 'limite-atingido' });
    expect(useSalvos.getState().estaSalvo('look-extra')).toBe(false);
  });

  it('o mesmo usuario no Medium consegue salvar o 11o', async () => {
    await encher(10);
    const resultado = await useSalvos.getState().alternar('look-extra', 'medium');

    expect(resultado).toEqual({ ok: true, salvo: true });
  });

  it('nao prende a usuaria: remover funciona mesmo no limite', async () => {
    await encher(10);
    const resultado = await useSalvos.getState().alternar('look-0', 'gratis');

    expect(resultado).toEqual({ ok: true, salvo: false });
  });

  it('apos remover no limite, abre vaga para outro', async () => {
    await encher(10);
    await useSalvos.getState().alternar('look-0', 'gratis');
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
