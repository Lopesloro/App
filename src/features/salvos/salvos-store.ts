import { create } from 'zustand';

import { CHAVES_LOCAIS, gravarJson, lerJson } from '@/lib/armazenamento-local';
import type { IdPlano } from '@/features/assinatura/planos';
import { podeSalvarMais } from './limites';

/**
 * Looks salvos pela usuaria.
 *
 * Guardamos so os ids: o look em si vem do catalogo. Assim, se a curadoria
 * corrigir o preco ou trocar a foto, o look salvo aparece atualizado — em vez
 * de a usuaria ficar com uma copia velha e um preco que nao existe mais.
 */

export type ResultadoSalvar =
  | { ok: true; salvo: boolean }
  | { ok: false; motivo: 'limite-atingido' };

type EstadoSalvos = {
  ids: string[];
  carregado: boolean;
  restaurar: () => Promise<void>;
  estaSalvo: (id: string) => boolean;
  alternar: (id: string, plano: IdPlano) => Promise<ResultadoSalvar>;
  limpar: () => Promise<void>;
};

export const useSalvos = create<EstadoSalvos>((set, get) => ({
  ids: [],
  carregado: false,

  restaurar: async () => {
    const ids = await lerJson<string[]>(CHAVES_LOCAIS.looksSalvos, []);
    // Filtra lixo caso o arquivo tenha sido adulterado ou corrompido.
    const validos = Array.isArray(ids) ? ids.filter((i) => typeof i === 'string') : [];
    set({ ids: validos, carregado: true });
  },

  estaSalvo: (id: string) => get().ids.includes(id),

  alternar: async (id: string, plano: IdPlano): Promise<ResultadoSalvar> => {
    const { ids } = get();
    const jaSalvo = ids.includes(id);

    // Remover sempre pode: limite de plano nunca prende a usuaria aos
    // proprios dados.
    if (jaSalvo) {
      const novos = ids.filter((i) => i !== id);
      set({ ids: novos });
      await gravarJson(CHAVES_LOCAIS.looksSalvos, novos);
      return { ok: true, salvo: false };
    }

    if (!podeSalvarMais(plano, ids.length)) {
      return { ok: false, motivo: 'limite-atingido' };
    }

    // Mais recente primeiro: e a ordem que a tela "Meus looks" mostra.
    const novos = [id, ...ids];
    set({ ids: novos });
    await gravarJson(CHAVES_LOCAIS.looksSalvos, novos);
    return { ok: true, salvo: true };
  },

  limpar: async () => {
    set({ ids: [] });
    await gravarJson(CHAVES_LOCAIS.looksSalvos, []);
  },
}));
