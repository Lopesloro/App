import { useQuery } from '@tanstack/react-query';

import { buscarLook } from './api';

/** Carrega um look pelo id, para a tela de detalhe. */
export function useLook(id: string | undefined) {
  const consulta = useQuery({
    queryKey: ['look', id],
    queryFn: () => buscarLook(id as string),
    enabled: Boolean(id),
  });

  return {
    look: consulta.data ?? null,
    carregando: consulta.isLoading,
    erro: consulta.error,
  };
}
