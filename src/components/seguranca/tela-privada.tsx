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
 * Portanto isto reduz risco casual e NAO substitui as barreiras reais:
 * URL assinada de curta duracao e autorizacao por objeto no backend.
 *
 * @param chave identifica a tela; use um valor estavel e unico por rota.
 */
/**
 * No navegador o modulo nao existe, e chamar o hook derruba a tela com
 * "preventScreenCaptureAsync is not available on web".
 *
 * A escolha acontece uma vez, no carregamento do modulo — e nao dentro do
 * componente. Isso mantem a ordem dos hooks estavel, que e o que as regras
 * do React exigem: o que nao pode variar e a ordem entre renderizacoes, e
 * aqui ela nunca varia.
 */
const semBloqueio = (_chave: string): void => {};

const useBloqueioDeCaptura =
  Platform.OS === 'web' ? semBloqueio : usePreventScreenCapture;

export function useTelaPrivada(chave: string): void {
  useBloqueioDeCaptura(chave);
}

/** Versao declarativa, para usar dentro do JSX de uma rota. */
export function TelaPrivada({ chave }: { chave: string }): null {
  useTelaPrivada(chave);
  return null;
}
