import AsyncStorage from '@react-native-async-storage/async-storage';

import { CHAVES_LOCAIS } from '@/lib/armazenamento-local';
import { useTemaStore } from '../tema-store';
import { ehIdTema, LISTA_TEMAS, TEMAS, TEMA_PADRAO } from '../temas';

beforeEach(async () => {
  await AsyncStorage.clear();
  useTemaStore.setState({ id: TEMA_PADRAO, carregado: false });
});

/**
 * Contraste no criterio WCAG. Duplicado aqui de proposito: o teste precisa
 * ser independente do codigo que ele verifica, senao um erro na formula
 * passaria despercebido nos dois lados.
 */
function razaoDeContraste(corA: string, corB: string): number {
  const canal = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const luminancia = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    return (
      0.2126 * canal((n >> 16) & 255) +
      0.7152 * canal((n >> 8) & 255) +
      0.0722 * canal(n & 255)
    );
  };
  const [claro, escuro] = [luminancia(corA), luminancia(corB)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

describe('as tres direcoes visuais', () => {
  it('existem exatamente tres', () => {
    expect(LISTA_TEMAS).toHaveLength(3);
  });

  it('o padrao e o futurista, por decisao do fundador', () => {
    expect(TEMA_PADRAO).toBe('neon-futuro');
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
      'inkSobrePrimario',
    ] as const;

    for (const tema of LISTA_TEMAS) {
      for (const campo of campos) {
        expect(tema.paleta[campo]).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    }
  });

  it('nenhuma direcao se parece com outra', () => {
    const primarios = LISTA_TEMAS.map((t) => t.paleta.primary);
    const fundos = LISTA_TEMAS.map((t) => t.paleta.bg);

    expect(new Set(primarios).size).toBe(LISTA_TEMAS.length);
    expect(new Set(fundos).size).toBe(LISTA_TEMAS.length);
  });

  it('texto principal nunca e preto puro nem igual ao fundo', () => {
    for (const tema of LISTA_TEMAS) {
      expect(tema.paleta.ink.toUpperCase()).not.toBe('#000000');
      expect(tema.paleta.ink).not.toBe(tema.paleta.bg);
    }
  });

  it('a marca de escuro bate com o fundo de verdade', () => {
    // Se isto divergir, a barra de status fica invisivel: relogio escuro em
    // fundo escuro, ou claro em fundo claro.
    for (const tema of LISTA_TEMAS) {
      const fundoEscuro = razaoDeContraste(tema.paleta.bg, '#FFFFFF') > 4.5;
      expect(tema.escuro).toBe(fundoEscuro);
    }
  });
});

describe('acessibilidade de cor (WCAG AA)', () => {
  it('texto principal passa em AA sobre o fundo e sobre a superficie', () => {
    for (const tema of LISTA_TEMAS) {
      expect(razaoDeContraste(tema.paleta.ink, tema.paleta.bg)).toBeGreaterThanOrEqual(4.5);
      expect(
        razaoDeContraste(tema.paleta.ink, tema.paleta.surface),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('texto suave passa em AA — e o mais usado nas legendas', () => {
    for (const tema of LISTA_TEMAS) {
      expect(
        razaoDeContraste(tema.paleta.inkSoft, tema.paleta.bg),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('texto sobre o botao primario passa em AA', () => {
    // Este e o par que quebrava no tema escuro antes de existir
    // `inkSobrePrimario`: branco sobre neon claro.
    for (const tema of LISTA_TEMAS) {
      expect(
        razaoDeContraste(tema.paleta.inkSobrePrimario, tema.paleta.primary),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('a cor de erro se distingue do fundo', () => {
    for (const tema of LISTA_TEMAS) {
      expect(razaoDeContraste(tema.paleta.danger, tema.paleta.bg)).toBeGreaterThanOrEqual(3);
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
