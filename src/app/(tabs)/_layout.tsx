import { Tabs } from 'expo-router';

import { usePaleta } from '@/theme/tema-store';
import { tipografia } from '@/theme/tokens';

/**
 * Tres abas, e nao cinco.
 *
 * O app tem uma tarefa: procurar tipo de roupa, marcar, montar o
 * guarda-roupa. "Roupas" e onde ela acontece; "Guarda-roupa" e o resultado
 * dela; "Perfil" guarda os ajustes. Nada mais compete por atencao.
 *
 * As telas do feed de indicacoes e dos looks salvos continuam no repositorio
 * e continuam funcionando — elas so saem da barra (`href: null`). Foi decisao
 * do fundador: nada sera vendido por enquanto, e feed com link de loja e
 * justamente a parte comercial. Quando voltar, e apagar as duas linhas.
 */
export default function LayoutTabs() {
  const paleta = usePaleta();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: paleta.primary,
        tabBarInactiveTintColor: paleta.inkSoft,
        tabBarLabelStyle: { fontSize: tipografia.legenda.fontSize },
        tabBarStyle: {
          backgroundColor: paleta.surface,
          borderTopColor: paleta.border,
        },
        sceneStyle: { backgroundColor: paleta.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Roupas' }} />
      <Tabs.Screen name="guarda-roupa" options={{ title: 'Guarda-roupa' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />

      {/* Fora da barra, vivas no codigo. Ver o comentario acima. */}
      <Tabs.Screen name="feed" options={{ href: null }} />
      <Tabs.Screen name="salvos" options={{ href: null }} />
    </Tabs>
  );
}
