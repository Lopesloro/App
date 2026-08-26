import { useMemo } from 'react';

import { buscarRoupaPorId } from '@/features/roupas/busca';
import { agruparPorCategoria, type TipoRoupa } from '@/features/roupas/tipos';
import { useGuardaRoupa } from './guarda-roupa-store';

export type PecaNoArmario = {
  roupa: TipoRoupa;
  guardadaEm: number;
};

/**
 * O armario pronto para a tela: pecas resolvidas no catalogo, agrupadas por
 * categoria e na ordem em que se veste o corpo.
 *
 * Peca cujo id sumiu do catalogo simplesmente nao aparece, em vez de virar
 * cartao quebrado. `desconhecidas` conta quantas foram — a tela pode avisar
 * em vez de deixar a usuaria achando que perdeu algo sem explicacao.
 */
export function useArmario() {
  const pecas = useGuardaRoupa((estado) => estado.pecas);
  const carregado = useGuardaRoupa((estado) => estado.carregado);

  return useMemo(() => {
    const resolvidas: PecaNoArmario[] = [];

    for (const guardada of pecas) {
      const roupa = buscarRoupaPorId(guardada.id);
      if (roupa) resolvidas.push({ roupa, guardadaEm: guardada.guardadaEm });
    }

    return {
      carregado,
      total: resolvidas.length,
      desconhecidas: pecas.length - resolvidas.length,
      /** Mais recentes primeiro — para "o que voce guardou por ultimo". */
      recentes: [...resolvidas].sort((a, b) => b.guardadaEm - a.guardadaEm),
      grupos: agruparPorCategoria(resolvidas.map((p) => p.roupa)),
    };
  }, [pecas, carregado]);
}
