import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook } from '@testing-library/react-native';

import { useEstilo } from '@/features/estilo/estilo-store';
import { perfilVazio } from '@/features/estilo/perfil-estilo';
import { buscarRoupaPorId } from '@/features/roupas/busca';
import type { TipoRoupa } from '@/features/roupas/tipos';
import { useGuardaRoupa } from '../guarda-roupa-store';
import { useMarcarPeca } from '../use-marcar-peca';

/**
 * Guardar uma peca e ensinar o algoritmo sao a mesma acao para a usuaria.
 * Estes testes existem para que continuem sendo a mesma acao no codigo: e o
 * tipo de ligacao que se desfaz em silencio, sem nenhum teste ficar vermelho,
 * e so aparece meses depois como "as sugestoes nunca melhoram".
 */

const peca = (id: string): TipoRoupa => {
  const roupa = buscarRoupaPorId(id);
  if (!roupa) throw new Error(`Peca de teste ausente: ${id}`);
  return roupa;
};

function marcador() {
  return renderHook(() => useMarcarPeca()).result;
}

beforeEach(async () => {
  await AsyncStorage.clear();
  useGuardaRoupa.setState({ pecas: [], carregado: true });
  useEstilo.setState({ perfil: perfilVazio(), carregado: true });
});

describe('marcar uma peca', () => {
  it('guarda no armario e ensina o estilo de uma vez', async () => {
    const marcar = marcador();

    await marcar.current(peca('camisa-social'));

    expect(useGuardaRoupa.getState().estaGuardada('camisa-social')).toBe(true);
    expect(useEstilo.getState().perfil.interacoes).toBe(1);
    expect(useEstilo.getState().perfil.estilos.classico).toBeGreaterThan(0);
  });

  it('desmarcar tira do armario e ensina o contrario', async () => {
    const marcar = marcador();

    await marcar.current(peca('camisa-social'));
    const pesoDepoisDeGuardar = useEstilo.getState().perfil.estilos.classico;

    await marcar.current(peca('camisa-social'));

    expect(useGuardaRoupa.getState().estaGuardada('camisa-social')).toBe(false);
    expect(useEstilo.getState().perfil.estilos.classico).toBeLessThan(
      pesoDepoisDeGuardar,
    );
    expect(useEstilo.getState().perfil.interacoes).toBe(2);
  });

  it('devolve o que aconteceu, para a tela poder reagir', async () => {
    const marcar = marcador();

    expect(await marcar.current(peca('scarpin'))).toEqual({ guardada: true });
    expect(await marcar.current(peca('scarpin'))).toEqual({ guardada: false });
  });
});

describe('antes de a leitura do aparelho terminar', () => {
  it('nao guarda nem ensina', async () => {
    useGuardaRoupa.setState({ pecas: [], carregado: false });
    const marcar = marcador();

    const resultado = await marcar.current(peca('camisa-social'));

    expect(resultado).toBeNull();
    expect(useGuardaRoupa.getState().pecas).toEqual([]);
    // O ponto do teste: o armario recusou, entao o perfil nao pode ter
    // aprendido com uma peca que nao foi guardada.
    expect(useEstilo.getState().perfil.interacoes).toBe(0);
  });
});

describe('montar um armario inteiro', () => {
  it('o perfil reflete o que foi guardado', async () => {
    const marcar = marcador();

    for (const id of [
      'legging',
      'top-esportivo',
      'bermuda-ciclista',
      'corta-vento',
      'tenis-chunky',
      'mochila-urbana',
    ]) {
      await marcar.current(peca(id));
    }

    const perfil = useEstilo.getState().perfil;

    expect(useGuardaRoupa.getState().pecas).toHaveLength(6);
    expect(perfil.estilos.esportivo).toBeGreaterThan(perfil.estilos.romantico);
    expect(perfil.ocasioes.academia).toBeGreaterThan(perfil.ocasioes.festa);
  });

  it('o que foi aprendido sobrevive a fechar e abrir o app', async () => {
    const marcar = marcador();
    for (const id of ['camisa-social', 'scarpin', 'blazer-alfaiataria']) {
      await marcar.current(peca(id));
    }

    const antes = useEstilo.getState().perfil;

    // Simula reabrir: memoria zerada, dados no aparelho.
    useEstilo.setState({ perfil: perfilVazio(), carregado: false });
    useGuardaRoupa.setState({ pecas: [], carregado: false });
    await useEstilo.getState().restaurar();
    await useGuardaRoupa.getState().restaurar();

    expect(useEstilo.getState().perfil.interacoes).toBe(antes.interacoes);
    expect(useEstilo.getState().perfil.estilos.classico).toBeCloseTo(
      antes.estilos.classico,
      10,
    );
    expect(useGuardaRoupa.getState().pecas).toHaveLength(3);
  });
});
