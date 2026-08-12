import { Stack } from 'expo-router';

import { paleta } from '@/theme/tokens';

export default function LayoutAuth() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: paleta.bg },
      }}
    />
  );
}
