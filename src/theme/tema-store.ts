import { create } from 'zustand';

import { CHAVES_LOCAIS, gravarJson, lerJson } from '@/lib/armazenamento-local';
import { ehIdTema, TEMAS, TEMA_PADRAO, type IdTema, type Tema } from './temas';

/**
 * Front ativo. A escolha e preferencia da usuaria, nao dado sensivel —
 * por isso vai no armazenamento comum, nunca no cofre.
 */
type EstadoTema = {
  id: IdTema;
  carregado: boolean;
  restaurar: () => Promise<void>;
  escolher: (id: IdTema) => Promise<void>;
};

export const useTemaStore = create<EstadoTema>((set) => ({
  id: TEMA_PADRAO,
  carregado: false,

  restaurar: async () => {
    const salvo = await lerJson<unknown>(CHAVES_LOCAIS.tema, TEMA_PADRAO);
    // Valor adulterado ou de uma versao antiga volta ao padrao, em vez de
    // deixar o app sem paleta e com tela em branco.
    set({ id: ehIdTema(salvo) ? salvo : TEMA_PADRAO, carregado: true });
  },

  escolher: async (id: IdTema) => {
    set({ id });
    await gravarJson(CHAVES_LOCAIS.tema, id);
  },
}));

/** Tema completo (paleta + raios) da direcao ativa. */
export function useTema(): Tema {
  const id = useTemaStore((estado) => estado.id);
  return TEMAS[id];
}

/** Atalho para quem so precisa das cores. */
export function usePaleta() {
  return useTema().paleta;
}
