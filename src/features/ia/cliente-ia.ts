import { api } from '@/lib/api-client';
import { IA_ATIVA } from '@/lib/flags';
import type { Categoria } from '@/features/estilo/vocabulario';

/**
 * Acesso a modelo de IA — SEMPRE pelo nosso servidor, NUNCA direto no Google.
 *
 * ## A regra que este arquivo existe para impor
 *
 * **A chave do Gemini nao pode entrar no aplicativo. Nunca.**
 *
 * Isso nao e preferencia nem excesso de zelo: e uma propriedade do que um app
 * de celular e. O bundle vai inteiro para o aparelho de quem instala, e
 * qualquer pessoa consegue abrir e ler o que tem dentro — nao existe
 * ofuscacao, variavel de ambiente ou `EXPO_PUBLIC_` que mude isso. Uma chave
 * embutida e uma chave publicada.
 *
 * E o estrago nao e teorico: quem extrai a chave gasta a cota na conta do
 * fundador, e a fatura chega para ele.
 *
 * ## Como fica, entao
 *
 * ```
 *   app  ──►  nosso servidor  ──►  Gemini
 *             (guarda a chave)
 *             (limita o uso por usuaria)
 *             (registra o que foi pedido)
 * ```
 *
 * O app manda o pedido para a nossa API; a API tem a chave e fala com o
 * Google. Assim a chave fica num lugar so, da para cortar abuso, e trocar de
 * fornecedor de IA nao exige atualizar o app na loja.
 *
 * ## Por que ainda esta desligado
 *
 * A API nao existe (issue #6 abre esse caminho). Enquanto nao existir, `IA_ATIVA`
 * fica `false` e estas funcoes recusam de forma explicita, em vez de tentar
 * uma chamada que falharia de um jeito confuso.
 *
 * ## E o pilar de privacidade?
 *
 * O perfil de estilo continua fora disto. Ele e calculado no aparelho e nao
 * entra em nenhuma chamada daqui — o que passa por IA e a FOTO que a usuaria
 * escolher enviar, uma de cada vez, com consentimento por envio. Foto de
 * pessoa e dado sensivel (docs/06-seguranca.md), entao antes de a primeira
 * chamada existir de verdade precisam estar prontos: consentimento separado
 * (issue #36), remocao de EXIF e registro de acesso (issue #40).
 */

export class IaIndisponivel extends Error {
  constructor(readonly motivo: 'desligada' | 'sem-servidor') {
    super(
      motivo === 'desligada'
        ? 'O reconhecimento por foto ainda não está disponível.'
        : 'Não conseguimos falar com o servidor agora.',
    );
    this.name = 'IaIndisponivel';
  }
}

export type PecaReconhecida = {
  /** Id de um tipo do nosso catalogo, quando o modelo reconhece um. */
  idRoupa: string | null;
  categoria: Categoria | null;
  /** 0 a 1. Abaixo de 0,6 a tela deve pedir confirmacao, nao afirmar. */
  confianca: number;
};

/**
 * Manda uma foto de peca para o servidor identificar.
 *
 * Recebe a referencia de um arquivo ja enviado (issue #11 cuida do upload com
 * URL assinada), e nao os bytes: assim a imagem nao trafega duas vezes e nao
 * fica em memoria no app.
 */
export async function identificarPeca(
  referenciaDaFoto: string,
): Promise<PecaReconhecida> {
  if (!IA_ATIVA) throw new IaIndisponivel('desligada');

  return api.post<PecaReconhecida>('/ia/identificar-peca', {
    foto: referenciaDaFoto,
  });
}
