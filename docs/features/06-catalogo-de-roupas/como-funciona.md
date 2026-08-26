---
title: Catálogo de roupas — como funciona
date: 2026-08-16
tags:
  - monta-looks
  - feature
  - roupas
  - decisoes
tipo: decisoes-tecnicas
status: ativo
---

# Catálogo de roupas — as decisões

## Onde está no código

| Arquivo | O que faz |
|---|---|
| `src/features/estilo/vocabulario.ts` | As palavras: estilos, ocasiões, estações, caimentos, categorias |
| `src/features/roupas/tipos.ts` | A forma de uma peça (schema zod) e utilidades |
| `src/features/roupas/catalogo.ts` | As 66 peças |
| `src/features/roupas/busca.ts` | Busca, filtros e relevância |
| `src/app/(tabs)/index.tsx` | A tela |
| `src/components/roupa/cartao-roupa.tsx` | O cartão de cada peça |

---

## Decisão 1 — Um vocabulário só, para três partes do app

Três coisas precisam concordar nas mesmas palavras: o catálogo, que classifica; a busca, que filtra; e o algoritmo de estilo, que aprende um peso para cada termo.

Se cada uma tivesse a própria lista, o algoritmo aprenderia sobre `romantico` enquanto o catálogo dissesse `romantica`, e o perfil ficaria cheio de pesos que nunca combinam com nada — sem nenhum erro aparecendo em lugar nenhum.

Por isso `vocabulario.ts` não depende de nada e é importado por todos. Até o feed antigo passou a importar de lá, em vez de manter a lista dele.

> [!warning] Regra de manutenção
> Só **acrescentar** termo, e no fim da lista. Remover ou renomear invalida o perfil já aprendido no aparelho das usuárias.

## Decisão 2 — Busca sem acento por tabela, e não por `normalize()`

O jeito "certo" de tirar acento em JavaScript é `String.prototype.normalize('NFD')`. Não usamos.

Motivo: em React Native, a normalização Unicode depende de o build do Hermes ter ICU completo — e no Android ele costuma vir sem. Uma busca que funciona no simulador do desenvolvedor e falha no celular da usuária é pior do que uma tabela explícita de trinta caracteres acentuados.

A tabela está em `busca.ts` e é chata. Ela também é previsível em qualquer aparelho.

## Decisão 3 — Relevância em degraus, não em "contém"

Quem digita "camisa" espera a **Camisa social** antes da **Camisa jeans**, e as duas antes de um vestido cuja descrição menciona camisa. Uma busca por `includes()` puro devolveria tudo isso embaralhado.

Os degraus:

| Pontos | Quando |
|---|---|
| 100 | Nome exato |
| 80 | Nome começa com o termo |
| 70 | Apelido exato |
| 60 | Nome contém o termo |
| 50 | Apelido começa com o termo |
| 40 | Apelido contém o termo |
| 30 / 25 | Estilo / ocasião batem |
| 10 | Só a descrição menciona |
| 0 | Não aparece |

Empate é resolvido pelo nome em ordem alfabética. Sem isso, duas buscas iguais poderiam devolver ordens diferentes e a lista "pularia" sem motivo aparente.

## Decisão 4 — Cor estável em vez de foto genérica

Não há foto de peça (depende de curadoria, issue [#22](https://github.com/Lopesloro/App/issues/22)). Duas saídas ruins seriam: deixar tudo cinza, ou inventar URLs de imagem de algum serviço externo que quebra sem aviso.

A saída adotada: cada peça deriva uma cor do próprio id (`matizDaRoupa`). A mesma peça tem sempre o mesmo tom, e a usuária reconhece a lista pela forma ao rolar, não lendo cada nome. Um teste verifica que os tons ficam espalhados e não se concentram todos na mesma faixa.

## Decisão 5 — O cartão inteiro é o botão

Não há tela de detalhe de peça. Montar um guarda-roupa são dezenas de toques; colocar um detalhe no meio de cada um transformaria a tarefa em trabalho.

O estado (guardada ou não) aparece de três formas ao mesmo tempo: borda destacada, ícone `✓` em vez de `+`, e `accessibilityState.checked` para leitor de tela. Cor sozinha não basta.

## Decisão 6 — Classificação honesta, com teto

Um teste automatizado impede que uma peça tenha mais de 3 estilos ou 4 ocasiões.

Isso não é preciosismo. Peça marcada com todos os estilos combina igualmente com qualquer perfil — ela vira ruído no ranqueamento e ensina o algoritmo que todos os estilos são a mesma coisa. O teto força a classificação a escolher.

---

## Limites conhecidos

| Limite | Consequência | Saída |
|---|---|---|
| Catálogo fixo no app | Peça nova exige nova versão na loja | Catálogo remoto, quando houver servidor |
| Sem foto real | Reconhecimento visual é por cor, não por imagem | Issues [#22](https://github.com/Lopesloro/App/issues/22) e [#11](https://github.com/Lopesloro/App/issues/11) |
| Busca não corrige erro de digitação | "camiza" não acha nada | Distância de edição, se as buscas sem resultado mostrarem que vale |
| Só português | — | Fase inicial é Brasil ([[AGENTS]]) |

O que é: [[o-que-e]] · Testes: [[testes]] · Voltar: [[../README|Features]]
