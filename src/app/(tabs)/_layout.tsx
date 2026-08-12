import { Tabs } from 'expo-router';

import { usePaleta } from '@/theme/tema-store';
import { tipografia } from '@/theme/tokens';

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
      <Tabs.Screen name="index" options={{ title: 'Looks' }} />
      <Tabs.Screen name="explorar" options={{ title: 'Explorar' }} />
      <Tabs.Screen name="salvos" options={{ title: 'Salvos' }} />
      <Tabs.Screen name="closet" options={{ title: 'Closet' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
