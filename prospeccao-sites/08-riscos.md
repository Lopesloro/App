---
title: Riscos — onde pode dar errado
date: 2026-08-17
tags:
  - prospeccao-sites
  - riscos
tipo: nota
status: mapeado
---

# Riscos — onde provavelmente NÃO vai dar certo

> [!summary] Em uma frase
> Cinco problemas mapeados que podem fazer o projeto perder dinheiro — cada um já tem contramedida definida no funil.

## ✅ O que foi feito neste assunto

- [x] Os 5 problemas críticos identificados e registrados.
- [x] Contramedida definida para cada um (tabela abaixo).
- [x] Avaliação sincera do projeto registrada, com notas por dimensão.
- [x] Conclusão registrada: **vale testar, mas não vale construir a megaautomação agora** — primeiro provar que alguém paga.

## Os 5 problemas e as contramedidas

| # | Problema | Contramedida |
|---|---|---|
| ❌ 1 | **Spam** — disparo em massa gera bloqueio, denúncia, baixa resposta, reputação ruim do número | Máquina **altamente segmentada e controlada**, API oficial/compatível, score filtra quem recebe mensagem ([[03-score-de-qualidade]]) |
| ❌ 2 | **Telefone ≠ dono** — o número da Apify pode ser recepção, funcionário, agência, número antigo | Confirmação do decisor é **etapa real do funil** ([[04-conversas-whatsapp]]) |
| ❌ 3 | **IA pode fazer site feio** — "Claude Code + site antigo" não garante site excelente | IA opera **dentro de um sistema**: design system, templates, padrões UX, regras mobile/acessibilidade, critérios de qualidade ([[05-producao-claude-code]]) |
| ❌ 4 | **"Faz de graça"** — cliente pega o trabalho e some | Fronteira clara: análise/demonstração ≠ desenvolvimento contratado; demo limitada; entrada de 10% ([[07-cobranca-e-niveis]]) |
| ❌ 5 | **Preço baixo demais** — "se é IA, deveria ser barato" | Vender **resultado comercial, não tokens**. Reconstruir site de R$ 2.000 custando R$ 100–300 é margem, não desconto |

## Avaliação sincera (notas)

| Dimensão | Nota |
| --- | --- |
| Ideia comercial | 8/10 |
| Potencial de automação | 9/10 |
| Facilidade técnica | 7/10 |
| Risco de spam/bloqueio | 7/10 |
| Risco de gerar sites ruins | 6/10 |
| Potencial de margem | 9/10 |
| Dificuldade de aquisição/conversão | 8/10 |

## Onde a ideia pode dar MUITO certo

1. **Nicho específico** — dentistas → aprende os problemas típicos → depois imobiliárias, restaurantes. A automação melhora a cada nicho.
2. **Oferta extremamente visual** — antes/depois vende mais que apresentação comercial.
3. **Baixo custo operacional** — scraping, análise, classificação, mensagem, geração, testes e deploy automatizados = prospectar muito mais empresas.

## ⏭️ Próximos passos

- [ ] Validar a API de WhatsApp escolhida contra as políticas da plataforma antes de qualquer disparo.
- [ ] Definir limite diário de mensagens e aquecimento do número.
- [ ] Criar critérios objetivos de qualidade visual mínima antes de uma demo poder ser enviada.

## Relacionado

[[00-INDEX-prospeccao]] · [[10-mvp-e-metricas]]
