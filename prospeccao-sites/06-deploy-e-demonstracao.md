---
title: Deploy e demonstração
date: 2026-08-17
tags:
  - prospeccao-sites
  - deploy
  - github-pages
tipo: nota
status: decidido
---

# Deploy e demonstração

> [!summary] Em uma frase
> GitHub Pages é excelente (e grátis) para a **demonstração automática**, mas não vira dependência obrigatória do **produto final** — produção tem domínio próprio e hosting adequado.

## ✅ O que foi feito neste assunto

- [x] Decidido: GitHub Pages para demo automática (custo zero, link abre com botões funcionando).
- [x] Decidida a **separação demo × produção** — são dois destinos diferentes.
- [x] Listado o que produção exige além de página estática: domínio próprio, HTTPS, DNS, formulários, WhatsApp, analytics, SEO, backend, integrações, manutenção.
- [x] Registrado no fluxo final: subir automaticamente para o GitHub Pages **de graça** para visualização, e esperar a resposta do cliente.

## Demo × Produção

```
Demo                        Produção
empresa-demo.github.io  →   www.empresa.com.br
```

| | Demo | Produção |
|---|---|---|
| Objetivo | Cliente **ver** e comparar | Site real da empresa no ar |
| Hosting | GitHub Pages (ou outro estático grátis) | Vercel / Cloudflare / etc., conforme o cliente |
| Custo | Zero | Pago (dentro do projeto) |
| Quando | Após autorização do lead | Após entrada de 10% + aprovação ([[07-cobranca-e-niveis]]) |
| Conteúdo | Limitado (nível 2) | Completo (nível 3) |

## Requisitos do link de demo

- Publicação **automática** no fim do pipeline ([[05-producao-claude-code]]).
- Botões funcionando de verdade (WhatsApp, telefone, menu) — validados pelo QA automático.
- Perfeito no celular, porque é onde o cliente vai abrir.

## ✅ Publicação automática (17/08/2026)

- [x] `automacao/src/publicar.ts`: sobe a pasta da demo para o repositório de demos e publica no Pages.
- [x] **Verificação pós-publicação** (pedido do fundador): depois de publicar, o sistema busca a **página no ar** e roda o mesmo QA de 12 itens contra ela. O link só é liberado se a página publicada passar — se não responder ou reprovar, o link **não** é enviado.
- [ ] **Passo manual pendente:** criar o repositório público `prospeccao-demos` e ativar o Pages (o token desta sessão não tem permissão para criar repositório — 403).

## ⏭️ Próximos passos

- [ ] Limpeza de demos antigas não convertidas.
- [ ] Definir prazo de expiração/remoção de demos não convertidas.
- [ ] Escolher o hosting padrão de produção e o processo de apontar domínio.

## Relacionado

[[00-INDEX-prospeccao]] · [[05-producao-claude-code]] · [[07-cobranca-e-niveis]] · [[11-arquitetura-e-stack]]
