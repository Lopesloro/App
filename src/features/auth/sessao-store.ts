import { create } from 'zustand';

import {
  CHAVES_LOCAIS,
  gravarJson,
  lerJson,
  limparDadosLocais,
} from '@/lib/armazenamento-local';
import {
  CHAVES,
  guardar,
  ler,
  limparCredenciais,
} from '@/lib/armazenamento-seguro';
import { limparTudoDaSessao } from '@/lib/limpeza-sessao';
import { queryClient } from '@/lib/query-client';
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
  /**
   * Entrou sem conta. Diferente de `autenticada`: nao ha token, nao ha
   * servidor e nada dela existe fora deste aparelho.
   */
  visitante: boolean;
  /** Le o que ja existe no cofre ao abrir o app. */
  restaurar: () => Promise<void>;
  /** Persiste tokens no cofre e coloca a usuaria em memoria. */
  entrar: (sessao: Sessao) => Promise<void>;
  /** Abre o app sem conta. Ver o comentario da implementacao. */
  entrarSemConta: () => Promise<void>;
  /** Limpa cofre e memoria. */
  sair: () => Promise<void>;
  atualizarUsuaria: (usuaria: Usuaria) => void;
};

/** Consegue usar o app? Com conta ou sem, a resposta e a mesma porta. */
export function podeUsarOApp(estado: Pick<EstadoSessao, 'autenticada' | 'visitante'>) {
  return estado.autenticada || estado.visitante;
}

export const useSessao = create<EstadoSessao>((set) => ({
  usuaria: null,
  carregando: true,
  autenticada: false,
  visitante: false,

  restaurar: async () => {
    set({ carregando: true });
    // Quem entrou sem conta continua entrando sem conta na proxima abertura.
    // Nao e credencial, entao mora no armazenamento comum, e nao no cofre.
    const visitante = await lerJson<boolean>(CHAVES_LOCAIS.modoVisitante, false);

    try {
      const token = await ler(CHAVES.tokenAcesso);
      // O perfil e recarregado da API quando ha token; ate la, so marcamos
      // que existe sessao para o roteador nao mandar a usuaria pro login.
      set({
        autenticada: token !== null,
        visitante: visitante === true,
        carregando: false,
      });
    } catch {
      // Sem cofre disponivel (navegador, por exemplo) nao ha como haver
      // token — mas quem entrou sem conta nao pode ser expulso por isso.
      set({
        autenticada: false,
        usuaria: null,
        visitante: visitante === true,
        carregando: false,
      });
    }
  },

  entrar: async (sessao: Sessao) => {
    await guardar(CHAVES.tokenAcesso, sessao.tokenAcesso);
    await guardar(CHAVES.tokenRefresh, sessao.tokenRefresh);
    await guardar(CHAVES.idUsuaria, sessao.usuaria.id);
    set({ usuaria: sessao.usuaria, autenticada: true, carregando: false });
  },

  /**
   * Entrar sem conta.
   *
   * Hoje o app inteiro funciona no aparelho: o catalogo esta embutido, o
   * guarda-roupa e local e o algoritmo de estilo roda aqui. Nada disso
   * precisa de servidor — entao exigir cadastro seria pedir dado pessoal
   * para entregar o que ja funciona sem ele, o que contraria o pilar de
   * privacidade do projeto (docs/06-seguranca.md).
   *
   * Nao ha token, nao ha nome e nao ha nada no cofre. So uma marca local
   * dizendo que a porta ja foi aberta uma vez.
   *
   * Quando o login de verdade existir (issue #6), esta porta continua: ela
   * vira o "experimentar antes de criar conta", e a conta passa a servir
   * para o que realmente precisa de servidor — sincronizar entre celulares.
   */
  entrarSemConta: async () => {
    await gravarJson(CHAVES_LOCAIS.modoVisitante, true);
    set({ visitante: true, carregando: false });
  },

  /**
   * Sair apaga TUDO que a sessao deixou no aparelho, nao so o token.
   *
   * Um celular passa de mao em mao. Se a saida limpasse so a credencial, a
   * proxima pessoa a entrar herdaria a colecao de looks, o guarda-roupa e o
   * perfil de estilo de quem usou antes — dado pessoal de uma usuaria
   * aparecendo na conta de outra (docs/06-seguranca.md).
   */
  sair: async () => {
    await limparCredenciais();
    await limparDadosLocais();
    // Cada store esquece o que tinha em memoria (looks salvos, guarda-roupa,
    // perfil de estilo). Sem isto, apagar o arquivo do aparelho nao adianta:
    // o estado ja lido continua na tela.
    await limparTudoDaSessao();
    // O cache guarda respostas da conta anterior; sem limpar, elas reaparecem
    // na tela antes da primeira busca da conta nova.
    queryClient.clear();
    set({ usuaria: null, autenticada: false, visitante: false, carregando: false });
  },

  atualizarUsuaria: (usuaria: Usuaria) => set({ usuaria }),
}));
