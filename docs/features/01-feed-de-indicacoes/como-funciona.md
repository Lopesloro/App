---
title: Feed de indicações — como funciona por dentro
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - feed
  - decisoes
tipo: decisao-tecnica
status: ativo
---

# Feed de indicações — como funciona

Explicação das decisões, em linguagem simples. Cada uma tem o **porquê**.

## As peças que montam essa tela

| Arquivo | O que faz |
|---|---|
| `src/features/feed/tipos.ts` | Define o que é um "look" e uma "peça" — quais campos existem e de que tipo |
| `src/features/feed/dados-exemplo.ts` | 8 looks de mentira pra desenvolver enquanto não há banco de dados |
| `src/features/feed/api.ts` | Busca os looks. Hoje pega do exemplo; amanhã pega do servidor |
| `src/features/feed/use-feed.ts` | Cuida da paginação e do "carregar mais" |
| `src/components/look/cartao-look.tsx` | O cartãozinho de um look |
| `src/app/(tabs)/index.tsx` | A tela em si: filtros + lista |

## Decisão 1 — Dados de exemplo com o mesmo formato do servidor

**O que fizemos:** os 8 looks de mentira são entregues em páginas, exatamente como o servidor vai entregar depois.

**Por quê:** quando o servidor ficar pronto, a troca é apagar quatro linhas. A tela, o cartão e os testes não mudam nada. Se a gente tivesse feito "atalho" agora (jogar os 8 de uma vez), teria que refazer a tela inteira depois.

## Decisão 2 — Conferir os dados antes de usar

**O que fizemos:** todo look que chega passa por uma conferência de formato antes de virar tela.

**Por quê:** se o servidor um dia mandar um preço como texto em vez de número, ou esquecer o nome do look, a gente descobre na hora com um erro claro — em vez de a usuária ver uma tela quebrada ou um "R$ NaN".

## Decisão 3 — Lista que só desenha o que aparece

**O que fizemos:** usamos FlashList em vez da lista comum.

**Por quê:** o feed vai ter centenas de fotos. A lista comum tenta manter tudo na memória e trava celular mais fraco. A FlashList reaproveita os cartões que saíram da tela. Como boa parte do público está em Android de entrada (ver [[../../02-analise-de-mercado|análise de mercado]]), isso não é luxo.

## Decisão 4 — Borrão colorido no lugar da foto

**O que fizemos:** cada look guarda um "blurhash", que é a foto resumida em um textinho de 30 caracteres.

**Por quê:** duas razões. Primeira: enquanto a foto de verdade baixa, a usuária vê a mancha de cor no lugar certo, e o layout não fica "pulando". Segunda: hoje, sem fotos publicadas, é ele que dá cor e ritmo à tela — dá pra ver o feed funcionando sem depender de foto de fora.

## Decisão 5 — Aviso de "imagem gerada por IA"

**O que fizemos:** look com imagem feita por inteligência artificial mostra um selo escrito isso.

**Por quê:** é uma promessa de transparência do projeto ([[../../06-seguranca|segurança]]) e evita problema com órgão de defesa do consumidor. A usuária tem direito de saber que aquela foto não é uma pessoa real usando a roupa.

## Decisão 6 — Cartão que fala com leitor de tela

**O que fizemos:** o cartão se anuncia como *"Alfaiataria leve para o escritório. 3 peças, total R$ 619,70."*

**Por quê:** sem isso, uma usuária cega ouviria só "imagem, botão" e o app seria inútil pra ela. Custou uma linha de código fazer certo agora; depois custaria uma varredura na tela inteira.

## Decisão 7 — Plural correto

**O que fizemos:** "1 peça" e "3 peças" — não "1 peças".

**Por quê:** parece bobagem, mas num app de moda pra mulher brasileira, português torto passa impressão de produto amador. Isso apareceu porque um teste forçou o caso de um look com uma peça só.

Voltar: [[o-que-e]] · Testes: [[testes]]
