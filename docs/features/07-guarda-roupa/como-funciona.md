---
title: Guarda-roupa — como funciona
date: 2026-08-16
tags:
  - monta-looks
  - feature
  - guarda-roupa
  - decisoes
tipo: decisoes-tecnicas
status: ativo
---

# Guarda-roupa — as decisões

## Onde está no código

| Arquivo | O que faz |
|---|---|
| `src/features/guarda-roupa/guarda-roupa-store.ts` | O armário: guardar, tirar, ler do aparelho |
| `src/features/guarda-roupa/use-marcar-peca.ts` | O caminho único de marcar: guarda **e** ensina |
| `src/features/guarda-roupa/use-guarda-roupa.ts` | Resolve os ids no catálogo e agrupa por categoria |
| `src/app/(tabs)/guarda-roupa.tsx` | A tela |
| `src/lib/limpeza-sessao.ts` | Registro de limpezas ao sair da conta |

---

## Decisão 1 — Guardar só o id, não a peça inteira

O armário guarda `{ id, guardadaEm }`. Nome, categoria e estilo vêm do catálogo na hora de mostrar.

Assim, corrigir a descrição de uma peça corrige para todo mundo, em vez de deixar cópias velhas espalhadas pelos aparelhos. Peça cujo id sumiu do catálogo simplesmente não aparece — em vez de virar cartão quebrado — e a tela avisa quantas foram.

## Decisão 2 — Um caminho só para marcar

Marcar faz duas coisas que precisam andar juntas: guardar a peça **e** ensinar o algoritmo de estilo.

Se cada tela chamasse os dois na mão, bastava uma esquecer o segundo passo para o app parar de aprender **em silêncio**. Nenhum teste ficaria vermelho; a usuária só notaria meses depois, como "as sugestões nunca melhoram".

Por isso existe `useMarcarPeca()`: os dois stores continuam sem se conhecer, e o gancho costura. Há um arquivo de teste inteiro só para essa ligação (`marcar-e-aprender.test.tsx`).

## Decisão 3 — Nada é gravado antes da leitura terminar

O store se recusa a gravar enquanto `carregado` for `false`, devolvendo `{ ok: false, motivo: 'ainda-carregando' }`.

Isso corrige uma perda de dados silenciosa que o [code review](../../testes/2026-08-16-desligar-monetizacao.md) encontrou na feature de looks salvos: um toque rápido na abertura do app, antes de a leitura do aparelho terminar, gravava uma lista de **um item só** por cima de tudo o que já existia. A usuária perdia a coleção inteira por ter tocado rápido demais.

Tem teste reproduzindo exatamente esse cenário.

## Decisão 4 — Leitura desconfiada

O arquivo no aparelho pode estar corrompido, adulterado ou vir de uma versão antiga. `pecasValidas()` reconstrói a lista aceitando só o que tem forma de peça:

| Situação no arquivo | O que acontece |
|---|---|
| JSON inválido | Armário vazio, app não cai |
| Item que não é objeto (`42`, `null`) | Ignorado |
| Item sem id, ou id vazio | Ignorado |
| Item sem data | Entra com data zero, cai no fim do armário |
| Id repetido | Fica a primeira ocorrência |

Perder uma peça é ruim. Derrubar o app na abertura é pior.

## Decisão 5 — Duas colunas nas duas telas

O cartão tem o mesmo tamanho na busca e no armário. Parece detalhe visual, mas é reconhecimento: a usuária identifica a peça pela forma e pela cor, e mudar o tamanho entre as telas quebraria isso.

## Decisão 6 — Sair da conta limpa por registro, não por lista

`src/lib/limpeza-sessao.ts` mantém um registro de funções de limpeza. Cada store se inscreve **no próprio arquivo**, ao lado da definição.

Alternativa descartada: uma lista central em `sair()`. Ela funciona até alguém criar um store novo e não lembrar de editar um arquivo distante — e aí surge exatamente o vazamento que a limpeza existia para evitar. Com o registro, quem escreve um store novo vê o vizinho se inscrevendo e faz igual.

Uma limpeza que falha não impede as outras (`Promise.allSettled`): sair da conta é ação de segurança, e limpar quase tudo é melhor do que parar no primeiro erro.

---

## Limites conhecidos

| Limite | Consequência | Saída |
|---|---|---|
| Só neste celular | Trocar de aparelho apaga o armário | Servidor + conta ([#6](https://github.com/Lopesloro/App/issues/6)) |
| Sem foto da peça real | O armário é de tipos, não das roupas dela | [#11](https://github.com/Lopesloro/App/issues/11) |
| Sem cor nem quantidade | "Tenho três camisetas" não cabe ainda | Depois da foto |
| Bloqueio de captura só vale no Android | iOS não permite impedir | Barreiras reais: [#35](https://github.com/Lopesloro/App/issues/35), [#37](https://github.com/Lopesloro/App/issues/37) |

O que é: [[o-que-e]] · Testes: [[testes]] · Voltar: [[../README|Features]]
