import { useInfiniteQuery } from '@tanstack/react-query';

import { buscarLooks, type FiltroFeed } from './api';
import type { Look } from './tipos';

export const chaveFeed = (filtro: FiltroFeed) => ['feed', filtro] as const;

/**
 * Feed paginado com rolagem infinita.
 *
 * `looks` ja vem achatado para o componente nao precisar saber que existem
 * paginas — a tela so recebe uma lista e um `carregarMais`.
 */
export function useFeed(filtro: FiltroFeed = {}) {
  const consulta = useInfiniteQuery({
    queryKey: chaveFeed(filtro),
    queryFn: ({ pageParam }) => buscarLooks(pageParam, filtro),
    initialPageParam: 0,
    getNextPageParam: (ultimaPagina) => ultimaPagina.proximoCursor,
  });

  const looks: Look[] = consulta.data?.pages.flatMap((p) => p.looks) ?? [];

  return {
    looks,
    total: consulta.data?.pages[0]?.total ?? 0,
    carregando: consulta.isLoading,
    erro: consulta.error,
    recarregando: consulta.isRefetching,
    recarregar: consulta.refetch,
    carregarMais: () => {
      if (consulta.hasNextPage && !consulta.isFetchingNextPage) {
        void consulta.fetchNextPage();
      }
    },
    carregandoMais: consulta.isFetchingNextPage,
    temMais: consulta.hasNextPage,
  };
}
