jest.mock('@/lib/flags', () => ({
  ...jest.requireActual<typeof import('@/lib/flags')>('@/lib/flags'),
  MONETIZACAO_ATIVA: true,
}));

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSalvos } from '../salvos-store';

/**
 * Caminho de volta da monetizacao: o gating por plano no store continua
 * funcionando enquanto esta desligado. Sem isto, o dia de religar a chave
 * viraria um dia de descobrir bugs.
 */
beforeEach(async () => {
  await AsyncStorage.clear();
  useSalvos.setState({ ids: [], carregado: true });
});

async function encher(quantidade: number) {
  for (let i = 0; i < quantidade; i++) {
    await useSalvos.getState().alternar(`look-${i}`, 'gratis');
  }
}

describe('limite do plano quando a monetizacao volta a valer', () => {
  it('bloqueia ao passar do limite do plano Gratis', async () => {
    await encher(10);
    const resultado = await useSalvos.getState().alternar('look-extra', 'gratis');

    expect(resultado).toEqual({ ok: false, motivo: 'limite-atingido' });
    expect(useSalvos.getState().estaSalvo('look-extra')).toBe(false);
  });

  it('a mesma usuaria no Medium consegue salvar o 11o', async () => {
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
