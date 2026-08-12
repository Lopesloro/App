import { create } from 'zustand';

import {
  CHAVES,
  guardar,
  ler,
  limparCredenciais,
} from '@/lib/armazenamento-seguro';
import type { Sessao, Usuaria } from './schemas';

/**
 * Estado da sessao da usuaria.
 *
 * Os tokens NAO ficam neste store — eles vivem apenas no armazenamento seguro
 * (Keychain/Keystore). O store guarda somente o perfil publico e o estado de
 * carregamento, para nao expor credencial em devtools, snapshot de estado ou
 * relatorio de crash. Ver docs/06-seguranca.md.
 */
type EstadoSessao = {
  usuaria: Usuaria | null;
  carregando: boolean;
  autenticada: boolean;
  /** Le o que ja existe no cofre ao abrir o app. */
  restaurar: () => Promise<void>;
  /** Persiste tokens no cofre e coloca a usuaria em memoria. */
  entrar: (sessao: Sessao) => Promise<void>;
  /** Limpa cofre e memoria. */
  sair: () => Promise<void>;
  atualizarUsuaria: (usuaria: Usuaria) => void;
};

export const useSessao = create<EstadoSessao>((set) => ({
  usuaria: null,
  carregando: true,
  autenticada: false,

  restaurar: async () => {
    set({ carregando: true });
    try {
      const token = await ler(CHAVES.tokenAcesso);
      // O perfil e recarregado da API quando ha token; ate la, so marcamos
      // que existe sessao para o roteador nao mandar a usuaria pro login.
      set({ autenticada: token !== null, carregando: false });
    } catch {
      set({ autenticada: false, usuaria: null, carregando: false });
    }
  },

  entrar: async (sessao: Sessao) => {
    await guardar(CHAVES.tokenAcesso, sessao.tokenAcesso);
    await guardar(CHAVES.tokenRefresh, sessao.tokenRefresh);
    await guardar(CHAVES.idUsuaria, sessao.usuaria.id);
    set({ usuaria: sessao.usuaria, autenticada: true, carregando: false });
  },

  sair: async () => {
    await limparCredenciais();
    set({ usuaria: null, autenticada: false, carregando: false });
  },

  atualizarUsuaria: (usuaria: Usuaria) => set({ usuaria }),
}));
