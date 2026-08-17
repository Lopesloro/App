import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Armazenamento local de dados NAO sensiveis (preferencias, looks salvos).
 *
 * NUNCA guardar credencial aqui — token e senha vao em
 * `armazenamento-seguro.ts`, que usa o cofre do sistema. Este armazenamento
 * e legivel por quem tiver acesso ao sistema de arquivos do app.
 *
 * A interface e proposital: toda leitura/escrita passa por aqui, entao trocar
 * a implementacao (por MMKV, que docs/05-frontend.md sugere para velocidade)
 * e mexer so neste arquivo.
 */

export const CHAVES_LOCAIS = {
  looksSalvos: 'ml.looks_salvos',
  ocasiaoPreferida: 'ml.ocasiao_preferida',
  tema: 'ml.tema',
  /** Pecas que a usuaria marcou como suas. */
  guardaRoupa: 'ml.guarda_roupa',
  /** Perfil de estilo aprendido no aparelho — nunca sai daqui. */
  perfilEstilo: 'ml.perfil_estilo',
  /** Entrou sem conta. Nao e credencial: e so "a porta ja foi aberta". */
  modoVisitante: 'ml.modo_visitante',
} as const;

export type ChaveLocal = (typeof CHAVES_LOCAIS)[keyof typeof CHAVES_LOCAIS];

export async function lerJson<T>(chave: ChaveLocal, padrao: T): Promise<T> {
  try {
    const bruto = await AsyncStorage.getItem(chave);
    if (bruto === null) return padrao;
    return JSON.parse(bruto) as T;
  } catch {
    // Dado corrompido nao pode derrubar o app: voltamos ao padrao. A usuaria
    // perde a preferencia, nao o acesso.
    return padrao;
  }
}

export async function gravarJson(chave: ChaveLocal, valor: unknown): Promise<void> {
  await AsyncStorage.setItem(chave, JSON.stringify(valor));
}

export async function remover(chave: ChaveLocal): Promise<void> {
  await AsyncStorage.removeItem(chave);
}

/** Limpa dados locais. Usar no logout, junto com `limparCredenciais()`. */
export async function limparDadosLocais(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(CHAVES_LOCAIS));
}
