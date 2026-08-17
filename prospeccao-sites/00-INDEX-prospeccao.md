---
title: Máquina de Prospecção de Sites — Índice
date: 2026-08-17
tags:
  - prospeccao-sites
  - moc
tipo: indice
status: ativo
---

# Máquina de Prospecção de Sites — Índice (MOC)

Captação de clientes com sites desatualizados → análise automática → contato curto e amigável no WhatsApp → demonstração visual (antes/depois) → conversão → produção com Claude Code → entrega.

> [!important] Posicionamento central
> Não é "IA que cria sites". É: **"encontramos empresas que estão perdendo oportunidade por terem um site ruim e mostramos uma versão melhor antes de pedir o contrato."** A IA é o motor interno; o cliente compra o resultado.

> [!warning] Regra do fundador
> **Estruturação 100% antes de qualquer lançamento.** Nada dispara mensagem, gera site ou gasta token sem o funil inteiro definido e testado. E **sempre chega notificação para mim** — o sistema é automático, mas eu preciso ver.

## Tópicos — o que foi feito em cada assunto

| Nota | Assunto | Status |
|---|---|---|
| [[01-ideia-original]] | Rascunho original + regras de comunicação não negociáveis | ✅ Registrado |
| [[02-funil-de-vendas]] | Funil completo e funil refinado (provar problema → demonstrar → cobrar) | ✅ Estruturado |
| [[03-score-de-qualidade]] | Score automático de qualidade do site (critérios, pontos, faixas) | ✅ Definido |
| [[04-conversas-whatsapp]] | Mensagens, classificador de resposta e os dois tipos de conversa | ✅ Estruturado |
| [[05-producao-claude-code]] | Pipeline de produção padronizado + QA automático de botões | ✅ Especificado |
| [[06-deploy-e-demonstracao]] | GitHub Pages para demo, separação demo × produção | ✅ Decidido |
| [[07-cobranca-e-niveis]] | Entrada de 10%, os 3 níveis de entrega e o modelo híbrido | ✅ Decidido |
| [[08-riscos]] | Os 5 problemas que podem quebrar o projeto | ✅ Mapeados |
| [[09-variacoes-de-abordagem]] | 18 ângulos de oferta, tipos de lead A–H, 5 melhores apostas | ✅ Catalogados |
| [[10-mvp-e-metricas]] | MVP mínimo (100 empresas, 1 nicho), CAC e as 5 fases | ✅ Planejado |
| [[11-arquitetura-e-stack]] | Arquitetura ponta a ponta e stack por camada | ✅ Desenhada |
| [[12-automacao]] | Analisador + score implementados e testados (Fase 2 em código) | 🔨 Em andamento |
| [[13-referencias-de-design]] | 6 variantes visuais para as demos não saírem da mesma base | ⏳ Aguardando links |
| [[99-documento-original]] | Documento de planejamento completo (fonte das conversas) | 📄 Arquivo |

Leads analisados pela automação: pasta [[leads/README|leads/]] (uma nota por site, com score e funil).

Mapa visual do projeto: [[ProspeccaoSites.canvas]].

## Fluxo geral

```
Apify → Score do site → Lead qualificado → WhatsApp simples
  → Resposta → Classificador IA → Responsável confirmado
  → Provar o problema → Demonstração gratuita (com limites)
  → Cliente gosta → Entrada de 10% → Site completo
  → Domínio/produção → Pagamento restante → Manutenção mensal
```

## Regras de comunicação (não negociáveis)

> [!warning] Fixas — decisão do fundador
> 1. Mensagens sempre em forma **amigável** — não podemos parecer automáticos.
> 2. Mensagens **curtas**.
> 3. Falar com o **responsável pela decisão**, não necessariamente com o "dono".
> 4. **Provar** o problema antes de propor a solução.
> 5. Nunca prometer — **mostrar**.

## O caminho (fases)

1. **Fase 1 — Validar oferta:** 100 empresas, contato manual/semi-automático, medir interesse.
2. **Fase 2 — Automatizar prospecção:** Apify → banco → score → WhatsApp.
3. **Fase 3 — Automatizar qualificação:** resposta → classificação → responsável → interesse.
4. **Fase 4 — Automatizar produção:** pagamento → Claude Code → GitHub → testes → deploy.
5. **Fase 5 — Automatizar entrega:** link → aprovação → domínio → cobrança final.

> [!tip] Primeiro objetivo
> Conseguir os **3 primeiros clientes pagantes manualmente**, documentar o processo exato e só então automatizar cada etapa. Detalhes em [[10-mvp-e-metricas]].
