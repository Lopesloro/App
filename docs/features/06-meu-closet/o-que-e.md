---
title: Meu closet — o que é e por quê
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - closet
tipo: feature
status: pronta
---

# Meu closet

## O que é

A aba onde ficam as roupas que a usuária tem em casa. Ela monta de **dois jeitos**, e pode misturar os dois:

### 1. Escolher de uma lista pronta (sem foto)

Uma lista com **46 peças** comuns do guarda-roupa brasileiro, organizadas em seis grupos: Básicos do dia a dia, Para trabalhar, Para sair, Conforto e treino, Calçados, Bolsas e acessórios.

Ela toca em "Camiseta branca", "Calça jeans escura", "Tênis branco" e pronto — em dois minutos tem um closet de partida.

### 2. Fotografar a própria roupa (escanear)

Botão **"Escanear peça"** abre a câmera. Ela coloca a peça sobre uma superfície lisa, fotografa, e o app pede só o essencial: que tipo de peça é e qual o tamanho.

Também dá para pegar da galeria, se ela já tem foto.

### Tamanhos

Cada peça guarda o tamanho, e a escala muda conforme o tipo:

| Tipo de peça | Tamanhos oferecidos |
|---|---|
| Blusa, camisa, vestido, casaco | PP, P, M, G, GG, XG |
| Calça, saia, short | 36 a 48 |
| Sapato | 33 a 41 |
| Bolsa e acessório | Único |

Os looks do feed também mostram tamanho agora — ela vê "3 peças · M · 40 · 37" e sabe na hora se serve.

## Por que existe a lista pronta

**É o que decide se ela continua ou desiste.**

Nos apps concorrentes, o primeiro passo é fotografar o armário inteiro. Trinta peças, uma a uma, antes de ver qualquer coisa útil. A maioria desiste na quinta.

Com a lista, ela chega ao valor em minutos: monta o closet tocando no que se parece com o dela, e fotografa depois só o que é especial — o vestido que ama, a peça que não tem igual.

> [!info] A lista não é vitrine
> As peças não têm marca, não têm preço e não levam a loja nenhuma. É atalho de cadastro, não catálogo de compras. **Nada é vendido no app.**

## Como as roupas aparecem sem foto

Cada peça é **desenhada** — silhuetas vetoriais por tipo e cor. Duas razões:

1. **Foto de catálogo exige licença** de imagem de cada marca, e ainda não há contrato com loja nenhuma.
2. **Desenho não depende de internet** nem de serviço que sai do ar, e fica nítido em qualquer tela.

O mesmo desenho é usado nos looks do feed: o app **compõe o look** a partir das peças (blusa em cima, calça embaixo, sapato no rodapé). Então o que ela vê na indicação tem a mesma linguagem visual do que ela cadastrou — em vez de um borrão cinza.

## A privacidade da foto

> [!warning] A foto não sai do aparelho
> - Guardamos o **caminho local** da imagem, nunca um endereço público
> - Nada é enviado para servidor — porque servidor ainda não existe
> - A localização é **removida** antes de qualquer coisa: foto tirada em casa levaria o endereço dela junto (`exif: false` na captura)
> - As telas com foto bloqueiam print no Android
>
> Tem teste garantindo que nenhuma peça gravada contém endereço `http`.

## O que ainda falta

| Falta | Quando |
|---|---|
| Recortar o fundo da foto automaticamente | Precisa de servidor (#11) |
| Montar look com as peças do closet | Próxima feature |
| Closet ir junto para outro celular | Precisa de conta e servidor (#6, #7) |
| Sugerir look usando o que ela tem | Depois do montador |

Detalhes: [[como-funciona]] · Testes: [[testes]] · Voltar: [[../README|Features]]
