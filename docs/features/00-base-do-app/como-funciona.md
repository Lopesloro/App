---
title: Base do app — como funciona por dentro
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - base
  - decisoes
tipo: decisao-tecnica
status: ativo
---

# Base do app — como funciona

## As peças

| Arquivo | O que faz |
|---|---|
| `src/theme/tokens.ts` | Todas as cores, tamanhos de letra e espaçamentos. Fonte única |
| `src/lib/armazenamento-seguro.ts` | O cofre da senha/token |
| `src/lib/api-client.ts` | Conversa com o servidor |
| `src/lib/config.ts` | Endereço do servidor e ambiente (dev/teste/produção) |
| `src/features/auth/schemas.ts` | Regras de e-mail e senha válidos |
| `src/features/auth/sessao-store.ts` | Quem está logada agora |
| `src/features/assinatura/planos.ts` | Os três planos e os preços |
| `src/components/seguranca/tela-privada.tsx` | Bloqueio de print |
| `src/components/ui/` | Botão e texto padrão do app |
| `src/app/` | As telas |

## Decisão 1 — Lista fechada de chaves no cofre

**O que fizemos:** só existem 3 chaves possíveis no cofre (token de acesso, token de renovação, id da usuária). Não dá pra inventar uma quarta.

**Por quê:** sem isso, daqui a seis meses alguém salva um dado sensível numa chave nova e ninguém percebe. Com a lista fechada, o próprio editor de código recusa.

## Decisão 2 — Erro nunca mostra detalhe interno

**O que fizemos:** o servidor pode responder o que quiser; a usuária sempre vê frase simples ("Sua sessão expirou. Entre novamente.").

**Por quê:** mensagem de erro crua entrega ao atacante pistas de como o sistema é feito por dentro. E, pra usuária, "500 Internal Server Error" não significa nada.

## Decisão 3 — Toda conversa com o servidor tem prazo

**O que fizemos:** 15 segundos. Passou disso, o app desiste e avisa.

**Por quê:** sem prazo, internet ruim deixa a tela girando pra sempre. A usuária acha que o app travou e desinstala.

## Decisão 4 — NativeWind não foi usado (desvio da documentação)

**O que fizemos:** o plano em [[../../05-frontend|05-frontend]] pedia NativeWind. Usamos o sistema de estilo nativo do React Native, alimentado pelo mesmo arquivo de cores.

**Por quê:** não deu pra confirmar que o NativeWind funciona com a versão nova do Expo (SDK 57), e quebrar a esteira de testes agora atrasaria tudo. Como as cores vêm do mesmo arquivo, adotar depois é trabalho mecânico.

> [!warning] Decisão sua
> Isso é um desvio consciente do que está documentado. Se preferir NativeWind desde já, é só falar — o custo é uma tarde testando compatibilidade.

## Decisão 5 — Português com acento no que a usuária lê

**O que fizemos:** nomes de variável e comentário ficam sem acento (evita problema de codificação entre Windows e Linux). **Todo texto que a usuária vê tem acento correto.**

**Por quê:** "Não conseguimos carregar" passa profissionalismo; "Nao conseguimos" passa app feito às pressas. O público é mulher brasileira num produto aspiracional.

Voltar: [[o-que-e]] · Testes: [[testes]]
