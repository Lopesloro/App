import type { ExpoConfig } from 'expo/config';

/**
 * Configuracao do app por ambiente.
 * O ambiente vem de APP_ENV (development | preview | production).
 * Nenhum segredo mora aqui — apenas valores publicos. Ver docs/06-seguranca.md.
 */
const AMBIENTE = (process.env.APP_ENV ?? 'development') as
  | 'development'
  | 'preview'
  | 'production';

const NOMES: Record<typeof AMBIENTE, string> = {
  development: 'Monta Looks (dev)',
  preview: 'Monta Looks (preview)',
  production: 'Monta Looks',
};

const IDENTIFICADORES: Record<typeof AMBIENTE, string> = {
  development: 'br.com.montalooks.app.dev',
  preview: 'br.com.montalooks.app.preview',
  production: 'br.com.montalooks.app',
};

const config: ExpoConfig = {
  name: NOMES[AMBIENTE],
  slug: 'monta-looks',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'montalooks',
  userInterfaceStyle: 'light',
  ios: {
    bundleIdentifier: IDENTIFICADORES[AMBIENTE],
    supportsTablet: false,
    infoPlist: {
      NSCameraUsageDescription:
        'Usamos a camera para voce fotografar suas pecas e montar seu closet. Suas fotos ficam privadas.',
      NSPhotoLibraryUsageDescription:
        'Usamos sua galeria para voce adicionar pecas ao closet. Suas fotos ficam privadas.',
      NSFaceIDUsageDescription:
        'Use Face ID para proteger o acesso ao seu closet.',
    },
  },
  android: {
    package: IDENTIFICADORES[AMBIENTE],
    adaptiveIcon: {
      backgroundColor: '#FAF7F2',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    permissions: ['android.permission.USE_BIOMETRIC'],
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-local-authentication',
      {
        faceIDPermission: 'Use Face ID para proteger o acesso ao seu closet.',
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#FAF7F2',
        image: './assets/images/splash-icon.png',
        imageWidth: 160,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    ambiente: AMBIENTE,
    // URL publica da API — sem segredo. Sobrescrita por EXPO_PUBLIC_API_URL.
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
  },
};

export default config;
