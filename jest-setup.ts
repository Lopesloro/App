// Matchers do @testing-library/react-native v13 ja vem embutidos — nao ha
// mais `extend-expect` para importar.

// Modulos nativos que nao existem no ambiente de teste.
jest.mock('expo-secure-store', () => {
  const cofre = new Map<string, string>();
  return {
    isAvailableAsync: jest.fn(async () => true),
    setItemAsync: jest.fn(async (chave: string, valor: string) => {
      cofre.set(chave, valor);
    }),
    getItemAsync: jest.fn(async (chave: string) => cofre.get(chave) ?? null),
    deleteItemAsync: jest.fn(async (chave: string) => {
      cofre.delete(chave);
    }),
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'whenUnlockedThisDeviceOnly',
    __cofre: cofre,
  };
});

jest.mock('expo-screen-capture', () => ({
  preventScreenCaptureAsync: jest.fn(async () => undefined),
  allowScreenCaptureAsync: jest.fn(async () => undefined),
}));

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(async () => true),
  isEnrolledAsync: jest.fn(async () => true),
  authenticateAsync: jest.fn(async () => ({ success: true })),
}));
