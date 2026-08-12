---
title: Dois visuais — o que é e por quê
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - design
tipo: feature
status: pronta
---

# Dois visuais (dois fronts)

## O que é

O app tem **duas caras completas**, e a usuária troca entre elas dentro do próprio aplicativo.

Em **Perfil → Visual**, ela vê as duas lado a lado, cada uma com uma miniatura de como fica um cartão de look, e as cores principais. Toca numa e o app inteiro muda na hora: fundo, botões, cartões, barra de abas, tudo.

| Visual | Como é | Para quem |
|---|---|---|
| **Editorial Areia** | Revista de moda, luz natural, off-white quente com terracota e verde-oliva. Cantos mais suaves. | Quem busca sofisticação calma, do dia a dia |
| **Vinho Moderno** | Vitrine noturna, contraste alto, burgundy com coral. Cantos mais secos, leitura mais gráfica. | Quem busca moda urbana, festa, noite |

A escolha **fica salva**: fechou e abriu o app, continua no visual que ela escolheu.

## Por que existem dois, em vez de um escolhido

Porque a decisão ainda **não foi tomada** — e não deveria ser tomada no escuro.

O documento de front-end propôs as duas direções e deixou a escolha para um teste com 5 a 8 mulheres do público-alvo. O caminho comum seria fazer mockup em imagem e perguntar qual é mais bonita. O problema: mockup mente. Uma paleta que parece linda numa imagem parada pode ficar cansativa depois de 40 looks rolando, ou ter contraste ruim no sol.

Com as duas implementadas de verdade, o teste vira: **entregue o celular na mão dela e deixe usar**. A resposta que vem daí vale muito mais.

## E o custo disso?

Baixo, e proposital. Todas as cores do app já vinham de **um arquivo só** desde o começo. Ter duas paletas em vez de uma é ter duas listas nesse arquivo — nenhuma tela sabe qual está ativa.

Quando você escolher, apagar a perdedora é deletar um bloco. Se decidir manter as duas como opção da usuária, também está pronto — sem trabalho extra.

## Só para celular

Este app agora é **exclusivamente iOS e Android**. A versão web foi desligada.

**Por quê:** o documento de front-end já tinha descartado a web como produto principal — sem compra dentro do app (o que quebra o modelo de assinatura das lojas), câmera fraca no iPhone pelo navegador, e notificação limitada. Manter a web ligada custaria testar e consertar uma versão que ninguém usaria.

A web continua no plano, mas como **página de divulgação separada**, não como o app.

## O que ainda falta

| Falta | Quando |
|---|---|
| As fontes de cada direção (Fraunces/Figtree e Playfair/Inter) | Precisa embarcar os arquivos de fonte |
| Modo escuro | Depois do MVP — foto de look rende melhor em fundo claro |
| Registrar qual visual a usuária escolheu, para decidir com dado | Junto com as métricas, issue #47 |

Detalhes: [[como-funciona]] · Testes: [[testes]] · Voltar: [[../README|Features]]
