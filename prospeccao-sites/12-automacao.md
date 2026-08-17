---
title: Automação — implementação
date: 2026-08-17
tags:
  - prospeccao-sites
  - automacao
  - implementacao
tipo: nota
status: em-andamento
---

# Automação — implementação

> [!summary] Em uma frase
> A Fase 2 do plano saiu do papel: o **analisador de sites com score** está implementado, testado e gerando uma nota Obsidian por lead — tudo em `automacao/`, sem gastar um token de IA.

## ✅ O que foi feito neste assunto (17/08/2026)

- [x] Subprojeto Node/TypeScript criado em `prospeccao-sites/automacao/` — **isolado do app Expo** (a raiz exclui a pasta do lint/typecheck/jest dela; CI do app não é afetado).
- [x] **Analisador implementado** (`src/analisador.ts`): a cascata barata da [[03-score-de-qualidade]] — site responde? → https ok? → lento? → checks de HTML → amostra de links internos quebrados.
- [x] **Score e faixas em código** (`src/score.ts`), espelho exato da nota 03, com teste que quebra se divergir do vault.
- [x] **Corte de IA definido: 61** (início da faixa "prospectar") — abaixo disso, nenhum token é gasto.
- [x] Checks de HTML sem IA (`src/checks.ts`): viewport, largura fixa, sinais de design antigo (marquee, font, jQuery 1.x, Flash, FrontPage…), copyright parado, ausência de CTA/WhatsApp/telefone, conteúdo misto.
- [x] **Sistema de variantes de design** implementado — cada lead recebe uma base visual diferente ([[13-referencias-de-design]]).
- [x] **Nota Obsidian por lead**: cada análise vira `leads/<dominio>.md` com score, evidências, variante reservada e checklist do funil. Exemplo (fictício): `leads/EXEMPLO-clinica-ficticia.com.br.md`.
- [x] CLI: `npm run analisar -- <url>` e `npm run lote -- lista.txt` (com resumo por faixa e contagem de liberados para IA).
- [x] **18 testes automatizados verdes** + typecheck estrito. Teste ponta a ponta com 2 sites locais de fixture: site "antigo" marcou 100/100 (7 critérios, evidências corretas), site moderno marcou 10 (ignorar). Registro: `docs/testes/2026-08-17-analisador-prospeccao.md`.

## ✅ Adicionado depois: geração das demos (mesma data)

- [x] **6 modelos de site completos** implementados, com QA automático de 12 itens e capturas mobile/desktop → detalhes em [[14-modelos-de-site]].
- [x] Comando `npm run demo` e `npm run capturas` na CLI.
- [x] Suíte subiu para **27 testes verdes**.

## Como rodar

```bash
cd prospeccao-sites/automacao
npm install
npm run analisar -- https://site-da-empresa.com.br --nome "Empresa"
npm run lote -- lista.txt      # uma URL por linha
npm run demo -- --nome "Empresa" --segmento clinica --todas   # gera as demos
npm run capturas               # PNGs mobile + desktop das demos
npm run teste                  # suíte de testes
```

Detalhes no `automacao/README.md`.

## ⏭️ O que falta (na ordem do plano)

- [ ] **Links de referência de design** — o fundador vai mandar; entram em [[13-referencias-de-design]].
- [ ] Coleta Apify → arquivo de lote (primeiro nicho; [[10-mvp-e-metricas]]).
- [ ] Calibrar pesos do score com os primeiros 100 sites reais.
- [ ] Banco de leads persistente (hoje o estado vive nas notas do vault — suficiente para o MVP manual).
- [ ] WhatsApp (Fase 3) — depende da escolha de API oficial ([[04-conversas-whatsapp]], [[08-riscos]]).
- [x] ~~Pipeline de geração de demo~~ → os 6 modelos estão implementados e passando no QA ([[14-modelos-de-site]]); falta ligar aos dados reais do lead e publicar no Pages.
- [ ] Notificação automática para o fundador nos eventos importantes.

> [!note] Limite de rede deste ambiente
> O ambiente de desenvolvimento remoto bloqueia acesso HTTP a sites externos (só registries de pacote passam). Por isso o teste ponta a ponta usou fixtures locais. Rodando na sua máquina, o analisador acessa sites reais normalmente. Atrás de proxy corporativo, use `NODE_USE_ENV_PROXY=1`.

## Relacionado

[[00-INDEX-prospeccao]] · [[03-score-de-qualidade]] · [[13-referencias-de-design]] · [[10-mvp-e-metricas]]
