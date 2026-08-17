---
title: Arquitetura e stack
date: 2026-08-17
tags:
  - prospeccao-sites
  - arquitetura
  - stack
tipo: nota
status: desenhado
---

# Arquitetura e stack

> [!summary] Em uma frase
> Arquitetura ponta a ponta desenhada (Apify → score → WhatsApp → classificador → pagamento → Claude Code → QA → deploy → produção), com stack definida por camada e a regra de custo que governa tudo.

## ✅ O que foi feito neste assunto

- [x] Arquitetura completa do funil desenhada (diagrama abaixo).
- [x] Stack definida camada por camada.
- [x] Regra de custo registrada: **IA somente quando aumenta o valor da decisão**.
- [x] Antipadrão registrado: `Apify → Claude → WhatsApp → Claude → Claude → Claude` — isso come dinheiro.
- [x] Estruturação final do fundador incorporada (Obsidian no processo, GitHub Pages grátis, notificação obrigatória).

## Arquitetura

```
                    APIFY
                      ↓
             Empresas / URLs
                      ↓
              SITE ANALYZER
                      ↓
               SCORE DO SITE
                      ↓
          ┌───────────┴───────────┐
          ↓                       ↓
       SCORE BAIXO            SCORE ALTO
          ↓                       ↓
       DESCARTA             QUALIFICA LEAD
                                  ↓
                           WHATSAPP SIMPLES
                                  ↓
                              RESPOSTA
                                  ↓
                         CLASSIFICADOR IA
                                  ↓
                    ┌─────────────┴─────────────┐
                    ↓                           ↓
                NÃO DONO                    RESPONSÁVEL
                    ↓                           ↓
                  PARA                     CONVERSA
                                                ↓
                                           INTERESSE?
                                                ↓
                                              SIM
                                                ↓
                                           PAGAMENTO 10%
                                                ↓
                                           CLAUDE CODE
                                                ↓
                                      NOVO SITE / REFACTOR
                                                ↓
                                       TESTES AUTOMÁTICOS
                                                ↓
                                             DEPLOY
                                                ↓
                                         LINK DE DEMO
                                                ↓
                                        CLIENTE APROVA
                                                ↓
                                     DOMÍNIO / PRODUÇÃO
                                                ↓
                                     PAGAMENTO RESTANTE
```

> [!note] Ordem da cobrança
> No funil refinado, a demonstração vem **antes** dos 10% — o diagrama acima é a visão original; a sequência vigente está em [[02-funil-de-vendas]] e [[07-cobranca-e-niveis]].

## Stack

| Camada | Ferramenta |
| --- | --- |
| Prospecção | Apify |
| Backend/orquestração | Node.js/TypeScript + PostgreSQL |
| WhatsApp | Solução oficial/API compatível com as políticas do WhatsApp Business |
| IA | Modelo barato para classificação; Claude Code para desenvolvimento; modelo mais capaz somente quando necessário |
| Código | GitHub |
| Deploy de demonstração | GitHub Pages ou outro hosting estático |
| Deploy final | Vercel / Cloudflare / etc., dependendo do cliente |
| Automação | Filas + workers |
| Documentação/processo | Obsidian (este vault) — cada assunto vira nota, cada lote vira registro |

## A regra de custo

```
❌ Apify → Claude → WhatsApp → Claude → Claude → Claude → Claude

✅ Regras → Filtros → Regras → Modelo barato → Humano/evento importante → Modelo caro
```

**IA somente quando aumenta o valor da decisão.** As verificações baratas vêm primeiro ([[03-score-de-qualidade]]).

## Estruturação final pretendida (fluxo do fundador)

```
Apify (sites antigos/com problema — não só erros, mas conversão para leads)
        ↓
Automatização com o Claude + testes feitos por OUTROS modelos (erro zero)
        ↓
Conversa do lead aceita
        ↓
Site automático (utilizando o Obsidian em conjunto)
        ↓
Subir automaticamente para o GitHub Pages (de graça) para visualização
        ↓
Esperar a resposta do cliente
        ↓
Confirmação de que gostaram → eu entro
        ↓
NOTIFICAÇÃO para mim (essencial — é tudo automático)
```

## ⏭️ Próximos passos

- [ ] Modelar o banco (leads, scores, conversas, status, pagamentos, demos).
- [ ] Definir a fila/worker (ex.: BullMQ) e os eventos que geram notificação ao fundador.
- [ ] Prototipar o Site Analyzer com os checks do score.

## Relacionado

[[00-INDEX-prospeccao]] · [[03-score-de-qualidade]] · [[05-producao-claude-code]] · [[06-deploy-e-demonstracao]]
