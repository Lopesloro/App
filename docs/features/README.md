---
title: Features do app — o que já foi construído
date: 2026-08-12
tags:
  - monta-looks
  - features
tipo: indice
status: ativo
---

# Features do app

Cada feature do app tem uma pasta aqui. Dentro dela, três coisas:

| Arquivo | O que tem dentro |
|---|---|
| `o-que-e.md` | O que é essa parte do app e **por que** ela existe, em linguagem simples |
| `como-funciona.md` | As decisões que tomamos e o motivo de cada uma |
| `testes.md` | O que foi testado e se passou |

> [!tip] Para que serve isso
> Você não precisa ler código para saber o que está pronto. Abra a pasta da feature, leia o `o-que-e.md` e você entende o que aquilo faz e por que fizemos assim.

## O app hoje, em uma frase

Procurar tipo de roupa → marcar o que você tem → montar o guarda-roupa. O app
aprende o seu estilo a partir disso, **sem enviar nada para lugar nenhum**, e
**não vende nada** ([[../09-mercado-sem-venda|por quê]]).

## Features no app hoje

| # | Feature | O que faz | Situação |
|---|---|---|---|
| 00 | [[00-base-do-app/o-que-e\|Base do app]] | A fundação: telas, cores, e o cofre que guarda a senha da usuária | ✅ Pronta |
| 05 | [[05-dois-visuais/o-que-e\|Dois visuais]] | Duas caras completas do app, trocáveis pela usuária | ✅ Pronta (falta testar em celular) |
| 06 | [[06-catalogo-de-roupas/o-que-e\|Catálogo de roupas]] | A aba principal: 66 tipos de roupa para procurar e marcar | ✅ Pronta |
| 07 | [[07-guarda-roupa/o-que-e\|Guarda-roupa]] | O armário dela, organizado por categoria | ✅ Pronta (só neste celular) |
| 08 | [[08-algoritmo-de-estilo/o-que-e\|Algoritmo de estilo]] | Aprende o estilo pelo que ela marca, no próprio celular | ✅ Pronta |
| 09 | [[09-sem-monetizacao/o-que-e\|Sem monetização]] | Nada à venda; o código comercial fica guardado e testado | ✅ Pronta |

## Features guardadas (código vivo, fora das abas)

Continuam funcionando e testadas. Saíram da barra de abas porque são a parte
comercial, e nada será vendido por enquanto. Voltam apagando duas linhas de
`src/app/(tabs)/_layout.tsx`.

| # | Feature | O que faz |
|---|---|---|
| 01 | [[01-feed-de-indicacoes/o-que-e\|Feed de indicações]] | Looks com foto que a usuária rola e escolhe |
| 02 | [[02-detalhe-do-look/o-que-e\|Detalhe do look]] | Peças do look com marca, preço e link pra loja |
| 03 | [[03-salvar-looks/o-que-e\|Salvar looks]] | Guardar looks (o limite por plano está desligado) |
| 04 | [[04-meus-looks-salvos/o-que-e\|Meus looks salvos]] | A aba com a coleção dela |

## Ainda não construídas

Estas estão no backlog e viram pasta aqui quando forem feitas:

- Fotografar as suas roupas de verdade ([#11](https://github.com/Lopesloro/App/issues/11))
- Montador de looks com o que está no armário ([#16](https://github.com/Lopesloro/App/issues/16))
- Login de verdade ([#6](https://github.com/Lopesloro/App/issues/6))
- Assinatura e cobrança (só quando o bloco 6 do checklist estiver pronto)

Backlog completo: [[../07-backlog-github|07-backlog-github]] · Índice geral: [[../00-INDEX|00-INDEX]]
