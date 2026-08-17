---
title: Modelos de site (demos)
date: 2026-08-17
tags:
  - prospeccao-sites
  - demo
  - design
tipo: nota
status: implementado
---

# Modelos de site (demos)

> [!summary] Em uma frase
> Os 6 modelos de demo estão **implementados de verdade** — página inteira, cada uma com layout, tipografia e estrutura próprias — e nenhuma sai para o cliente sem passar 100% no QA automático.

## ✅ O que foi feito neste assunto (17/08/2026)

- [x] **6 modelos completos** implementados (`automacao/src/demo/`), não uma casca genérica: cada variante tem CSS próprio, estrutura de hero diferente, formato de serviços diferente e decoração própria em SVG.
- [x] **Página completa**, não só topo: topo com menu (e menu mobile em `<details>`, sem JavaScript), hero, serviços, sobre com métricas, depoimentos, contato com WhatsApp/telefone/endereço/horário e rodapé.
- [x] **Conteúdo por segmento** (`src/demo/dados.ts`): presets de clínica, restaurante, oficina, imobiliária, salão e advocacia — slogan, descrição e 4 serviços escritos para cada ramo. Nada de "Lorem ipsum".
- [x] **QA automático em código** (`src/demo/qa.ts`): 12 verificações — viewport, links `wa.me` com o número certo e mensagem pré-preenchida, `tel:`, âncoras do menu resolvendo, zero recurso externo, `alt` nas imagens, `lang`, title, meta description, sem restos de template, peso ≤ 150 KB e aviso de demonstração. **Reprovou = link não sai.**
- [x] **Capturas automáticas** (`src/capturas.ts`) em mobile (390px, página inteira) e desktop (1280px) via Chromium local.
- [x] **27 testes verdes**, incluindo: toda variante aprovada no QA, variantes comprovadamente diferentes entre si (CSS e HTML), nome de empresa malicioso não injeta HTML, e o QA reprovando página quebrada.
- [x] Técnica: zero JavaScript, zero dependência externa (fontes do sistema, SVG inline), ~15 KB por página — abre instantâneo no celular do cliente.

## Os 6 modelos

| ID | Modelo | Cara | Serviços |
|---|---|---|---|
| `v01-minimal-claro` | Minimal claro | Centralizado, muito ar, verde único, arco decorativo | Lista com divisórias |
| `v02-premium-escuro` | Premium escuro | Fundo grafite, serifa, dourado, círculos concêntricos | Numerado em 2 colunas |
| `v03-vibrante-comercial` | Vibrante comercial | Faixa de urgência, selo "aberto", laranja, blob | Cartões com ícone e sombra |
| `v04-editorial-serifado` | Editorial serifado | Papel, filete duplo, itálico, capitular no "sobre" | Numerado em 3 colunas |
| `v05-blocos-coloridos` | Blocos coloridos | Cartão com gradiente, roxo, cantos bem arredondados | Blocos pastéis alternados |
| `v06-foto-imersiva` | Foto imersiva | Hero de tela cheia escuro, caixa alta espaçada, topo fixo | Grade minimal com filetes |

## Como gerar

```bash
cd prospeccao-sites/automacao
npm run demo -- --nome "Clínica Sorriso" --segmento clinica --cidade "São Paulo" \
                --whatsapp 5511999999999 --dominio clinicasorriso.com.br --todas
npm run capturas          # PNGs em saida/capturas (mobile + desktop)
```

Sem `--todas`, gera só a variante reservada daquele domínio ([[13-referencias-de-design]]). As saídas ficam em `saida/` (fora do Git) e cada pasta já é publicável no GitHub Pages ([[06-deploy-e-demonstracao]]).

## ⏭️ Próximos passos

- [ ] **Calibrar com os links do fundador** — os modelos são o ponto de partida; os links ajustam paleta/tipografia de cada variante ([[13-referencias-de-design]]).
- [ ] Ligar o gerador ao lead: puxar nome, telefone e serviços reais do site antigo em vez dos presets.
- [ ] Publicação automática no GitHub Pages ao fim do QA.
- [ ] Comparação antes/depois na mesma página (o argumento de venda da [[02-funil-de-vendas]]).

> [!warning] Fronteira
> Estes modelos são o **nível 2** (demonstração gratuita, com limites) da [[07-cobranca-e-niveis]]. Página inicial completa — todas as páginas, conteúdo definitivo, formulários e integrações só no projeto pago.

## Relacionado

[[00-INDEX-prospeccao]] · [[05-producao-claude-code]] · [[13-referencias-de-design]] · [[12-automacao]]
