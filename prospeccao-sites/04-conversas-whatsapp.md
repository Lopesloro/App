---
title: Conversas no WhatsApp
date: 2026-08-17
tags:
  - prospeccao-sites
  - whatsapp
  - mensagens
tipo: nota
status: estruturado
---

# Conversas no WhatsApp

> [!summary] Em uma frase
> A primeira mensagem é automação simples (zero tokens); a inteligência só entra **depois da resposta**, para classificar quem respondeu — e na hora da demonstração, **menos IA, não mais**.

## ✅ O que foi feito neste assunto

- [x] Decidido que a primeira mensagem **não usa agente de IA** — é lógica simples.
- [x] Definido o classificador de respostas com três estados (`owner_confirmed`, `wrong_person`, `uncertain`).
- [x] Alvo redefinido: de "dono" para **responsável pela decisão** (dono pode não cuidar do site — pode ser gerente, sócio, marketing, agência, filho do proprietário…).
- [x] Definidos os **dois tipos de conversa** (qualificação × demonstração) com papéis diferentes.
- [x] Regras de tom promovidas a não negociáveis: **curta, amigável, nunca parecer automático**.

## Conversa 1 — Qualificação (automatizada)

Objetivo: descobrir se existe interesse. **Não** tentar vender tudo.

Primeira mensagem (sem Claude, sem GPT, sem agente):

```
Olá, tudo bem?
Falo com o responsável pelo site da [EMPRESA]?
```

## Depois da resposta, entra a inteligência

```
lead_status = owner_confirmed     # confirmou que é responsável
lead_status = wrong_person        # não é
lead_status = uncertain           # resposta ambígua → mandar para análise
```

Confirmou → provar o problema (roteiro em [[02-funil-de-vendas]]) → oferecer a demonstração.

## Conversa 2 — Demonstração

Depois que o cliente demonstra interesse e a demo está pronta:

> "Preparei uma demonstração para você. Dá uma olhada pelo celular também."

> [!tip] Menos IA, não mais
> Nesse momento o agente manda o link e **deixa o trabalho falar**. Quando o cliente aprova, o agente para — **eu entro** (com notificação automática para mim; ver [[01-ideia-original]]).

## ⏭️ Próximos passos

- [ ] Escolher API de WhatsApp **oficial/compatível com as políticas** do WhatsApp Business (anti-bloqueio; ver [[08-riscos]]).
- [ ] Escrever variações da primeira mensagem por tipo de lead ([[09-variacoes-de-abordagem]]).
- [ ] Definir o modelo barato que classifica respostas e os casos que caem em `uncertain`.
- [ ] Implementar a notificação para o fundador em cada evento importante (resposta, interesse, aprovação).

## Relacionado

[[00-INDEX-prospeccao]] · [[02-funil-de-vendas]] · [[08-riscos]] · [[09-variacoes-de-abordagem]]
