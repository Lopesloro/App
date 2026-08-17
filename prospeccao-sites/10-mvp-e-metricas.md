---
title: MVP e métricas
date: 2026-08-17
tags:
  - prospeccao-sites
  - mvp
  - metricas
tipo: nota
status: planejado
---

# MVP e métricas

> [!summary] Em uma frase
> O MVP é **muito menor** do que a máquina completa: 100 empresas de um único nicho, e a métrica que manda é **quanto custa adquirir um cliente** — não quantos sites conseguimos gerar.

## ✅ O que foi feito neste assunto

- [x] MVP redefinido para o mínimo (9 passos, um nicho, 100 empresas).
- [x] Métrica central definida: **CAC**, com cenário bom × cenário ruim para comparação.
- [x] As 5 fases do caminho completo definidas (validar → prospecção → qualificação → produção → entrega).
- [x] Primeiro objetivo fixado: **3 clientes pagantes manualmente** antes de automatizar qualquer coisa.

## MVP 1 — 100 empresas, um único nicho

Exemplo: dentistas de São Paulo.

1. Encontrar site
2. Analisar
3. Selecionar 20
4. Verificar contato
5. Conversar
6. Descobrir quantos respondem
7. Descobrir quantos são responsáveis
8. Descobrir quantos aceitam ver uma demonstração
9. Descobrir quantos pagam os 10%

**Só isso.** Nada de megaautomação antes desses números existirem.

## O número que realmente importa

```
Cenário bom              Cenário ruim
100 leads                100 leads
   ↓                        ↓
30 respondem             5 respondem
   ↓                        ↓
15 são responsáveis      1 é responsável
   ↓                        ↓
8 querem ver             0 paga
   ↓
4 pagam entrada
   ↓
3 fecham
```

> [!important] Conclusão registrada
> Se o cenário bom acontecer com custo baixo, a máquina é muito interessante. Se for o ruim, **não importa quão incrível seja o agente**. Primeiro prove que alguém paga.

## As 5 fases do caminho

| Fase | O quê | Quando automatiza |
|---|---|---|
| 1 — Validar oferta | 100 empresas → sites ruins → contato manual/semi-automático → medir interesse | Nada automatizado |
| 2 — Automatizar prospecção | Apify → banco → score → WhatsApp | Depois de saber qual mensagem converte |
| 3 — Automatizar qualificação | Resposta → classificação → responsável → interesse | Depois da fase 2 |
| 4 — Automatizar produção | Pagamento → Claude Code → GitHub → testes → deploy | Depois da fase 3 |
| 5 — Automatizar entrega | Link → aprovação → domínio → cobrança final | Por último |

> [!tip] Por que nessa ordem
> Reduz drasticamente o risco de passar semanas construindo um agente sofisticado para descobrir que o problema não era técnico — **era conversão**.

## ⏭️ Próximos passos

- [ ] Rodar o MVP 1: coletar as 100 empresas do nicho escolhido (Apify).
- [ ] Registrar cada número do funil em nota própria (uma planilha/nota por lote).
- [ ] Calcular o CAC do primeiro lote e decidir se avança para a Fase 2.

## Relacionado

[[00-INDEX-prospeccao]] · [[08-riscos]] · [[11-arquitetura-e-stack]]
