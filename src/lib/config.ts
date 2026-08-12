import Constants from 'expo-constants';

type Ambiente = 'development' | 'preview' | 'production';

const extra = (Constants.expoConfig?.extra ?? {}) as {
  ambiente?: Ambiente;
  apiUrl?: string;
};

export const config = {
  ambiente: extra.ambiente ?? 'development',
  apiUrl: extra.apiUrl ?? 'http://localhost:3000',
  /** Margem para renovar o token antes de expirar de fato (segundos). */
  margemRenovacaoToken: 60,
} as const;

export const ehProducao = config.ambiente === 'production';
