---
title: Detalhe do look — como funciona por dentro
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - detalhe-look
  - decisoes
tipo: decisao-tecnica
status: ativo
---

# Detalhe do look — como funciona

## As peças

| Arquivo | O que faz |
|---|---|
| `src/app/look/[id].tsx` | A tela em si |
| `src/features/feed/use-look.ts` | Carrega um look pelo código |
| `src/features/feed/afiliado.ts` | Monta o link de compra com o carimbo de rastreio |
| `src/features/feed/api.ts` | Ganhou a função `buscarLook` |

## Decisão 1 — O carimbo de rastreio fica num arquivo só

**O que fizemos:** toda montagem de link de compra passa por uma função única.

**Por quê:** o link vai aparecer em outras telas (favoritos, busca, e-mail de promoção). Se cada tela montasse o seu, uma delas esqueceria o carimbo — e a comissão daquela venda seria perdida sem ninguém perceber. Com uma função só, ou funciona em todo lugar ou quebra o teste.

## Decisão 2 — Lista fechada de parâmetros no link

**O que fizemos:** um teste confere que o link tem **exatamente** 4 parâmetros, nem um a mais.

**Por quê:** é fácil alguém acrescentar "só o id da usuária, pra facilitar o relatório" daqui a seis meses. O teste quebra e força a conversa. É uma trava de privacidade que não depende de memória de ninguém.

## Decisão 3 — Preservar o que a loja já tinha na URL

**O que fizemos:** se o link do parceiro já vem com `?cor=preto`, isso é mantido e o carimbo é acrescentado.

**Por quê:** apagar os parâmetros da loja levaria a usuária para o produto errado (cor ou tamanho diferente do que ela viu). Já vi isso quebrar conversão em outros lugares — é sutil e ninguém percebe até o parceiro reclamar.

## Decisão 4 — Só abrir `http` e `https`

**O que fizemos:** qualquer outro tipo de endereço é recusado e o botão não aparece.

**Por quê:** o catálogo virá de planilha e de API de parceiro — fontes que a gente não controla 100%. Endereços como `javascript:` ou `intent:` podem executar ação no aparelho. Testado com 4 tipos perigosos diferentes.

## Decisão 5 — Navegador dentro do app

**O que fizemos:** a loja abre numa janela dentro do Monta Looks, não no Chrome/Safari.

**Por quê:** se jogasse pro navegador de fora, a usuária sairia do app e provavelmente não voltaria. Com a janela interna, ela fecha e continua no look de onde parou.

## Decisão 6 — Código do look escapado na URL da API

**O que fizemos:** ao pedir um look ao servidor, o código passa por uma limpeza antes de entrar no endereço.

**Por quê:** sem isso, um código contendo barra ou `?` mudaria a rota chamada no servidor. É proteção barata contra um tipo de ataque que aparece quando o código do look passa a vir de link compartilhado.

## Decisão 7 — Look inexistente não quebra a tela

**O que fizemos:** se o código não existir, a tela mostra "Não encontramos este look" com botão de voltar.

**Por quê:** links de look vão ser compartilhados no WhatsApp. Look removido do catálogo é situação normal, não erro — e tela branca faria a pessoa achar que o app está quebrado.

Voltar: [[o-que-e]] · Testes: [[testes]]
