import AsyncStorage from '@react-native-async-storage/async-storage';

import { CHAVES_LOCAIS } from '@/lib/armazenamento-local';
import { useTemaStore } from '../tema-store';
import { ehIdTema, LISTA_TEMAS, TEMAS, TEMA_PADRAO } from '../temas';

beforeEach(async () => {
  await AsyncStorage.clear();
  useTemaStore.setState({ id: TEMA_PADRAO, carregado: false });
});

describe('os dois fronts', () => {
  it('existem exatamente dois', () => {
    expect(LISTA_TEMAS).toHaveLength(2);
  });

  it('cada um tem nome e descricao para a tela de escolha', () => {
    for (const tema of LISTA_TEMAS) {
      expect(tema.nome.length).toBeGreaterThan(0);
      expect(tema.descricao.length).toBeGreaterThan(0);
    }
  });

  it('cada um define a paleta completa', () => {
    const campos = [
      'bg', 'surface', 'ink', 'inkSoft', 'primary',
      'primarySoft', 'accent', 'gold', 'danger', 'border',
    ] as const;

    for (const tema of LISTA_TEMAS) {
      for (const campo of campos) {
        expect(tema.paleta[campo]).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    }
  });

  it('as duas direcoes sao visualmente distintas', () => {
    const [a, b] = LISTA_TEMAS;
    expect(a.paleta.primary).not.toBe(b.paleta.primary);
    expect(a.paleta.bg).not.toBe(b.paleta.bg);
  });

  it('texto principal nunca e preto puro nem igual ao fundo', () => {
    for (const tema of LISTA_TEMAS) {
      expect(tema.paleta.ink.toUpperCase()).not.toBe('#000000');
      expect(tema.paleta.ink).not.toBe(tema.paleta.bg);
    }
  });
});

describe('escolha do front', () => {
  it('comeca no padrao', () => {
    expect(useTemaStore.getState().id).toBe(TEMA_PADRAO);
  });

  it('troca de front', async () => {
    await useTemaStore.getState().escolher('vinho-moderno');
    expect(useTemaStore.getState().id).toBe('vinho-moderno');
  });

  it('a escolha continua depois de fechar o app', async () => {
    await useTemaStore.getState().escolher('vinho-moderno');

    useTemaStore.setState({ id: TEMA_PADRAO, carregado: false });
    await useTemaStore.getState().restaurar();

    expect(useTemaStore.getState().id).toBe('vinho-moderno');
  });

  it('primeira abertura usa o padrao sem quebrar', async () => {
    await useTemaStore.getState().restaurar();
    expect(useTemaStore.getState().id).toBe(TEMA_PADRAO);
    expect(useTemaStore.getState().carregado).toBe(true);
  });

  it('valor adulterado volta ao padrao em vez de deixar o app sem cor', async () => {
    await AsyncStorage.setItem(CHAVES_LOCAIS.tema, JSON.stringify('tema-inventado'));
    await useTemaStore.getState().restaurar();
    expect(useTemaStore.getState().id).toBe(TEMA_PADRAO);
  });

  it('arquivo corrompido volta ao padrao', async () => {
    await AsyncStorage.setItem(CHAVES_LOCAIS.tema, 'nao-e-json{{');
    await useTemaStore.getState().restaurar();
    expect(useTemaStore.getState().id).toBe(TEMA_PADRAO);
  });
});

describe('ehIdTema', () => {
  it('aceita os ids reais', () => {
    for (const id of Object.keys(TEMAS)) {
      expect(ehIdTema(id)).toBe(true);
    }
  });

  it.each([['inventado'], [''], [null], [42], [{}]])('recusa %p', (valor) => {
    expect(ehIdTema(valor)).toBe(false);
  });
});
