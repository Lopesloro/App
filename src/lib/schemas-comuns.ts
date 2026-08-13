import { z } from 'zod';

/**
 * Schemas compartilhados entre features.
 *
 * Ficam aqui, e nao dentro de uma feature, para evitar importacao circular:
 * o feed precisa da taxonomia do closet e o closet precisa do id seguro. Com
 * os dois importando deste modulo neutro, nenhum depende do outro.
 *
 * (Isto foi encontrado rodando o app: em teste o ciclo passava despercebido,
 * mas no navegador quebrava com "Cannot access before initialization".)
 */

/**
 * Identificador seguro para uso em rota.
 *
 * O id vai direto na URL de navegacao (`/look/{id}`) e na chamada da API.
 * `z.string()` puro aceitaria `../paywall` ou `x?y=z`, que mudariam a rota
 * chamada. Restringimos ao conjunto que um id de verdade usa.
 */
export const idSeguroSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[A-Za-z0-9_-]+$/, 'Identificador com caracteres nao permitidos');

/**
 * URL segura para carregar ou abrir.
 *
 * ATENCAO: `z.string().url()` do zod aceita `javascript:`, `file:` e `data:`
 * — verificado em teste. Uma fonte externa comprometida poderia servir
 * `file:///...` e fazer o app tentar ler arquivo local do aparelho. Por isso
 * exigimos explicitamente http/https.
 */
export const urlSeguraSchema = z
  .string()
  .url()
  .refine(
    (valor) => {
      try {
        const protocolo = new URL(valor).protocol;
        return protocolo === 'https:' || protocolo === 'http:';
      } catch {
        return false;
      }
    },
    { message: 'Endereco precisa ser http ou https' },
  );
