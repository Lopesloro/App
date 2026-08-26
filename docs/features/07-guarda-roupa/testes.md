---
title: Guarda-roupa — testes
date: 2026-08-16
tags:
  - monta-looks
  - feature
  - guarda-roupa
  - testes
tipo: registro-de-teste
status: aprovado
---

# Guarda-roupa — testes

| Campo | Valor |
|---|---|
| Data | 2026-08-16 |
| Escopo | Guarda-roupa e a ligação com o algoritmo de estilo |
| Resultado | ✅ 19 testes novos, todos passando |
| Comando | `npx jest src/features/guarda-roupa` |

## Marcar e desmarcar

| Teste | O que garante na prática |
|---|---|
| Marcar coloca no armário | O básico funciona |
| Tocar de novo tira | O mesmo toque faz as duas coisas |
| A mais recente fica no topo | A ordem da tela é a esperada |
| Não duplica a mesma peça | Marcar → tirar → marcar não gera duas entradas |
| Guarda quando a peça entrou | Base da ordenação por recência |
| **Sem teto: aceita o catálogo inteiro** | Testado com 80 peças — nada barra a usuária |

## A corrida que apagava dados

| Teste | O que garante na prática |
|---|---|
| **Marcar antes de carregar não apaga o armário** | Toque rápido na abertura não substitui o armário inteiro por uma peça |
| Depois de carregar, o mesmo toque funciona | A recusa é temporária, não um bug permanente |

> [!info] Por que esse teste existe
> É a correção de um problema encontrado no code review de 16/08/2026, que existia na feature de looks salvos: salvar antes de a leitura terminar gravava uma lista de um item só por cima de tudo. Perda de dados silenciosa, sem erro na tela.

## Ler o que está no aparelho

| Teste | O que garante na prática |
|---|---|
| O armário sobrevive a fechar e abrir o app | A promessa central da feature |
| Primeira abertura, vazio, não quebra | Instalação nova funciona |
| Arquivo corrompido volta ao vazio | App não cai por causa de arquivo estragado |
| Arquivo adulterado guarda só o que tem forma de peça | Lixo no meio da lista não vira cartão quebrado |
| Peça sem data entra com data zero | Não some — cai no fim do armário |
| Id repetido aparece uma vez só | Sem peça duplicada na tela |
| Limpar esvazia também no aparelho | O botão faz o que diz |

## Marcar ensina o algoritmo (integração)

Estes são os testes que impedem a ligação de se desfazer em silêncio.

| Teste | O que garante na prática |
|---|---|
| **Guardar no armário e ensinar o estilo acontecem juntos** | Uma ação só, do ponto de vista da usuária e do código |
| Desmarcar ensina o contrário | Tirar uma peça também é informação |
| Devolve o que aconteceu | A tela consegue reagir ao resultado |
| **Antes da leitura terminar, não guarda nem ensina** | O perfil não aprende com peça que não foi guardada |
| Montar um armário inteiro reflete no perfil | Seis peças esportivas → perfil esportivo, ocasião academia |
| **O aprendizado sobrevive a fechar e abrir** | Perfil e armário voltam iguais do aparelho |

## Sair da conta não deixa rastro

Testado em `src/features/auth/__tests__/sessao-store.test.ts`:

| Teste | O que garante na prática |
|---|---|
| Apaga credenciais do cofre | O básico |
| Apaga os dados locais do aparelho | Arquivo do armário some |
| **Esquece o que estava em memória** | Sem isso, a lista continuaria na tela até fechar o app |
| Esvazia o cache de respostas | Nada da conta anterior reaparece |
| Deixa o app em estado de visitante | Roteador manda para o login |

## Não testado ainda

- [ ] Teste de tela ponta a ponta (Maestro)
- [ ] Armário com centenas de peças num Android de entrada
- [ ] Teste com usuárias reais montando o armário delas

O que é: [[o-que-e]] · Decisões: [[como-funciona]] · Voltar: [[../README|Features]]
