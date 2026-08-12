---
title: Detalhe do look — o que é e por quê
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - detalhe-look
  - monetizacao
tipo: feature
status: pronta-com-exemplo
---

# Detalhe do look

## O que é

A usuária toca num look do feed e abre esta tela. Ela vê:

- a foto grande do look
- o nome e quantas peças tem, com o preço total somado
- **a lista das peças**, uma embaixo da outra: nome, marca e preço de cada uma
- ao lado de cada peça, um botão **"Ver na loja"**

Tocar em "Ver na loja" abre a loja **dentro do app** (não joga a usuária pro navegador e some com ela). Peça que não está à venda mostra "Indisponível" em vez do botão.

No fim da lista aparece o aviso: *"Podemos receber uma comissão pelas compras feitas por estes links. O preço para você é o mesmo."*

## Por que essa feature existe

**É aqui que o produto vira dinheiro.**

O feed desperta o desejo ("que look bonito"), mas é esta tela que responde "onde eu compro isso?". Sem ela, o app é um Pinterest — bonito e sem receita.

Também é o **pilar 3** do produto: apresentar as melhores opções do mercado. É a tela que mostra marca e preço em real, do varejo brasileiro.

## Como o dinheiro chega até nós

Quando a usuária toca em "Ver na loja", o app não abre o link puro. Ele **carimba o endereço** com uma marca dizendo:

- veio do Monta Looks
- veio do aplicativo (não do site)
- veio da tela de detalhe
- veio **deste look específico**

A loja parceira lê esse carimbo e sabe que a venda foi indicada pela gente. É assim que a comissão é paga.

O carimbo do look é o que permite responder depois: *"o look de alfaiataria vendeu 40 blazers, o de praia vendeu 2"* — e aí a curadoria produz mais do que funciona.

## O que **não** vai no carimbo

> [!warning] Regra de privacidade
> Nenhum dado da usuária entra nesse endereço. Sem nome, sem e-mail, sem id dela, sem localização.
>
> **Por quê:** a loja é uma empresa terceira. Endereço de site fica gravado no histórico, no registro do servidor da loja e é repassado a quem mais ela usar. Mandar "quem é" junto seria entregar sua base de usuárias de graça — e problema de LGPD.
>
> A gente sabe que *aquele look* vendeu. Não sabe (e não conta pra loja) *quem* comprou. Isso basta para pagar a comissão.

## Uma proteção que talvez não seja óbvia

O app **confere o endereço antes de abrir**. Só abre endereço de site normal (`http` e `https`).

**Por quê:** o catálogo de peças vai ser alimentado por planilha e por API de parceiro. Se um dia entrar lá um endereço malicioso — de propósito ou por invasão do parceiro —, tocar no botão poderia executar ação no celular da usuária. Com a conferência, o botão simplesmente não abre nada.

## O que ainda falta

| Falta | Quando |
|---|---|
| Fotos de verdade | Curadoria, issue #22 |
| Botão de salvar/favoritar | Issue #18 |
| "Provar em mim" (provador virtual) | Fase 3 |
| Looks parecidos no rodapé | Depois do MVP |
| Registrar o clique nas nossas métricas | Junto com o painel, issue #47 |
| Links reais de afiliado | Quando os contratos com as lojas existirem — hoje os endereços são exemplos |

## Como testar você mesmo

Abra o app, toque num look do feed. Veja se as peças aparecem com marca e preço, se a soma bate com o total, e se tocar em "Ver na loja" abre a loja dentro do app. Procure uma peça marcada como "Indisponível" — ela não deve ter botão.

Detalhes: [[como-funciona]] · Testes: [[testes]] · Voltar: [[../README|Features]]
