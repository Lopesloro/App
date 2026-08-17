---
title: Referências de design
date: 2026-08-17
tags:
  - prospeccao-sites
  - design
  - referencias
tipo: nota
status: aguardando-links
---

# Referências de design (variação entre demos)

> [!summary] Em uma frase
> Sistema pronto para as demos **não saírem todas da mesma base**: 6 variantes visuais definidas, atribuição determinística por lead, espalhamento no lote — **aguardando os links de referência do fundador** para completar.

## ✅ O que foi feito neste assunto

- [x] Problema registrado: se todo site gerado sair do mesmo template, o "antes/depois" perde força e as demos ficam com cara de linha de produção (risco 3 da [[08-riscos]]).
- [x] **6 variantes visuais** definidas em `automacao/referencias/referencias-design.json`, cada uma com paleta, tipografia, layout e tom — pensadas para tipos de negócio diferentes ([[09-variacoes-de-abordagem]]).
- [x] **Atribuição determinística**: o mesmo lead recebe sempre a mesma variante (hash do domínio); em lote, a distribuição evita repetir a mesma base em sequência (testado).
- [x] A variante reservada aparece na nota de cada lead, com aviso quando ainda não há links.
- [x] **Cada variante virou um modelo de site real** — layout, tipografia e estrutura próprios, não um template com a cor trocada ([[14-modelos-de-site]]).

## As 6 variantes

| ID | Nome | Para quem | Modelo | Links |
|---|---|---|---|---|
| `v01-minimal-claro` | Minimal claro | Clínicas, consultórios | ✅ pronto | ⏳ aguardando |
| `v02-premium-escuro` | Premium escuro | Advogados, arquitetos, B2B (ângulo 13) | ✅ pronto | ⏳ aguardando |
| `v03-vibrante-comercial` | Vibrante comercial | Comércio local, foco WhatsApp (ângulos 8–9) | ✅ pronto | ⏳ aguardando |
| `v04-editorial-serifado` | Editorial serifado | Restaurantes, ateliês, boutiques | ✅ pronto | ⏳ aguardando |
| `v05-blocos-coloridos` | Blocos coloridos | Oficinas, escolas, salões | ✅ pronto | ⏳ aguardando |
| `v06-foto-imersiva` | Foto imersiva | Estética, gastronomia, interiores | ✅ pronto | ⏳ aguardando |

## ⏭️ Como os links do fundador entram

1. Fundador manda os links (sites de referência de como as demos devem parecer).
2. Cada link entra no array `links` da variante mais parecida em `automacao/referencias/referencias-design.json`.
3. Link que não encaixa em nenhuma → **vira variante nova** (mais variantes = mais diversidade).
4. Atualizar a tabela acima (⏳ → ✅) e o status desta nota.
5. Na geração da demo ([[05-producao-claude-code]]), a variante do lead vira a instrução de design do Claude Code: tokens + links de referência.

> [!tip] Regra
> Uma demo só deve ser gerada quando a variante sorteada do lead já tiver pelo menos 1 link de referência — senão o resultado volta a ser "cara de template".

## Relacionado

[[00-INDEX-prospeccao]] · [[12-automacao]] · [[05-producao-claude-code]] · [[09-variacoes-de-abordagem]]
