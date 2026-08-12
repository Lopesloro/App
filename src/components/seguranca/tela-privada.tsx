import { Platform } from 'react-native';
import { usePreventScreenCapture } from 'expo-screen-capture';

/**
 * Bloqueia screenshot e gravacao de tela enquanto a tela estiver montada.
 *
 * Obrigatorio em toda tela que exibe foto pessoal da usuaria: closet,
 * provador e resultado do try-on (docs/06-seguranca.md).
 *
 * Usa `usePreventScreenCapture`, que controla o bloqueio por chave: com duas
 * telas privadas empilhadas, sair da de cima nao libera a captura enquanto a
 * de baixo continuar montada.
 *
 * LIMITE IMPORTANTE: no Android o bloqueio e real (FLAG_SECURE); no iOS o
 * sistema nao permite impedir a captura — o modulo apenas notifica o app.
 * Na web nao existe bloqueio nenhum. Portanto isto reduz risco casual e NAO
 * substitui as barreiras reais: URL assinada de curta duracao e autorizacao
 * por objeto no backend.
 *
 * @param chave identifica a tela; use um valor estavel e unico por rota.
 */
export function useTelaPrivada(chave: string): void {
  // A previa web nao tem o modulo nativo. Chamar o hook sempre (regra dos
  // hooks) e deixar a plataforma decidir o efeito: na web, chave vazia
  // desliga o bloqueio em vez de quebrar a tela.
  usePreventScreenCapture(Platform.OS === 'web' ? undefined : chave);
}

/** Versao declarativa, para usar dentro do JSX de uma rota. */
export function TelaPrivada({ chave }: { chave: string }): null {
  useTelaPrivada(chave);
  return null;
}
