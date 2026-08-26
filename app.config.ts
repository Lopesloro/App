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

/**
 * Fundo da splash e do icone adaptativo.
 *
 * E o mesmo `bg` do tema padrao (NEON_FUTURO, em src/theme/tokens.ts). O
 * valor esta repetido porque este arquivo roda no Node, antes de o bundle
 * existir, e nao consegue importar o token. Ha teste conferindo que os dois
 * continuam iguais — se divergirem, a splash pisca claro antes do app escuro.
 */
export const FUNDO_DA_MARCA = '#070B14';

const config: ExpoConfig = {
  name: NOMES[AMBIENTE],
  slug: 'monta-looks',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'montalooks',
  userInterfaceStyle: 'dark',
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
      backgroundColor: FUNDO_DA_MARCA,
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    permissions: ['android.permission.USE_BIOMETRIC'],
  },
  // A web esta aqui como JANELA DE DESENVOLVIMENTO, nao como produto.
  //
  // docs/05-frontend.md descartou o PWA como produto principal, e isso nao
  // mudou: sem compra dentro do app, camera fraca no iOS e push limitado.
  // O produto continua sendo celular, e a landing page continua sendo um
  // projeto Next.js separado.
  //
  // O que mudou foi o acesso: o Expo Go da App Store esta travado no SDK 54
  // porque a Apple nao aprova as submissoes novas do Expo, e este projeto usa
  // o SDK 57. Sem a web, as unicas formas de ver o app em um iPhone sao o
  // Xcode (uns 10 GB) ou uma conta de desenvolvedor Apple (US$ 99/ano).
  //
  // `npm run web` abre o app no navegador em segundos, sem instalar nada.
  // Ver docs/COMO-VER-O-APP.md.
  platforms: ['ios', 'android', 'web'],
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
        backgroundColor: FUNDO_DA_MARCA,
        image: './assets/images/splash-icon.png',
        imageWidth: 160,
      },
    ],
  ],
  web: {
    // `static` gera um HTML por rota e usa o nosso `src/app/+html.tsx`. Com a
    // saida padrao (`single`) o Expo ignora esse arquivo e usa um template
    // proprio, que nasce branco.
    output: 'static',
    // Pinta a pagina antes de o React montar.
    //
    // Sem isto o navegador mostra branco no instante entre carregar o HTML e
    // o app desenhar — um flash claro violento num app de fundo escuro. O
    // mesmo vale para o arrasto alem do fim da pagina no celular, que revela
    // o fundo do documento.
    backgroundColor: FUNDO_DA_MARCA,
    themeColor: FUNDO_DA_MARCA,
  },
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
