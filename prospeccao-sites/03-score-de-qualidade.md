---
title: Score de qualidade do site
date: 2026-08-17
tags:
  - prospeccao-sites
  - filtro
  - score
tipo: nota
status: definido
---

# Score de qualidade do site (filtro automático)

> [!summary] Em uma frase
> A Apify encontra milhares de empresas; o score transforma isso em **"empresas com alta probabilidade de precisar do nosso serviço"** — e só as melhores recebem mensagem.

## ✅ O que foi feito neste assunto

- [x] Tabela de critérios com pontuação definida.
- [x] Faixas de decisão definidas (ignorar / talvez / prospectar / prioridade máxima).
- [x] Definida a cascata de verificações **baratas antes** de qualquer chamada de IA.
- [x] Princípio registrado: *não usar modelo caro para todo mundo* — é aqui que a economia de tokens acontece.

## Tabela de pontuação

| Critério | Pontos |
| --- | --- |
| Site não abre | +30 |
| Site extremamente lento | +20 |
| Não é responsivo | +20 |
| Layout ruim no celular | +20 |
| Design antigo | +15 |
| Site parece abandonado | +15 |
| HTTPS problemático | +10 |
| Botões quebrados | +10 |
| Não possui CTA | +10 |

## Faixas de decisão

| Faixa | Ação |
| --- | --- |
| 0–30 | Ignorar |
| 31–60 | Talvez |
| 61–80 | **Prospectar** |
| 81–100 | **Prioridade máxima** |

## Cascata de verificações (barato → caro)

```
Empresa encontrada
       ↓
Site responde?
       ↓
HTML consegue ser baixado?
       ↓
Mobile aparentemente funciona?
       ↓
Site tem problemas claros?
       ↓
Score > X?
       ↓
Só então usar IA
```

A IA recebe URL, HTML, screenshot, dados da empresa (nome, telefone, WhatsApp, segmento) e faz a análise final — **somente** para quem passou no filtro.

> [!important] Regra de ouro do custo
> `Regras → Filtros → Regras → Modelo barato → Humano/evento importante → Modelo caro`
> IA somente quando **aumenta o valor da decisão**. Nunca `Apify → Claude → Claude → Claude…`. Ver [[11-arquitetura-e-stack]].

## ⏭️ Próximos passos

- [x] Definir o corte X do score que libera análise por IA → **61** (início da faixa "prospectar"), constante `CORTE_IA` em `automacao/src/score.ts`.
- [x] Implementar os checks objetivos (HTTP, tempo de resposta, viewport/responsividade, HTTPS, links) → feito em [[12-automacao]], com testes.
- [ ] Calibrar os pesos com os primeiros 100 sites reais do nicho escolhido.

## Relacionado

[[00-INDEX-prospeccao]] · [[02-funil-de-vendas]] · [[11-arquitetura-e-stack]]
