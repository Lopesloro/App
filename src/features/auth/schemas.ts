import { z } from 'zod';

/**
 * Schemas de autenticacao. Ficam em zod para serem reaproveitados pelo
 * backend e pela web (pacote de tipos compartilhado, docs/05-frontend.md).
 */

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Informe seu e-mail')
  .email('E-mail inválido');

/**
 * Minimo de 8 caracteres conforme criterio da issue #6. O medidor de forca e
 * calculado a parte (`forcaSenha`) — aqui fica so a barreira minima.
 */
export const senhaSchema = z
  .string()
  .min(8, 'A senha precisa de pelo menos 8 caracteres')
  .max(128, 'Senha muito longa');

export const credenciaisSchema = z.object({
  email: emailSchema,
  senha: senhaSchema,
});

export type Credenciais = z.infer<typeof credenciaisSchema>;

export const usuariaSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  email: emailSchema,
  plano: z.enum(['gratis', 'medium', 'premium']),
  concluiuQuizEstilo: z.boolean(),
});

export type Usuaria = z.infer<typeof usuariaSchema>;

export const sessaoSchema = z.object({
  tokenAcesso: z.string().min(1),
  tokenRefresh: z.string().min(1),
  usuaria: usuariaSchema,
});

export type Sessao = z.infer<typeof sessaoSchema>;

export type ForcaSenha = 'fraca' | 'media' | 'forte';

/**
 * Medidor de forca da senha (criterio da issue #6).
 * Heuristica local apenas para orientar a usuaria — a politica que vale e a
 * do backend, que tambem checa vazamentos conhecidos.
 */
export function forcaSenha(senha: string): ForcaSenha {
  if (senha.length < 8) return 'fraca';

  let variedade = 0;
  if (/[a-z]/.test(senha)) variedade++;
  if (/[A-Z]/.test(senha)) variedade++;
  if (/[0-9]/.test(senha)) variedade++;
  if (/[^a-zA-Z0-9]/.test(senha)) variedade++;

  if (senha.length >= 12 && variedade >= 3) return 'forte';
  if (senha.length >= 10 || variedade >= 3) return 'media';
  return 'fraca';
}
