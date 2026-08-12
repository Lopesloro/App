---
title: Detalhe do look — testes
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - detalhe-look
  - testes
tipo: registro-de-teste
status: aprovado
---

# Detalhe do look — testes

| Campo | Valor |
|---|---|
| Data | 2026-08-12 |
| Executor | Equipe de desenvolvimento |
| Escopo | Detalhe do look e link de compra (issue [#27](https://github.com/Lopesloro/App/issues/27)) |
| Resultado | ✅ 21 testes novos, todos passando (73 no projeto) |

## O link de compra leva a comissão

| Teste | O que garante na prática |
|---|---|
| O carimbo de rastreio é acrescentado | Sem isso, a venda não é atribuída e **a comissão não é paga** |
| Marca qual look gerou o clique | Dá pra saber quais looks vendem e produzir mais parecidos |
| Mantém o endereço original da loja | A usuária cai no produto certo, não na home da loja |
| Preserva parâmetros que a loja já tinha | Peça com cor/tamanho escolhidos não vira outro produto |
| Peça sem venda devolve "nada" | O botão não aparece, em vez de abrir link quebrado |

## A privacidade da usuária é preservada

| Teste | O que garante na prática |
|---|---|
| **Nenhum dado pessoal vai no link** | Testado contra: e-mail, usuária, user, cpf, telefone, latitude, longitude |
| **Só 4 parâmetros conhecidos, nem um a mais** | Trava contra alguém acrescentar id da usuária no futuro "pra facilitar o relatório" |

## Endereço perigoso é bloqueado

| Teste | O que garante na prática |
|---|---|
| Recusa `javascript:` | Catálogo comprometido não executa código no celular |
| Recusa `intent:` | Não abre aplicativo arbitrário no Android |
| Recusa `file:` | Não acessa arquivo do aparelho |
| Recusa `data:` | Não injeta página falsa |
| Recusa endereço malformado | Erro no catálogo não derruba a tela |
| Aceita `http` e `https` | Loja de verdade continua funcionando |

## Buscar um look

| Teste | O que garante na prática |
|---|---|
| Encontra pelo código | O básico funciona |
| Código inexistente devolve "nada" | Link antigo do WhatsApp mostra "não encontramos", não tela branca |
| Código vazio devolve "nada" | Link torto não quebra o app |
| O look passa pela conferência de formato | Dado torto vira erro claro |
| Encontra qualquer look do catálogo | Testado com todos os 8 |

## Integridade do catálogo

| Teste | O que garante na prática |
|---|---|
| Existem peças com link e peças sem | Os dois caminhos da tela ficam cobertos de verdade |
| Todo link é `https` | Nenhuma peça abre conexão sem criptografia |

## Como rodar

```bash
npm test
```

## O que **não** foi testado

- **Não testa abrir a loja de verdade** — isso depende de aparelho e de internet.
- **Os endereços das lojas são exemplos**, não links de afiliado reais. Os links reais só existem quando houver contrato com as lojas.
- **Não mede se a comissão chega.** Isso só o painel financeiro do parceiro responde.

Voltar: [[o-que-e]] · [[como-funciona]]
