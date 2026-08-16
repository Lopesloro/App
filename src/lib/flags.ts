/**
 * Chaves de funcionalidade — o que esta ligado nesta versao do app.
 *
 * Existe para desligar area inteira do produto sem apagar o codigo dela.
 * Quando a decisao muda, muda a constante aqui, e nao 15 telas.
 */

/**
 * Comercio dentro do app: assinatura, paywall, limite por plano e link de
 * compra com comissao.
 *
 * DESLIGADO por decisao do fundador (agosto/2026): nada sera vendido por
 * enquanto. O codigo de planos, paywall e afiliado continua no repositorio,
 * testado e pronto para voltar — ver docs/features/06-sem-monetizacao/.
 *
 * O que muda com isto em `false`:
 * - nenhum limite de plano barra a usuaria;
 * - o paywall nao e alcancavel pela navegacao;
 * - nenhum botao leva para loja parceira nem promete comissao.
 *
 * Para reativar: trocar para `true`. Antes disso, conferir a lista de
 * pendencias comerciais do bloco 6 de docs/CHECKLIST.md (contas de loja,
 * RevenueCat, contratos de afiliado) — ligar a chave sem isso mostra preco
 * que ninguem consegue pagar.
 */
export const MONETIZACAO_ATIVA = false;

/**
 * Serve o catalogo de exemplo em vez de chamar a API.
 *
 * Fica explicito, e nao deduzido da URL da API: quando isto era
 * `apiUrl.includes('localhost')`, um build de producao sem a variavel de
 * ambiente configurada servia dados de exemplo achando que era producao.
 * Agora e uma decisao declarada, que so muda quando a API existir de fato.
 */
export const USAR_DADOS_EXEMPLO = true;
