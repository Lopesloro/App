---
title: Funil de vendas
date: 2026-08-17
tags:
  - prospeccao-sites
  - funil
tipo: nota
status: estruturado
---

# Funil de vendas

> [!summary] Em uma frase
> O processo foi separado em **prospecção → filtro → contato → cobrança → execução → entrega → pós-venda**, e depois refinado para "provar o problema antes de propor a solução".

## ✅ O que foi feito neste assunto

- [x] Funil separado em etapas nomeadas (evita virar "automação complexa demais").
- [x] Decidido começar com **1 ou 2 nichos** (ex.: clínicas odontológicas de São Paulo), não "qualquer empresa".
- [x] Definida a mudança central de venda: oferecer **evidência, não promessa**.
- [x] Funil refinado com a sequência "mostrar problema → demonstração sem custo adicional".
- [x] Nomenclatura decidida: **"demonstração gratuita"**, nunca "site grátis".
- [x] Decidido que os 10% só entram **depois** da demonstração (ver [[07-cobranca-e-niveis]]).

## A proposta central

Encontrar empresas com site antigo/ruim → identificar o responsável → conversa barata → confirmar decisor → demonstrar → converter.

> [!tip] O que se vende no início
> Não é "desenvolvimento de site". É: **"Encontrei um problema no seu site e posso te mostrar uma versão melhor."**

## Segmentos-alvo (via Apify)

Clínicas, restaurantes, oficinas, imobiliárias, escritórios, salões, lojas, prestadores de serviços, empresas locais — mas **começando por um único nicho** para o sistema aprender os problemas típicos dele.

## O funil refinado (passo a passo)

1. **Encontrar o site** — Apify encontra empresa + site.
2. **Análise automática** — verificações objetivas: site quebrado, problemas no celular, carregamento ruim, links quebrados, botão de WhatsApp/telefone com problema, layout antigo, informação difícil de achar, ausência de CTA, navegação ruim. Ver [[03-score-de-qualidade]].
3. **Primeira mensagem** — nada de vender: *"Olá! Falo com o responsável pelo site da [empresa]?"*
4. **Confirmou** — explicar o que foi encontrado: *"Analisamos rapidamente o site de vocês e encontramos alguns pontos que podem estar dificultando a navegação, principalmente pelo celular. Posso te mostrar quais são?"*
5. **Mostrar o problema** — concreto, com screenshot se possível:
   - *Celular:* "o botão de contato fica difícil de encontrar."
   - *Navegação:* "para achar [serviço], são necessários X passos."
   - *Conversão:* "não existe caminho claro para entrar em contato."
   - O objetivo é o momento **"nossa, realmente"**.
6. **Proposta** — *"Podemos montar uma nova versão demonstrativa do site, sem nenhum custo adicional, para você avaliar."*
7. **Autorização → produção** — entra o Claude Code ([[05-producao-claude-code]]) e o deploy da demo ([[06-deploy-e-demonstracao]]).
8. **Venda** — o cliente vê SITE ANTIGO × SITE NOVO. A diferença visual vende; ninguém explica tecnologia. Se ele pergunta "quanto fica?", aí sim se vende.

```
SITE ATUAL → "Encontramos isso" → PROBLEMA VISÍVEL
  → "Podemos melhorar" → DEMONSTRAÇÃO GRATUITA
  → CLIENTE VÊ O RESULTADO → "QUERO" → CONTRATO
```

> [!note] Vantagem extra
> Se a pessoa não gostar da demonstração, descobrimos rápido que o problema está na oferta/design — sem ter vendido promessa abstrata.

## ⏭️ Próximos passos

- [ ] Escolher o primeiro nicho e a cidade (sugestão das conversas: dentistas de São Paulo).
- [ ] Escrever as mensagens reais de cada etapa (curtas, amigáveis) e validar manualmente.
- [ ] Definir os limites exatos da demonstração gratuita (o que entra e o que não entra).

## Relacionado

[[00-INDEX-prospeccao]] · [[03-score-de-qualidade]] · [[04-conversas-whatsapp]] · [[07-cobranca-e-niveis]]
