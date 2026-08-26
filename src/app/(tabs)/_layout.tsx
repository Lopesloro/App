import { Tabs } from 'expo-router';

import {
  IconeGuardaRoupa,
  IconePerfil,
  IconeRoupas,
} from '@/components/ui/icones';
import { usePaleta } from '@/theme/tema-store';
import { espaco, tipografia } from '@/theme/tokens';

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
        tabBarLabelStyle: {
          fontSize: tipografia.legenda.fontSize,
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: paleta.surface,
          borderTopColor: paleta.border,
          height: 62,
          paddingTop: espaco.sm,
        },
        sceneStyle: { backgroundColor: paleta.bg },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Roupas',
          tabBarIcon: ({ color }) => <IconeRoupas cor={color} />,
        }}
      />
      <Tabs.Screen
        name="guarda-roupa"
        options={{
          title: 'Guarda-roupa',
          tabBarIcon: ({ color }) => <IconeGuardaRoupa cor={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <IconePerfil cor={color} />,
        }}
      />

      {/* Fora da barra, vivas no codigo. Ver o comentario acima. */}
      <Tabs.Screen name="feed" options={{ href: null }} />
      <Tabs.Screen name="salvos" options={{ href: null }} />
    </Tabs>
  );
}
