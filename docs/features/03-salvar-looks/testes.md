---
title: Salvar looks — testes
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - salvos
  - testes
tipo: registro-de-teste
status: aprovado
---

# Salvar looks — testes

| Campo | Valor |
|---|---|
| Data | 2026-08-12 |
| Executor | Equipe de desenvolvimento |
| Escopo | Salvar looks e limite por plano (issue [#18](https://github.com/Lopesloro/App/issues/18)) |
| Resultado | ✅ 25 testes novos, todos passando (98 no projeto) |

## Salvar e remover

| Teste | O que garante na prática |
|---|---|
| Salva um look | O básico funciona |
| Tocar de novo remove | O mesmo botão faz as duas coisas, como a usuária espera |
| Mais recente no topo | A tela "Meus looks" vai mostrar na ordem certa |
| Não duplica o mesmo look | Salvar → remover → salvar não gera duas entradas |

## O limite do plano

| Teste | O que garante na prática |
|---|---|
| Bloqueia o 11º no Grátis | O limite prometido é o limite aplicado |
| Bloqueia exatamente **no** limite, não depois | Não deixa passar 11 por erro de contagem |
| Medium consegue salvar o 11º | Assinar realmente entrega o que promete |
| Premium nunca é bloqueado | Testado até com 100 mil looks |
| **Remover funciona mesmo no limite** | A usuária não fica presa — sem dark pattern |
| **Depois de remover, abre vaga** | O ciclo completo funciona sem precisar pagar |
| Conta acima do limite não quebra | Cobre quem tinha Medium e voltou pro Grátis |

## Continua salvo depois de fechar o app

| Teste | O que garante na prática |
|---|---|
| O que foi salvo continua lá ao reabrir | A promessa central da feature |
| Primeira abertura, nada salvo, não quebra | Usuária nova não vê erro |
| **Arquivo corrompido volta ao padrão** | App abre normal; ela perde a lista, não o acesso |
| **Arquivo adulterado guarda só o que é válido** | `["look-001", 42, null, "look-002"]` vira `["look-001", "look-002"]` |
| Limpar apaga também no aparelho | Não sobra resto escondido |

## Os números dos planos

| Teste | O que garante na prática |
|---|---|
| Grátis 10, Medium 100, Premium ilimitado | Bate com [[../../04-assinaturas-precos\|a estratégia de planos]] |
| Cada plano pago cabe mais que o anterior | Ninguém inverte os limites por engano |
| Conta as vagas restantes certo | Base para mostrar "faltam 3" no futuro |
| Nunca mostra vaga negativa | Após downgrade, mostra 0, não "-30" |
| A mensagem diz o número certo do plano | Não fala "10" pra quem é Medium |
| **A mensagem convida, não culpa** | Testado que não contém "erro" nem "não pode" |
| Premium não vê mensagem de limite | Quem já pagou o máximo não recebe oferta |

## Como rodar

```bash
npm test
```

## O que **não** foi testado

- **Não foi testado em celular.** O armazenamento foi testado com uma imitação; o comportamento real (app fechado no meio da gravação, celular sem espaço) só aparece em aparelho.
- **O limite não foi testado contra burla.** Como o bloqueio ainda é só no app, alguém técnico contorna. A trava real é a do servidor (issue #32) e não existe ainda.
- **Não testa sincronizar entre celulares**, porque não há servidor.

Voltar: [[o-que-e]] · [[como-funciona]]
