---
title: Produção com Claude Code
date: 2026-08-17
tags:
  - prospeccao-sites
  - claude-code
  - producao
  - qa
tipo: nota
status: especificado
---

# Produção com Claude Code

> [!summary] Em uma frase
> O Claude Code não "refatora qualquer site": ele opera **dentro de um sistema** — pipeline padronizado, design system, prioridade mobile e QA automático antes de qualquer link ir para o cliente.

## ✅ O que foi feito neste assunto

- [x] Pipeline de etapas padronizado definido (`/analyze` → `/deploy`).
- [x] Fluxo de produção ponta a ponta desenhado (autorização → link).
- [x] Checklist de QA automático definido (10 itens, roda antes de enviar o link).
- [x] Decidido o foco de venda: **"uma versão moderna e muito melhor no celular"** — antes/depois é o que vende.
- [x] Registrado o requisito de qualidade: design system, templates, padrões de UX, componentes reutilizáveis, regras de mobile e acessibilidade (senão a IA faz site feio — ver [[08-riscos]]).
- [x] Ideia da estruturação final: testes revisados por **outros modelos** para não haver erro algum.

## Pipeline padronizado

Cada projeto passa por todas as etapas, sempre na mesma ordem:

```
/analyze          # entende o site antigo e o negócio
/build            # reconstrói dentro do design system
/test             # testes funcionais
/mobile           # prioridade nº 1 — experiência no celular
/accessibility    # acessibilidade
/seo              # básico de SEO
/deploy           # publica a demo
```

## Fluxo completo de produção

```
Cliente concordou
        ↓
Sistema registra autorização
        ↓
Pega site atual
        ↓
Claude Code analisa estrutura
        ↓
Extrai informações relevantes
        ↓
Cria nova arquitetura
        ↓
Cria novo design
        ↓
Prioriza mobile
        ↓
Implementa
        ↓
Testa
        ↓
GitHub
        ↓
Deploy
        ↓
Link
```

## QA automático (antes de mandar o link)

> [!warning] Imagine vender "olha o novo site" e o botão de WhatsApp não funcionar
> Isso destrói a confiança. Nenhum link sai sem passar por:

```
[ ] Site abre
[ ] HTTPS funciona
[ ] Mobile funciona
[ ] WhatsApp abre
[ ] Telefone funciona
[ ] Menu funciona
[ ] Formulário funciona
[ ] Links funcionam
[ ] Imagens carregam
[ ] Página não possui erros
```

## Por que mobile primeiro

O cliente não se importa com React, Next.js, Claude ou GitHub. Ele quer saber: **"isso vai me trazer mais clientes?"** O antes/depois no celular é a prova mais fácil de mostrar e a mais difícil de discutir.

## ⏭️ Próximos passos

- [ ] Montar o design system / templates base (por nicho, começando pelo primeiro).
- [ ] Escrever os comandos do pipeline como skills/prompts padronizados.
- [ ] Implementar o QA automático (ex.: Playwright rodando o checklist) com verificação por segundo modelo.
- [ ] Definir os limites da demo (nível 2 de [[07-cobranca-e-niveis]]) para o custo por demonstração ficar controlado.

## Relacionado

[[00-INDEX-prospeccao]] · [[06-deploy-e-demonstracao]] · [[07-cobranca-e-niveis]] · [[08-riscos]]
