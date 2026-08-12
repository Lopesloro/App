import { QueryClient } from '@tanstack/react-query';

import { ErroApi } from './api-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: (tentativa, erro) => {
        // Nao insistir em erro de credencial ou de permissao.
        if (erro instanceof ErroApi && [401, 403, 404].includes(erro.status)) {
          return false;
        }
        return tentativa < 2;
      },
    },
    mutations: { retry: 0 },
  },
});
