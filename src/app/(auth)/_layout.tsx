import { Stack } from 'expo-router';

import { usePaleta } from '@/theme/tema-store';

export default function LayoutAuth() {
  const paleta = usePaleta();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: paleta.bg },
      }}
    />
  );
}
