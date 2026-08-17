---
title: App Monta Looks — Índice
date: 2026-08-11
tags:
  - monta-looks
  - moc
tipo: indice
status: ativo
---

# App Monta Looks — Índice (MOC)

App brasileiro de moda feminina. Hoje ele faz uma coisa: **procurar tipo de roupa, marcar o que você tem e montar o seu guarda-roupa** — aprendendo o seu estilo no próprio celular, sem enviar nada para servidor nenhum.

> [!important] Comece por aqui
> Regras e convenções do projeto estão em [[AGENTS]]. Mapa visual do projeto: [[MontaLooks.canvas]].
> Estado atual e o que falta: [[CHECKLIST]].

> [!warning] Decisão do fundador — agosto/2026
> **Nada será vendido por enquanto.** Assinatura, paywall, limite por plano e link de afiliado estão desligados por uma chave (`MONETIZACAO_ATIVA`), com o código inteiro preservado e testado para voltar. Motivo e leitura de mercado: [[09-mercado-sem-venda]]. O que isso muda no app: [[features/09-sem-monetizacao/o-que-e|Sem monetização]].

## O que já está construído

- [[features/README|Features do app]] — uma pasta por feature, explicando em linguagem simples o que faz e por quê
- [[features/06-catalogo-de-roupas/o-que-e|Catálogo de roupas]] — a aba principal: 66 tipos de roupa para procurar e marcar
- [[features/07-guarda-roupa/o-que-e|Guarda-roupa]] — o armário dela, organizado por categoria
- [[features/08-algoritmo-de-estilo/o-que-e|Algoritmo de estilo]] — como o app aprende o gosto sem perguntar nada

## Produto

- [[01-visao-e-ideias]] — visão, personas e banco de 35+ ideias por fase (MVP/v2/v3) e tier
- [[04-assinaturas-precos]] — divisão de features por plano, paywall e estratégia de conversão (**desligado hoje**)

## Mercado

- [[09-mercado-sem-venda]] — o mercado do app sem venda: guarda-roupa, privacidade no aparelho, o que se perde e quando religar
- [[02-analise-de-mercado]] — TAM/SAM/SOM, tendências 2025-2026, projeções de receita
- [[03-concorrentes]] — análise de concorrentes (Whering, Acloset, Indyx…) e lacunas

## Tecnologia e processo

- [[05-frontend]] — comparação de opções de front-end e stack recomendada
- [[06-seguranca]] — threat model, OWASP MASVS, LGPD, checklist de segurança
- [[07-backlog-github]] — épicos, issues iniciais, templates de issue/PR, CI com gates
- [[08-plano-de-testes]] — plano de testes e sistema de registro em markdown

## Regras fixas do fundador

> [!warning] Não mudar sem decisão explícita
> 1. **Nada será vendido por enquanto** (agosto/2026). O código comercial fica guardado e testado — ver [[features/09-sem-monetizacao/o-que-e|Sem monetização]].
> 2. Preços, quando voltarem: Grátis / R$ 19,90 / R$ 24,90 por mês.
> 3. Fase inicial: só público feminino.
> 4. Todo teste executado fica registrado em arquivo `.md` (`docs/testes/`).
> 5. Segurança é diferencial de produto — checklist de [[06-seguranca]] antes de qualquer merge que toque foto, dado pessoal ou pagamento.
> 6. **O perfil de estilo não sai do aparelho.** Qualquer proposta de enviá-lo a servidor é decisão de produto, não detalhe técnico.
