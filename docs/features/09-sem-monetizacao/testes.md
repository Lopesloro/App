---
title: Sem monetização — testes
date: 2026-08-16
tags:
  - monta-looks
  - feature
  - monetizacao
  - testes
tipo: registro-de-teste
status: aprovado
---

# Sem monetização — testes

| Campo | Valor |
|---|---|
| Data | 2026-08-16 |
| Escopo | Desligar a monetização e garantir o caminho de volta |
| Resultado | ✅ Todos passando |
| Comando | `npx jest src/features/salvos` |

## Com a chave desligada (estado atual do app)

| Teste | O que garante na prática |
|---|---|
| Nenhum plano tem teto | `limiteVigente` devolve infinito nos três planos |
| Ninguém é barrado, nem muito acima do limite antigo | Salvar 100 mil looks no Grátis funciona |
| Não promete número de vagas que não existe | A tela não escreve "cabem mais N" |
| **Não convida a assinar o que não está à venda** | `mensagemLimite` devolve texto vazio |
| Salvar 30 looks numa conta Grátis funciona | Antes travava em 10 |

## A tabela de planos continua valendo como decisão

| Teste | O que garante na prática |
|---|---|
| Limites 10 / 100 / ilimitado seguem escritos | A decisão de produto não foi apagada junto com a venda |
| Cada plano pago cabe mais que o anterior | A escada de valor continua coerente |
| Os preços R$ 19,90 e R$ 24,90 seguem travados | Teste de guarda em `planos.test.ts`, intocado |

## Com a chave religada (caminho de volta)

Dois arquivos ligam `MONETIZACAO_ATIVA` por mock.

### `limites-com-monetizacao.test.ts`

| Teste | O que garante na prática |
|---|---|
| Cada plano volta ao teto da tabela | Religar restaura o comportamento pago |
| Bloqueia exatamente no limite, não depois | Sem deixar passar o 11º por erro de contagem |
| Nunca bloqueia quem tem plano sem teto | Premium continua ilimitado |
| Não devolve vaga negativa após downgrade | Quem tinha 40 e caiu para o Grátis vê 0, não −30 |
| **Convida a assinar sem culpar a usuária** | Verificado que a mensagem não contém "erro" nem "não pode" |

### `salvos-store-com-monetizacao.test.ts`

| Teste | O que garante na prática |
|---|---|
| Bloqueia o 11º look no Grátis | O gating do store funciona |
| Medium consegue salvar o 11º | Assinar entrega o que promete |
| **Remover funciona mesmo no limite** | A usuária não fica presa — sem dark pattern |
| Depois de remover, abre vaga | O ciclo completo funciona sem pagar |

> [!important] Por que testar código desligado
> Sem estes dois arquivos, religar a chave daqui a seis meses viraria um dia de descobrir bugs. Com eles, um gating quebrado aparece no CI no mesmo dia em que for quebrado.

## Correções do code review incluídas nesta entrega

O code review de 16/08/2026 apontou oito problemas. Sete foram corrigidos com teste:

| Problema | Correção |
|---|---|
| Salvar antes da leitura terminar apagava a coleção inteira | Store recusa com `ainda-carregando`, com teste da corrida |
| Sair da conta não limpava dados locais, memória nem cache | Registro de limpezas em `lib/limpeza-sessao.ts` + 6 testes novos |
| 401 da API não derrubava a sessão em memória | Callback liga o cliente HTTP ao estado da sessão |
| Contagem de vagas usava número diferente do bloqueio | Ambos passam a usar a quantidade de ids salvos |
| Chave de cache instável recarregava a lista a cada toque | Chave em texto + `keepPreviousData` |
| Dados de exemplo deduzidos de "localhost" na URL | Chave declarada `USAR_DADOS_EXEMPLO` |
| `push('/(tabs)')` empilhava um segundo navegador de abas | Trocado por `navigate` |

O oitavo — `restaurar()` não recarrega o perfil da usuária — depende da API de autenticação ([#6](https://github.com/Lopesloro/App/issues/6)) e está registrado como pendência. Sem monetização, não tem efeito visível.

## Não testado ainda

- [ ] Teste de tela confirmando que os botões somem (depende de Maestro)
- [ ] Compra em modo sandbox — só faz sentido quando a chave religar

O que é: [[o-que-e]] · Decisões: [[como-funciona]] · Voltar: [[../README|Features]]
