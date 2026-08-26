import { useCallback } from 'react';

import { useEstilo } from '@/features/estilo/estilo-store';
import type { TipoRoupa } from '@/features/roupas/tipos';
import { useGuardaRoupa } from './guarda-roupa-store';

/**
 * O unico caminho para marcar ou desmarcar uma peca.
 *
 * Marcar faz duas coisas que precisam andar juntas: guardar a peca e ensinar
 * o algoritmo de estilo. Se cada tela chamasse os dois stores na mao, bastava
 * uma esquecer o segundo passo para o app parar de aprender em silencio —
 * ninguem percebe que uma recomendacao nao melhorou.
 *
 * Os dois stores continuam sem se conhecer: quem costura e este gancho.
 */
export function useMarcarPeca() {
  const alternarNoArmario = useGuardaRoupa((estado) => estado.alternar);
  const registrarNoEstilo = useEstilo((estado) => estado.registrar);

  return useCallback(
    async (roupa: TipoRoupa): Promise<{ guardada: boolean } | null> => {
      const resultado = await alternarNoArmario(roupa.id);

      // Leitura do aparelho ainda em curso: nada foi guardado, entao tambem
      // nao ha o que ensinar.
      if (!resultado.ok) return null;

      await registrarNoEstilo(roupa, resultado.guardada ? 'guardou' : 'removeu');

      return { guardada: resultado.guardada };
    },
    [alternarNoArmario, registrarNoEstilo],
  );
}
