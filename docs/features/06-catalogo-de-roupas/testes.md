---
title: Catálogo de roupas — testes
date: 2026-08-16
tags:
  - monta-looks
  - feature
  - roupas
  - testes
tipo: registro-de-teste
status: aprovado
---

# Catálogo de roupas — testes

| Campo | Valor |
|---|---|
| Data | 2026-08-16 |
| Escopo | Catálogo de tipos de roupa, busca e filtros (cobre a issue [#23](https://github.com/Lopesloro/App/issues/23)) |
| Resultado | ✅ 40 testes novos, todos passando |
| Comandos | `npx jest src/features/roupas`, `npx tsc --noEmit`, `npx expo lint` |

## Integridade do catálogo

| Teste | O que garante na prática |
|---|---|
| Todo item passa pelo schema | Nenhuma peça entra malformada e quebra a tela |
| Não há id nem nome repetido | A mesma peça não aparece duas vezes na lista |
| **Nenhum item vende nada** | Guarda da decisão do fundador: sem campo de marca, preço, SKU ou link |
| Cobre as sete categorias | Nenhuma parte do corpo fica de fora |
| Pelo menos 50 peças | Abaixo disso a usuária acaba o catálogo antes do armário dela |
| Nenhuma peça é "tudo ao mesmo tempo" | Teto de 3 estilos e 4 ocasiões — classificação vaga vira ruído no algoritmo |
| Toda descrição tem substância | Mínimo de 20 caracteres, sem descrição de enfeite |

## Cor de cada peça

| Teste | O que garante na prática |
|---|---|
| A mesma peça tem sempre a mesma cor | A usuária reconhece a peça ao rolar de novo |
| A cor fica dentro do círculo de cores | Nenhum valor inválido chega ao estilo |
| As cores não se concentram | Mais da metade das peças tem tom distinto — se todas fossem parecidas, a cor não ajudaria |

## Busca por texto

| Teste | O que garante na prática |
|---|---|
| Sem termo, devolve o catálogo inteiro | Abrir o app mostra tudo, não uma tela vazia |
| Acha pelo nome | O básico funciona |
| **Acha escrito sem acento** | `sandalia` acha "Sandália"; `trico` acha "Tricô" |
| **Acha pelo apelido de verdade** | `rasteirinha`, `hoodie`, `jumpsuit`, `crossbody` |
| Acha pela sensação | `boho` e `academia` devolvem lista relevante |
| Ordena pelo que bate melhor | "Camisa social" antes de "Vestido camisa" |
| Termo inexistente devolve vazio | Melhor lista vazia do que catálogo inteiro fingindo resposta |
| A mesma busca devolve a mesma ordem | A lista não "pula" entre digitações |

## Filtros

| Teste | O que garante na prática |
|---|---|
| Por categoria, estilo, ocasião e estação | Cada chip filtra o que promete |
| Texto + filtro combinam | Procurar "calça" dentro de "parte de baixo" funciona |
| Combinação sem resultado não quebra | Nenhum filtro impossível derruba a tela |

## Pontuação (regras da relevância)

| Teste | O que garante na prática |
|---|---|
| Nome exato > começo de nome | A hierarquia é a que a documentação promete |
| Nome > apelido > descrição | Idem |
| Termo ausente vale zero | Peça sem relação não aparece |
| Sem termo, toda peça vale igual | A busca vazia não introduz ordem escondida |

## O cartão de peça (interface)

| Teste | O que garante na prática |
|---|---|
| Mostra nome e categoria | O básico da tela |
| Tocar marca a peça | A ação principal do app funciona |
| **Anuncia o estado para leitor de tela** | `checked: true/false`, não só cor |
| A dica de toque muda com o estado | "guardar" vs "tirar" |
| Mostra o motivo do algoritmo quando há | A explicação chega na tela |
| Não deixa espaço vazio quando não há motivo | Sem buraco no layout |

## Não testado ainda

- [ ] Teste de tela ponta a ponta (Maestro) — bloco 8 de [[../../CHECKLIST|CHECKLIST]]
- [ ] Desempenho da rolagem num Android de entrada
- [ ] Teste com usuárias reais procurando peças do armário delas

O que é: [[o-que-e]] · Decisões: [[como-funciona]] · Voltar: [[../README|Features]]
