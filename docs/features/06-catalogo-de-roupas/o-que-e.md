---
title: Catálogo de roupas — o que é e por quê
date: 2026-08-16
tags:
  - monta-looks
  - feature
  - roupas
  - busca
tipo: feature
status: pronta
---

# Catálogo de roupas

## O que é

A aba **Roupas** é a tela principal do app. Tem um campo de busca no topo, filtros por categoria e uma grade de peças.

A usuária digita "camisa" e a lista mostra camisa social, camisa de linho, camisa jeans, camisa polo. Toca numa delas e a peça entra no guarda-roupa dela. Toca de novo e sai.

São **66 tipos de roupa**, cobrindo sete categorias:

| Categoria | Exemplos |
|---|---|
| Parte de cima | Camiseta básica, camisa social, cropped, tricô de gola alta, bata |
| Parte de baixo | Calça wide leg, saia midi plissada, short jeans, legging, calça cargo |
| Vestidos e macacões | Slip dress, vestido camisa, tubinho, macacão pantalona, saída de praia |
| Casacos e sobreposições | Blazer, jaqueta jeans, trench coat, cardigã, kimono |
| Calçados | Tênis branco, scarpin, rasteirinha, mule, bota de cano curto |
| Bolsas | Tote, baguete, transversal, clutch, mochila |
| Acessórios | Cinto, lenço, óculos de sol, chapéu de palha, argola |

## A diferença que decide tudo: tipo, não produto

O catálogo tem **tipos de roupa**, não produtos de loja.

| Produto de loja | Tipo de roupa |
|---|---|
| "Blazer de alfaiataria — Renner — R$ 189,90 — [comprar]" | "Blazer de alfaiataria" |
| Precisa de contrato com a varejista | Não precisa de ninguém |
| Sai de linha em semanas | Não sai de linha |
| Serve para vender | Serve para a pessoa descrever o próprio armário |

Essa escolha é o que faz o app **funcionar hoje**, sem parceiro, sem servidor, sem internet e sem nada à venda — conforme a decisão do fundador registrada em [[../../09-mercado-sem-venda|09-mercado-sem-venda]].

> [!info] Tem teste garantindo isso
> Um teste automatizado verifica que nenhuma peça do catálogo tem campo de marca, preço, SKU ou link. Se alguém colar um produto de loja aqui um dia, o teste fica vermelho antes do merge.

## Por que a busca acha o que você quis dizer

Três decisões pequenas que mudam tudo na prática:

### 1. Acento não importa

Quem digita no celular quase nunca acentua. Procurar `sandalia` acha "Sandália de tira fina". Procurar `trico` acha "Tricô de gola alta".

### 2. O nome que **você** usa também vale

Cada peça tem apelidos cadastrados. Procurar por:

- `rasteirinha` → acha Rasteirinha
- `ciganinha` → acha Blusa ombro a ombro
- `hoodie` → acha Moletom com capuz
- `jumpsuit` → acha Macacão pantalona
- `crossbody` → acha Bolsa transversal
- `casaquinho` → acha Cardigã

Sem isso, a usuária procuraria "blusinha", não acharia nada, e concluiria que o app não tem a peça.

### 3. Dá para procurar pela sensação

`boho`, `festa`, `academia` também funcionam como busca. Nem sempre a pessoa sabe o nome da peça — às vezes ela sabe só a ocasião.

## O resultado aparece enquanto você digita

Não tem botão "buscar" e não tem espera. O catálogo inteiro está no aparelho, então a lista muda letra por letra.

Efeito colateral bom: **funciona sem internet**. E o que a usuária procura por roupa não sai do celular — buscar "vestido de festa" é informação pessoal.

## O que ainda falta

| Falta | Quando |
|---|---|
| Foto de cada peça | Depende de curadoria ([#22](https://github.com/Lopesloro/App/issues/22)). Hoje cada peça tem uma cor própria e estável |
| Fotografar a **sua** peça | Issue [#11](https://github.com/Lopesloro/App/issues/11) |
| Filtro por estação e ocasião na tela | O código já suporta; falta só colocar os chips |
| Catálogo maior | 66 peças cobrem o guarda-roupa comum. Cresce conforme as buscas sem resultado apontarem o que falta |

Detalhes: [[como-funciona]] · Testes: [[testes]] · Voltar: [[../README|Features]]
