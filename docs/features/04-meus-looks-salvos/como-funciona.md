---
title: Meus looks salvos — como funciona por dentro
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - salvos
  - decisoes
tipo: decisao-tecnica
status: ativo
---

# Meus looks salvos — como funciona

## As peças

| Arquivo | O que faz |
|---|---|
| `src/app/(tabs)/salvos.tsx` | A tela da coleção |
| `src/features/salvos/use-looks-salvos.ts` | Busca no catálogo os looks cujos códigos estão salvos |
| `src/components/look/cartao-look.tsx` | Ganhou o coração opcional |

## Decisão 1 — O coração é opcional no cartão

**O que fizemos:** o coração só aparece se a tela pedir. O detalhe do look continua com o botão grande "♥ Salvo".

**Por quê:** o mesmo cartão é usado no feed, nos salvos e (no futuro) na busca. Se o coração fosse fixo, apareceria em lugares onde não faz sentido — por exemplo, dentro de uma tela que já é sobre um look só.

## Decisão 2 — Tocar no coração não abre o look

**O que fizemos:** o toque no coração é isolado do toque no cartão.

**Por quê:** o coração fica **em cima** da foto, que também é botão. Sem isolar, salvar abriria o look junto — e a usuária cairia numa tela que não pediu. Tem teste garantindo que um toque dispara só uma ação.

Também demos área de toque extra ao coração: alvo pequeno sobre outro botão é receita de toque errado, e errar aqui é especialmente irritante porque leva pra outra tela.

## Decisão 3 — Look que sumiu do catálogo é filtrado

**O que fizemos:** ao montar a coleção, look não encontrado é descartado e contado.

**Por quê:** consequência de guardar só o código. O cartão quebrado seria pior que a ausência — e esconder sem avisar seria desonesto, por isso o rodapé conta quantos saíram.

## Decisão 4 — Endurecimento da validação de dados do catálogo

Esta parte não é da tela, mas foi encontrada revisando o código dela.

**O problema:** o código do look ia direto para a rota (`/look/{código}`) e o schema aceitava **qualquer texto**. Um código como `../paywall` mudaria a rota chamada. Pior: `z.string().url()` do zod **aceita `javascript:`, `file:` e `data:`** — verificado em teste. Um catálogo de parceiro comprometido poderia mandar uma foto apontando para `file:///...` e fazer o app tentar ler arquivo do aparelho.

**O que fizemos:**

| Campo | Antes | Agora |
|---|---|---|
| Código do look e da peça | qualquer texto | só letras, números, `-` e `_`, até 64 caracteres |
| Endereço da foto | qualquer "URL" | obrigatoriamente `http`/`https` |
| Link da loja | qualquer "URL" | obrigatoriamente `http`/`https` |
| Código na navegação | inserido cru | escapado antes de virar rota |

**Por quê agora:** o catálogo virá de planilha e de API de parceiro — fontes que não controlamos. Barrar na entrada é mais barato e mais confiável que lembrar de tratar em cada tela que usa o dado.

> [!info] Defesa em camadas
> O link de compra já era conferido na hora de abrir (feature 02). Agora também é conferido ao entrar. As duas camadas são de propósito: se alguém amanhã usar o link em outra tela e esquecer a conferência, o dado ruim nem chega lá.

Voltar: [[o-que-e]] · Testes: [[testes]]
