---
title: Meu closet — testes
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - closet
  - testes
tipo: registro-de-teste
status: aprovado
---

# Meu closet — testes

| Campo | Valor |
|---|---|
| Data | 2026-08-12 |
| Executor | Equipe de desenvolvimento |
| Escopo | Closet com foto e lista pronta, tamanhos, looks desenhados, fim da venda |
| Resultado | ✅ 31 testes novos, todos passando (174 no projeto) |

## Adicionar peças

| Teste | O que garante na prática |
|---|---|
| Adiciona peça da lista pronta | O caminho rápido funciona |
| Adiciona peça fotografada | O caminho da câmera funciona |
| Mais recente no topo | A peça que ela acabou de pôr aparece primeiro |
| Ids nunca se repetem | Duas peças não se confundem no closet |
| Nome absurdamente longo é cortado | Texto colado não quebra o layout |

## Limite por plano

| Teste | O que garante na prática |
|---|---|
| Grátis 20, Medium 200, Premium ilimitado | Bate com a estratégia de planos |
| Bloqueia ao passar do limite | O limite prometido é o aplicado |
| No Medium continua aceitando | Assinar entrega o que promete |
| **Remover funciona mesmo no limite** | Ela não fica presa — sem dark pattern |

## A foto nunca vira endereço público

| Teste | O que garante na prática |
|---|---|
| Guarda o caminho local, não URL de servidor | A foto não sai do aparelho |
| **Nada gravado contém `http` ou `https`** | Trava contra alguém introduzir upload sem as proteções de segurança |

## Resiste a dado corrompido

| Teste | O que garante na prática |
|---|---|
| Closet continua após reabrir o app | A promessa central |
| Primeira abertura não quebra | Usuária nova não vê erro |
| Arquivo ilegível volta a closet vazio | App abre mesmo com dado danificado |
| **Descarta só a peça inválida** | Uma peça corrompida não apaga as outras 29 |
| Limpar apaga também no aparelho | Sem resto escondido |

## O catálogo de peças prontas

| Teste | O que garante na prática |
|---|---|
| Pelo menos 40 peças | Menos que isso e ela não acha nada parecido com o dela |
| Nenhum id repetido | — |
| Todo grupo tem ao menos 3 peças | Nenhuma seção fica vazia na tela |
| Cobre cima, baixo, corpo inteiro e calçado | Dá para montar look completo |
| **Nenhuma peça tem marca, preço ou link** | Trava: é atalho de cadastro, não vitrine |

## Tamanhos por tipo de peça

| Teste | O que garante na prática |
|---|---|
| Roupa usa P/M/G | — |
| Calça e saia usam numeração | — |
| **Sapato usa numeração de calçado, e não "M"** | Não oferece tamanho sem sentido |
| Bolsa e acessório são "Único" | — |
| Toda categoria tem tamanho e sabe onde entra no look | Nenhuma peça fica sem lugar |

## Fim da parte de venda

| Teste | O que garante na prática |
|---|---|
| **Nenhuma peça de look tem `precoCentavos` nem `urlLoja`** | Se alguém reintroduzir venda, o CI quebra |
| O cartão não mostra `R$` em lugar nenhum | Não promete compra que não existe |
| O cartão mostra tamanhos no lugar do preço | A informação que sobrou é a útil |

## Dois bugs encontrados **rodando** o app

Os 174 testes passavam com os dois problemas no lugar. Só apareceram ao abrir no navegador:

| Bug | Consequência | Correção |
|---|---|---|
| **Importação circular** entre feed e closet | App não subia: "Cannot access 'categoriaSchema' before initialization" | Schemas compartilhados foram para um módulo neutro (`lib/schemas-comuns.ts`) |
| **Botão dentro de botão** (coração dentro do cartão) | HTML inválido na web; no celular o leitor de tela anuncia "botão dentro de botão" e a usuária cega não percebe as duas ações | O coração virou irmão do cartão |

> [!warning] Lição registrada
> Teste automatizado não substitui abrir o produto. Os dois bugs eram invisíveis para o Jest e evidentes no primeiro segundo de uso.

## O que **não** foi testado

- **Nada em celular.** A câmera, a permissão de foto e o bloqueio de print só se testam em aparelho — em navegador nem existem.
- **Não há teste automático de tela.** As telas dependem de teste de aparelho (Maestro), que precisa de build.
- **Remoção de localização da foto não foi verificada de fato** — a opção está ligada na captura, mas confirmar que a foto salva não tem GPS exige inspecionar o arquivo num celular real.

Voltar: [[o-que-e]] · [[como-funciona]]
