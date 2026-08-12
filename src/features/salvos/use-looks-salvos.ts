import { useQuery } from '@tanstack/react-query';

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
    queryKey: ['looks-salvos', ids],
    queryFn: async (): Promise<Look[]> => {
      const encontrados = await Promise.all(ids.map((id) => buscarLook(id)));
      return encontrados.filter((look): look is Look => look !== null);
    },
    enabled: carregado,
  });

  const looks = consulta.data ?? [];

  return {
    looks,
    /** Quantos ids estavam salvos mas nao existem mais no catalogo. */
    indisponiveis: ids.length - looks.length,
    carregando: !carregado || consulta.isLoading,
    erro: consulta.error,
  };
}
