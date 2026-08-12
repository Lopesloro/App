---
title: Base do app — testes
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - base
  - testes
tipo: registro-de-teste
status: aprovado
---

# Base do app — testes

| Campo | Valor |
|---|---|
| Data | 2026-08-12 |
| Executor | Equipe de desenvolvimento |
| Escopo | Fundação do app (issue [#48](https://github.com/Lopesloro/App/issues/48)) |
| Resultado | ✅ 31 testes passando |

## O cofre da senha

| Teste | O que garante na prática |
|---|---|
| Guarda e lê um token | O básico funciona |
| Chave que não existe devolve "nada" | App não quebra na primeira abertura, quando o cofre está vazio |
| Remove uma chave | Dá pra apagar credencial |
| **Recusa valor vazio** | Não grava credencial em branco por engano — isso deixaria a usuária num limbo de "logada com nada" |
| **Grava com as duas travas de segurança** | Confirma que só abre com celular desbloqueado e não vai em backup. Sem este teste, alguém poderia remover a configuração sem ninguém notar |
| **Sair apaga as 3 chaves** | Nenhum resto de credencial fica no aparelho após o logout |

## As regras de e-mail e senha

| Teste | O que garante na prática |
|---|---|
| Aceita e-mail e senha válidos | O caminho normal funciona |
| Recusa e-mail malformado | Erro aparece antes de gastar chamada no servidor |
| Recusa senha com menos de 8 caracteres | Regra mínima de segurança valendo |
| **Recusa senha gigante (mais de 128)** | Evita que alguém mande um texto enorme pra tentar derrubar o servidor |
| Tira espaço sobrando do e-mail | Colar e-mail com espaço não vira "e-mail inválido" à toa |
| Medidor de força classifica certo | 6 casos testados, de "curta" a "S3nha!Muito#Boa" |

## Os preços dos planos

| Teste | O que garante na prática |
|---|---|
| Grátis é R$ 0 | — |
| **Medium é exatamente R$ 19,90** | Trava contra mudança acidental de preço |
| **Premium é exatamente R$ 24,90** | Idem |
| Diferença entre eles é exatamente R$ 5 | A estratégia de ancoragem continua de pé |
| São exatamente 3 planos | Ninguém adiciona um quarto sem decisão sua |
| Só um plano em destaque | A tela de planos não fica com dois "recomendados" |
| Só o Grátis fica sem código de loja | Plano pago sem código não cobra — pegaria isso antes de ir pro ar |
| Preço escrito bate com o valor | Não mostra "R$ 19,90" cobrando R$ 24,90 |
| Formata centavos certo | 5 casos, de R$ 0,05 a R$ 199,00 |

## Verificações fora dos testes automáticos

| Verificação | Resultado |
|---|---|
| O app compila e gera o pacote final | ✅ 4,4 MB |
| Conferência de tipos (`npm run typecheck`) | ✅ zero erro |
| Conferência de estilo de código (`npm run lint`) | ✅ 30 arquivos, zero problema |
| Esteira de segurança no GitHub (5 verificações) | ✅ todas verdes |

## O que **não** foi testado

- **Nada foi testado em celular de verdade** — falta gerar o build (precisa de conta Expo).
- **O cofre foi testado com uma imitação**, não com o Keychain/Keystore real. Isso só dá pra fazer em aparelho.
- **A conversa com o servidor não foi testada de ponta a ponta** porque o servidor não existe.

Voltar: [[o-que-e]] · [[como-funciona]]
