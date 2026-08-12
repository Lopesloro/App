---
title: Salvar looks — como funciona por dentro
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - salvos
  - decisoes
tipo: decisao-tecnica
status: ativo
---

# Salvar looks — como funciona

## As peças

| Arquivo | O que faz |
|---|---|
| `src/lib/armazenamento-local.ts` | Guarda dado **não sensível** no aparelho |
| `src/features/salvos/limites.ts` | Quantos looks cada plano pode salvar |
| `src/features/salvos/salvos-store.ts` | A lista de salvos e a regra de salvar/remover |
| `src/components/look/botao-salvar.tsx` | O botão ♡ / ♥ |

## Decisão 1 — Dois armazenamentos separados, de propósito

**O que fizemos:** senha e token vão no **cofre do sistema**. Looks salvos vão no armazenamento **comum**.

**Por quê:** o cofre é lento e limitado — é feito pra guardar segredo, não lista. E o contrário é pior: guardar token no armazenamento comum é falha de segurança de verdade. Cada arquivo diz na primeira linha o que pode e o que não pode ir nele, pra ninguém confundir depois.

## Decisão 2 — Guardar só o código do look, não o look inteiro

**O que fizemos:** salvamos `["look-003", "look-001"]`, e não uma cópia dos dados.

**Por quê:** se a curadoria corrigir o preço de uma peça ou trocar a foto, o look salvo aparece **atualizado**. Se a gente copiasse tudo, a usuária ficaria olhando um preço que não existe mais e clicaria numa loja pra descobrir outro valor — frustração e reclamação certas.

## Decisão 3 — Remover nunca é bloqueado

**O que fizemos:** o limite só vale pra **adicionar**. Remover funciona sempre.

**Por quê:** senão a usuária no limite fica presa: não salva e não libera espaço, só pagando. Isso é *dark pattern*, e o projeto decidiu não ter nenhum. Tem teste garantindo isso, inclusive o caso "removeu no limite, agora consegue salvar outro".

## Decisão 4 — Aguentar arquivo corrompido

**O que fizemos:** se o arquivo de salvos estiver ilegível, o app volta pra lista vazia em vez de quebrar. Se tiver lixo no meio (`["look-001", 42, null]`), guarda só o que é válido.

**Por quê:** app fechado no meio da gravação, celular sem espaço, ou aparelho com root — tudo isso corrompe arquivo. **A usuária perder a lista de salvos é ruim; o app não abrir é muito pior.** Os dois casos têm teste.

## Decisão 5 — O limite acessa o plano de um lugar só

**O que fizemos:** os números (10 / 100 / ilimitado) ficam num arquivo único, usado pela regra de salvar, pela mensagem de limite e (depois) pela tela de planos.

**Por quê:** se cada tela tivesse seu número, a tela de planos prometeria 10 e o código bloquearia em 5. Já vi isso virar reclamação em loja de aplicativo.

## Decisão 6 — AsyncStorage em vez de MMKV (desvio da documentação)

**O que fizemos:** [[../../05-frontend|05-frontend]] sugere MMKV, que é mais rápido. Usamos AsyncStorage, que é o oficialmente recomendado pelo Expo.

**Por quê:** nenhum dos dois pode ser testado de verdade sem gerar build pro celular, e não temos build ainda. Entre os dois, o AsyncStorage é o mais testado no mundo e o de menor risco de quebrar no aparelho. Como todo acesso passa por um arquivo só (`armazenamento-local.ts`), trocar pra MMKV depois é mexer nesse arquivo e mais nada.

> [!info] Vale reavaliar quando?
> Quando a lista de salvos passar de algumas centenas de itens, ou se a tela "Meus looks" ficar lenta ao abrir. Antes disso, a diferença não é perceptível.

Voltar: [[o-que-e]] · Testes: [[testes]]
