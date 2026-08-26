import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Armazenamento seguro (Keychain no iOS / Keystore no Android).
 *
 * REGRA DO PROJETO (docs/06-seguranca.md): token de acesso, refresh token e
 * qualquer credencial vivem SOMENTE aqui. Nunca em AsyncStorage, MMKV,
 * variavel global ou log.
 *
 * As chaves sao um conjunto fechado — evita que codigo novo invente um lugar
 * paralelo para guardar credencial.
 */

export const CHAVES = {
  tokenAcesso: 'ml.token_acesso',
  tokenRefresh: 'ml.token_refresh',
  idUsuaria: 'ml.id_usuaria',
} as const;

export type ChaveSegura = (typeof CHAVES)[keyof typeof CHAVES];

/**
 * Item so e legivel com o device desbloqueado e nunca migra em backup para
 * outro aparelho. Reduz o estrago de um backup vazado.
 */
const OPCOES: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

/**
 * O navegador nao tem cofre do sistema.
 *
 * A web existe aqui so como janela de desenvolvimento (ver app.config.ts), e
 * a saida honesta e nao ter credencial nenhuma nela — em vez de cair no
 * localStorage, que qualquer script da pagina le. Guardar recusa alto e
 * claro; ler devolve "nao ha nada", que e a verdade.
 */
const SEM_COFRE = Platform.OS === 'web';

export async function guardar(chave: ChaveSegura, valor: string): Promise<void> {
  if (valor.length === 0) {
    throw new Error(`Valor vazio para a chave segura ${chave}`);
  }
  if (SEM_COFRE) {
    throw new Error(
      'Sem cofre do sistema nesta plataforma: credencial nao pode ser guardada.',
    );
  }
  await SecureStore.setItemAsync(chave, valor, OPCOES);
}

export async function ler(chave: ChaveSegura): Promise<string | null> {
  if (SEM_COFRE) return null;
  return SecureStore.getItemAsync(chave, OPCOES);
}

export async function remover(chave: ChaveSegura): Promise<void> {
  if (SEM_COFRE) return;
  await SecureStore.deleteItemAsync(chave, OPCOES);
}

/**
 * Apaga toda credencial local. Usar no logout, na troca de conta e ao detectar
 * refresh token reutilizado (possivel roubo de sessao).
 */
export async function limparCredenciais(): Promise<void> {
  await Promise.all(Object.values(CHAVES).map((chave) => remover(chave)));
}

/** O SecureStore nao existe em web; a chamada precisa degradar sem quebrar. */
export async function disponivel(): Promise<boolean> {
  if (SEM_COFRE) return false;
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}
