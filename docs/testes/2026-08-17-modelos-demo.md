# Registro de teste — Modelos de site das demos (projeto prospecção)

| Campo | Valor |
|---|---|
| Data | 2026-08-17 |
| Versão | prospeccao-automacao 0.1.0 |
| Ambiente | Linux (ambiente remoto), Node v22.22.2, Chromium do Playwright (/opt/pw-browsers) |
| Executor | Automação (sessão Claude Code) |
| Escopo | `prospeccao-sites/automacao/src/demo/` — 6 modelos de site, QA automático e capturas (ver `prospeccao-sites/14-modelos-de-site.md`) |

## Casos executados

| # | Verificação | Resultado |
|---|---|---|
| 1 | `npm run typecheck` (strict, nodenext) | ✅ Passou, 0 erros |
| 2 | `npm run teste` — suíte completa | ✅ Passou — 27/27 |
| 3 | Toda variante gera demo aprovada nos 12 itens do QA | ✅ Passou (6/6) |
| 4 | Variantes são diferentes entre si (CSS **e** corpo HTML, par a par) | ✅ Passou |
| 5 | Nome de empresa com `<script>` não injeta HTML (inclusive no JSON-LD) | ✅ Passou após correção |
| 6 | QA reprova página quebrada (sem viewport, âncora morta, recurso externo, sem wa.me) | ✅ Passou |
| 7 | Todos os 6 presets de segmento montam dados completos e passam no QA | ✅ Passou |
| 8 | Geração real das 6 demos via CLI (`--todas`) | ✅ 6/6 aprovadas, 14–16 KB cada |
| 9 | Capturas mobile (390px, página inteira) e desktop (1280px) das 6 demos | ✅ 12 PNGs gerados |
| 10 | Inspeção visual das capturas (contraste, hierarquia, botões) | ✅ Passou após 3 correções |

## Problemas encontrados e resolvidos

| Problema | Causa | Correção |
|---|---|---|
| Botão "Ver serviços" invisível (escuro sobre fundo escuro) no `v06-foto-imersiva` | CSS da variante vinha **antes** do base; em regras de mesma especificidade o base vencia | Ordem invertida (base → variante) + teste-guarda que falha se a ordem voltar a inverter |
| Nome de empresa malicioso escapava pelo JSON-LD | `JSON.stringify` não escapa `<`, permitindo fechar a tag `<script>` | `<` serializado como `<` |
| Telefone exibido como `+5511999999999` | Sem formatação, só o dígito bruto | `formatarTelefone()` → `+55 (11) 99999-9999` |
| Arco decorativo do `v01` flutuando acima do conteúdo | Decoração renderizada antes do container, mas o CSS a previa no fim | Receita ganhou `heroFim` (decoração no fluxo) separado de `heroExtra` (absoluta) |
| Botão fixo de WhatsApp aparecendo no meio da captura de página inteira | Artefato do `fullPage` com elemento `position:fixed` | Elementos fixos ocultados só durante a captura |

## Pendências abertas

- Links de referência do fundador ainda não chegaram — os modelos são o ponto de partida e serão calibrados (`13-referencias-de-design.md`).
- Demos ainda usam presets por segmento; falta puxar dados reais (nome, telefone, serviços) do site antigo do lead.
- Publicação automática no GitHub Pages não implementada.
- Comparação antes/depois na mesma página ainda não existe.

## Evidências

```
# pass 27
# fail 0

6 demos geradas — todas com QA APROVADO (12/12 itens):
 viewport · wa.me com número certo · tel: · âncoras · sem recurso externo
 · alt · lang · title · description · sem restos de template · ≤150 KB
 · aviso de demonstração
```

Capturas em `prospeccao-sites/automacao/saida/capturas/` (fora do Git — regeneráveis com `npm run capturas`).
