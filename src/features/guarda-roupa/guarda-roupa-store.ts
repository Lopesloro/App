import { create } from 'zustand';

import { CHAVES_LOCAIS, gravarJson, lerJson } from '@/lib/armazenamento-local';
import { registrarLimpezaDeSessao } from '@/lib/limpeza-sessao';

/**
 * O guarda-roupa da usuaria: as pecas que ela marcou como suas.
 *
 * Guardamos so o id do tipo de roupa e a data em que ela marcou. O resto
 * (nome, categoria, estilo) vem do catalogo, entao corrigir a descricao de
 * uma peca corrige para todo mundo — em vez de deixar copias velhas
 * espalhadas pelos aparelhos.
 *
 * Nao ha foto aqui. Fotografar a peca de verdade chega na issue #11, e cada
 * item vai poder ganhar a imagem da usuaria sem que este formato mude: o id
 * continua sendo a chave.
 */

export type PecaGuardada = {
  id: string;
  /** Milissegundos desde 1970. Ordena o armario do mais recente ao mais antigo. */
  guardadaEm: number;
};

export type ResultadoGuardar =
  | { ok: true; guardada: boolean }
  | { ok: false; motivo: 'ainda-carregando' };

type EstadoGuardaRoupa = {
  pecas: PecaGuardada[];
  carregado: boolean;
  restaurar: () => Promise<void>;
  estaGuardada: (id: string) => boolean;
  alternar: (id: string, agora?: number) => Promise<ResultadoGuardar>;
  limpar: () => Promise<void>;
};

/** Aceita so o que tem a forma certa; o arquivo pode ter sido adulterado. */
function pecasValidas(bruto: unknown): PecaGuardada[] {
  if (!Array.isArray(bruto)) return [];

  const vistas = new Set<string>();
  const validas: PecaGuardada[] = [];

  for (const item of bruto) {
    if (typeof item !== 'object' || item === null) continue;
    const peca = item as Partial<PecaGuardada>;

    if (typeof peca.id !== 'string' || peca.id.length === 0) continue;
    // Id repetido no arquivo apareceria duas vezes na tela; fica a primeira.
    if (vistas.has(peca.id)) continue;

    vistas.add(peca.id);
    validas.push({
      id: peca.id,
      guardadaEm:
        typeof peca.guardadaEm === 'number' && Number.isFinite(peca.guardadaEm)
          ? peca.guardadaEm
          : 0,
    });
  }

  return validas;
}

export const useGuardaRoupa = create<EstadoGuardaRoupa>((set, get) => ({
  pecas: [],
  carregado: false,

  restaurar: async () => {
    const bruto = await lerJson<unknown>(CHAVES_LOCAIS.guardaRoupa, []);
    set({ pecas: pecasValidas(bruto), carregado: true });
  },

  estaGuardada: (id: string) => get().pecas.some((peca) => peca.id === id),

  alternar: async (id: string, agora = Date.now()): Promise<ResultadoGuardar> => {
    const { pecas, carregado } = get();

    // Marcar antes de `restaurar()` terminar gravaria um armario de uma peca
    // so por cima do que a usuaria ja tinha montado.
    if (!carregado) return { ok: false, motivo: 'ainda-carregando' };

    const jaTem = pecas.some((peca) => peca.id === id);
    const novas = jaTem
      ? pecas.filter((peca) => peca.id !== id)
      : // Mais recente primeiro: e a ordem em que o armario e mostrado.
        [{ id, guardadaEm: agora }, ...pecas];

    set({ pecas: novas });
    await gravarJson(CHAVES_LOCAIS.guardaRoupa, novas);

    return { ok: true, guardada: !jaTem };
  },

  limpar: async () => {
    set({ pecas: [] });
    await gravarJson(CHAVES_LOCAIS.guardaRoupa, []);
  },
}));

// Sair da conta esvazia o armario em memoria.
registrarLimpezaDeSessao(() => {
  useGuardaRoupa.setState({ pecas: [], carregado: false });
});
