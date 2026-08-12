import * as SecureStore from 'expo-secure-store';

import {
  CHAVES,
  guardar,
  ler,
  limparCredenciais,
  remover,
} from '../armazenamento-seguro';

const mockSecureStore = SecureStore as unknown as {
  __cofre: Map<string, string>;
  setItemAsync: jest.Mock;
};

beforeEach(() => {
  mockSecureStore.__cofre.clear();
  jest.clearAllMocks();
});

describe('armazenamento seguro de credenciais', () => {
  it('guarda e le um token', async () => {
    await guardar(CHAVES.tokenAcesso, 'token-123');
    await expect(ler(CHAVES.tokenAcesso)).resolves.toBe('token-123');
  });

  it('devolve null para chave inexistente', async () => {
    await expect(ler(CHAVES.tokenRefresh)).resolves.toBeNull();
  });

  it('remove uma chave', async () => {
    await guardar(CHAVES.tokenAcesso, 'token-123');
    await remover(CHAVES.tokenAcesso);
    await expect(ler(CHAVES.tokenAcesso)).resolves.toBeNull();
  });

  it('recusa valor vazio em vez de gravar credencial invalida', async () => {
    await expect(guardar(CHAVES.tokenAcesso, '')).rejects.toThrow(
      'Valor vazio',
    );
    expect(mockSecureStore.setItemAsync).not.toHaveBeenCalled();
  });

  it('grava com acesso restrito ao aparelho e so com ele desbloqueado', async () => {
    await guardar(CHAVES.tokenAcesso, 'token-123');
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
      CHAVES.tokenAcesso,
      'token-123',
      expect.objectContaining({
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      }),
    );
  });

  it('limparCredenciais nao deixa nenhuma chave para tras', async () => {
    await guardar(CHAVES.tokenAcesso, 'a');
    await guardar(CHAVES.tokenRefresh, 'b');
    await guardar(CHAVES.idUsuaria, 'c');

    await limparCredenciais();

    for (const chave of Object.values(CHAVES)) {
      await expect(ler(chave)).resolves.toBeNull();
    }
  });
});
