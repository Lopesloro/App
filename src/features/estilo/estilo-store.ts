import { create } from 'zustand';

import { CHAVES_LOCAIS, gravarJson, lerJson } from '@/lib/armazenamento-local';
import { registrarLimpezaDeSessao } from '@/lib/limpeza-sessao';
import type { TipoRoupa } from '@/features/roupas/tipos';
import {
  aprender,
  migrarPerfil,
  perfilVazio,
  type PerfilEstilo,
  type SinalEstilo,
} from './perfil-estilo';

/**
 * O perfil de estilo aprendido, guardado no aparelho.
 *
 * Fica no armazenamento comum, e nao no cofre: nao e credencial. Mas E dado
 * pessoal — diz o que a usuaria gosta de vestir —, entao nunca sai do
 * aparelho e some junto com a conta quando ela sai (ver a limpeza no fim
 * deste arquivo).
 */
type EstadoEstilo = {
  perfil: PerfilEstilo;
  carregado: boolean;
  restaurar: () => Promise<void>;
  /** Ensina o algoritmo com uma peca. */
  registrar: (roupa: TipoRoupa, sinal: SinalEstilo) => Promise<void>;
  /** Apaga o que foi aprendido, a pedido da usuaria. */
  esquecer: () => Promise<void>;
};

export const useEstilo = create<EstadoEstilo>((set, get) => ({
  perfil: perfilVazio(),
  carregado: false,

  restaurar: async () => {
    const bruto = await lerJson<unknown>(CHAVES_LOCAIS.perfilEstilo, null);
    set({ perfil: migrarPerfil(bruto), carregado: true });
  },

  registrar: async (roupa: TipoRoupa, sinal: SinalEstilo) => {
    // Mesma razao do guarda-roupa: aprender antes de terminar a leitura
    // gravaria um perfil de uma interacao so por cima do que ja existia.
    if (!get().carregado) return;

    const perfil = aprender(get().perfil, roupa, sinal);
    set({ perfil });
    await gravarJson(CHAVES_LOCAIS.perfilEstilo, perfil);
  },

  esquecer: async () => {
    const perfil = perfilVazio();
    set({ perfil, carregado: true });
    await gravarJson(CHAVES_LOCAIS.perfilEstilo, perfil);
  },
}));

// Sair da conta esquece o gosto aprendido. Sem isto, a proxima pessoa a usar
// o celular receberia recomendacoes formadas pelo armario de outra.
registrarLimpezaDeSessao(() => {
  useEstilo.setState({ perfil: perfilVazio(), carregado: false });
});
