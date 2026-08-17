---
title: Registro de teste — desligar a monetização
date: 2026-08-16
tags:
  - monta-looks
  - teste
tipo: registro-de-teste
fase: parte-1
status: aprovado
---

# Registro — Parte 1: desligar a monetização

> [!info] Contexto
> Decisão do fundador: **nada será vendido por enquanto**. O código comercial
> permanece no repositório, testado, pronto para voltar. Ver [[../CHECKLIST|Checklist]].

## O que foi testado

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ sem erro |
| `npx jest` | ✅ 167 testes, 15 suítes, todas passando |

## Casos cobertos

### Com a monetização desligada (estado atual)

- Nenhum plano tem teto de looks salvos — `limiteVigente` devolve infinito nos três planos.
- Salvar 30 looks numa conta Grátis funciona (antes travava em 10).
- `mensagemLimite` devolve texto vazio: o app não convida a assinar o que não está à venda.
- O paywall redireciona para as abas mesmo se aberto por link externo.

### Com a monetização religada (mock da chave)

Dois arquivos de teste ligam `MONETIZACAO_ATIVA` por mock e verificam que o
caminho de volta continua inteiro:

- `limites-com-monetizacao.test.ts` — tetos 10/100/∞, bloqueio exatamente no limite, sem vaga negativa após downgrade.
- `salvos-store-com-monetizacao.test.ts` — o store barra o 11º look no Grátis, o Medium salva, remover sempre funciona.

> [!tip] Por que testar o que está desligado
> Sem estes testes, religar a chave daqui a seis meses viraria um dia de
> descobrir bugs. Com eles, o gating quebrado aparece no CI no mesmo dia.

### Correções do code review incluídas

- Corrida entre salvar e ler o aparelho — salvar antes de `restaurar()` terminar
  não apaga mais a coleção inteira (`ainda-carregando`).
- Sair da conta apaga credencial, dados locais, memória dos stores e cache.
- 401 da API derruba a sessão em memória e devolve a usuária ao login.
- Contagem de vagas usa o mesmo número que o bloqueio usa.
- Dados de exemplo passam a ser decisão declarada, não dedução da URL da API.

## Pendências conhecidas

- [ ] `restaurar()` não recarrega o perfil da usuária — depende da API de auth ([#6](https://github.com/Lopesloro/App/issues/6)). Sem backend, o plano volta como `gratis` a cada abertura. Sem monetização isso não tem efeito visível.
- [ ] Nenhuma tela tem teste de interface automatizado (Maestro) — bloco 8 do checklist.

Índice: [[../00-INDEX]] · Plano de testes: [[../08-plano-de-testes]]
