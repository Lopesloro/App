---
title: Feed de indicações — o que é e por quê
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - feed
tipo: feature
status: pronta-com-exemplo
---

# Feed de indicações

## O que é

É a **tela principal** do app. A usuária abre o aplicativo e cai direto aqui.

Ela vê uma lista de looks prontos, em foto, dois por linha, e vai rolando pra baixo. Cada look mostra:

- a foto do look montado
- o nome (ex: "Alfaiataria leve para o escritório")
- quantas peças tem e quanto custa tudo junto (ex: "3 peças · R$ 619,70")

No topo tem botões redondos para filtrar: Todos, Trabalho, Casual, Festa, Encontro, Academia, Praia. Ela toca em "Festa" e a lista só mostra look de festa.

Quando ela chega no fim da lista, o app carrega mais sozinho — ela não precisa apertar "próxima página".

## Por que essa feature existe

É o **pilar número 1** do produto: o app apresenta indicações **com foto**.

Nenhum concorrente faz isso como produto principal. Os outros aplicativos mostram lista de texto, ou pedem pra você fotografar seu armário inteiro antes de mostrar qualquer coisa. A gente mostra foto de look pronto logo de cara.

Isso resolve dois problemas:

1. **A usuária vê valor em menos de 1 minuto.** Ela não precisa cadastrar nada pra já ganhar ideia de look. Se a primeira tela pedisse trabalho, ela desinstalaria.
2. **É daqui que sai o dinheiro.** Cada peça do look vai ter link pra loja. A usuária gosta, toca, compra, e a gente ganha comissão.

## O que ainda falta nessa tela

| Falta | Quando entra |
|---|---|
| Fotos de verdade (hoje aparece um borrão colorido no lugar) | Quando a curadoria publicar as imagens — issue #22 |
| Tocar no look e abrir a tela de detalhe com as peças | Próxima feature |
| Botão de salvar/favoritar | Issue #18 |
| Botão "gostei / não é pra mim" pra melhorar as indicações | Issue #24 |
| Limite de looks por plano (Grátis vê menos) | Issue #15 |

> [!info] Por que ainda não tem foto de verdade
> As fotos dos looks são publicadas por uma pessoa da curadoria, num painel que ainda não existe (issue #45). Colocar foto de site aleatório agora daria trabalho pra tirar depois e quebraria sem avisar quando o site saísse do ar. Então o cartão mostra o **borrão colorido** que aparece enquanto foto de verdade carrega — dá pra ver o formato e o ritmo da tela funcionando.

## Como testar você mesmo

Quando o app estiver rodando no celular: abra, role a tela até o fim (tem que carregar mais sozinho), toque em "Festa" (a lista tem que mudar), toque em "Todos" (tem que voltar tudo), e puxe a tela pra baixo (tem que recarregar).

Detalhes técnicos: [[como-funciona]] · Testes: [[testes]] · Voltar: [[../README|Features]]
