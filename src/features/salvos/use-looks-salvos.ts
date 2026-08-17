import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { buscarLook } from '@/features/feed/api';
import type { Look } from '@/features/feed/tipos';
import { useSalvos } from './salvos-store';

/**
 * Carrega os looks salvos, na ordem em que foram salvos (mais recente primeiro).
 *
 * Guardamos so os ids, entao aqui buscamos cada look no catalogo. Look que
 * saiu do catalogo (removido pela curadoria) simplesmente nao aparece — em
 * vez de virar card quebrado.
 */
export function useLooksSalvos() {
  const ids = useSalvos((estado) => estado.ids);
  const carregado = useSalvos((estado) => estado.carregado);

  const consulta = useQuery({
    // Chave em texto, e nao o array: o array muda de identidade a cada
    // renderizacao e criava entrada nova no cache a cada toque no coracao.
    queryKey: ['looks-salvos', ids.join(',')],
    queryFn: async (): Promise<Look[]> => {
      const encontrados = await Promise.all(ids.map((id) => buscarLook(id)));
      return encontrados.filter((look): look is Look => look !== null);
    },
    enabled: carregado,
    // Remover um look troca a chave; sem isto a tela inteira virava spinner
    // e recarregava todos os outros looks so para tirar um da lista.
    placeholderData: keepPreviousData,
  });

  const looks = consulta.data ?? [];

  return {
    looks,
    /**
     * Quantos ids estavam salvos mas nao existem mais no catalogo.
     * Nunca negativo: durante a troca de chave a lista anterior fica na tela
     * por um instante e pode ter mais looks do que ha ids agora.
     */
    indisponiveis: Math.max(0, ids.length - looks.length),
    carregando: !carregado || consulta.isLoading,
    erro: consulta.error,
  };
}
