---
title: Salvar looks — o que é e por quê
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - salvos
  - assinatura
tipo: feature
status: pronta
---

# Salvar looks

## O que é

Na tela de detalhe do look tem um botão **♡ Salvar**. A usuária toca e o look fica guardado. O botão vira **♥ Salvo**. Tocar de novo remove.

O que ela salvou **continua lá quando ela fecha e abre o app**.

E tem um limite por plano:

| Plano | Quantos looks pode salvar |
|---|---|
| Grátis | 10 |
| Medium (R$ 19,90) | 100 |
| Premium (R$ 24,90) | Sem limite |

Quando a usuária do Grátis tenta salvar o 11º, aparece: *"Você chegou aos 10 looks salvos do seu plano. Assine para guardar quantos quiser."* Tocando nessa mensagem, ela vai pra tela de planos.

## Por que essa feature existe

Duas razões, e as duas importam.

### 1. É o que faz a usuária voltar

Um app que ela abre uma vez e esquece não vale R$ 19,90 por mês. Quando ela guarda 8 looks que gostou, o app deixa de ser "um lugar de ver roupa" e vira **o lugar onde as ideias dela moram**. Isso é retenção — e retenção é o que sustenta assinatura.

### 2. É o gatilho natural pra assinar

Este é o momento certo de mostrar o plano pago: **quando ela já provou que gosta**. Ela salvou 10 looks — ou seja, usou o app o suficiente pra querer mais espaço.

Isso é o oposto de mostrar preço na primeira tela, antes de ela entender o que ganha. Quem tenta salvar o 11º look é uma pessoa que já quer o produto.

> [!info] Por que 10 e não 3
> Um limite muito apertado frustra antes de a usuária entender o valor, e ela desinstala. Dez é o suficiente pra ela criar o hábito e sentir o app como dela — e só aí o limite aparece. A regra em [[../../04-assinaturas-precos|04-assinaturas-precos]] é que **o limite só deve morder a partir da segunda semana de uso**.

## Uma decisão que protege a usuária

**Remover um look salvo funciona mesmo quando ela está no limite.**

Parece óbvio, mas é fácil errar: se o código bloqueasse "qualquer mudança" ao bater o limite, ela ficaria presa — sem poder salvar e sem poder liberar espaço. Só restaria pagar.

Isso seria um *dark pattern*, e o projeto decidiu não ter nenhum ([[../../04-assinaturas-precos|estratégia de planos]]). Tem teste garantindo que remover sempre funciona.

## Uma coisa importante sobre esse limite

> [!warning] Este limite ainda pode ser burlado
> O bloqueio de hoje está **no aplicativo**. Alguém com conhecimento técnico consegue contornar.
>
> A trava que vale é a do **servidor**, que ainda não existe (issue [#32](https://github.com/Lopesloro/App/issues/32)). Enquanto ela não existir, considere o limite como "orientação da interface", não como cobrança garantida.
>
> Isso não é descuido: é a ordem certa de construir. Mas é importante você saber antes de contar com essa receita.

## O que ainda falta

| Falta | Quando |
|---|---|
| Tela "Meus looks salvos" para ver a coleção | Próxima feature |
| Botão de salvar direto no feed (sem abrir o look) | Junto com a tela acima |
| Os salvos irem junto para outro celular | Precisa de servidor e login (issues #6 e #7) |
| Trava de limite no servidor | Issue #32 |

> [!warning] Hoje os salvos ficam só neste celular
> Se a usuária trocar de aparelho ou desinstalar o app, os looks salvos somem. Isso só se resolve com conta e servidor.

Detalhes: [[como-funciona]] · Testes: [[testes]] · Voltar: [[../README|Features]]
