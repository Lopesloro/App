---
title: Registro de teste — guarda-roupa e algoritmo de estilo
date: 2026-08-16
tags:
  - monta-looks
  - teste
tipo: registro-de-teste
fase: partes-2-a-5
status: aprovado
---

# Registro — Partes 2 a 5: catálogo, guarda-roupa, algoritmo e telas

## Comandos executados

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ sem erro |
| `npx jest` | ✅ **275 testes, 22 suítes**, todas passando |
| `npx expo lint` | ✅ 0 erros, 0 avisos |
| `npx expo export --platform android` | ✅ pacote de **4,7 MB** gerado — valida que todas as rotas resolvem |

Crescimento: 146 testes (12/08) → 167 (Parte 1) → **275** (Partes 2 a 5).

## Distribuição

| Área | Suítes | Testes |
|---|---|---|
| Catálogo de roupas e busca | 2 | 40 |
| Algoritmo de estilo | 2 | 43 |
| Guarda-roupa (store + integração) | 2 | 19 |
| Cartão de roupa (interface) | 1 | 6 |
| Sessão (sair não deixa rastro) | 1 | 9 |
| Monetização desligada e caminho de volta | 4 | ~30 |
| Feed, salvos, tema, cofre (existentes) | 10 | ~128 |

Detalhamento por feature:

- [[../features/06-catalogo-de-roupas/testes|Catálogo de roupas]]
- [[../features/07-guarda-roupa/testes|Guarda-roupa]]
- [[../features/08-algoritmo-de-estilo/testes|Algoritmo de estilo]]
- [[../features/09-sem-monetizacao/testes|Sem monetização]]

## Os cinco testes que mais importam

> [!important] Se um destes quebrar, algo sério quebrou
>
> 1. **`AJUSTE_MAXIMO < PESO_TEXTO`** — a desigualdade que impede o perfil de estilo de passar na frente do que a usuária digitou. Testada diretamente, não só por consequência.
> 2. **500 marcações não estouram o peso** — prova que o modelo satura em vez de corromper.
> 3. **Marcar antes da leitura terminar não apaga o armário** — a perda de dados silenciosa que o code review encontrou.
> 4. **Sair da conta esquece o que estava em memória** — sem isso, a próxima pessoa a usar o celular vê o armário da anterior.
> 5. **Nenhum item do catálogo tem marca, preço, SKU ou link** — guarda automatizada da decisão do fundador.

## O que estes testes NÃO garantem

Vale repetir, porque é fácil confundir 275 testes verdes com "está pronto":

| Não garantido | Por quê |
|---|---|
| Que o algoritmo acerta o estilo de pessoas reais | Os testes verificam que ele faz o que foi **projetado**. Se o projeto está certo, só o teste com 5–8 mulheres do público-alvo responde |
| Que `INTERACOES_PARA_CONFIAR = 8` é o número certo | Escolhido por julgamento, não por dado |
| Que as telas funcionam num celular | Nenhuma tela tem teste ponta a ponta (Maestro). O `expo export` prova que o app **empacota**, não que ele **funciona bem** |
| Que a rolagem é fluida num Android de entrada | Não medido |
| Que o catálogo cobre o guarda-roupa das brasileiras | 66 tipos é palpite informado. As buscas sem resultado das primeiras usuárias vão dizer o que falta |

## Pendências herdadas

- [ ] Achado nº 8 do code review: `restaurar()` não recarrega o perfil da usuária — depende da API de auth ([#6](https://github.com/Lopesloro/App/issues/6))
- [ ] Testes de tela (Maestro) — bloco 8 de [[../CHECKLIST]]
- [ ] Auditoria de segurança independente — nunca rodou

Índice: [[../00-INDEX]] · Plano de testes: [[../08-plano-de-testes]] · Checklist: [[../CHECKLIST]]
