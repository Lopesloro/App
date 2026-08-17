# Registro de teste — Analisador de sites (projeto prospecção)

| Campo | Valor |
|---|---|
| Data | 2026-08-17 |
| Versão | prospeccao-automacao 0.1.0 |
| Ambiente | Linux (ambiente remoto), Node v22.22.2, npm 10.9.7 |
| Executor | Automação (sessão Claude Code) |
| Escopo | Subprojeto `prospeccao-sites/automacao/` — analisador + score + variantes de design (projeto separado do app; ver `prospeccao-sites/12-automacao.md`) |

## Casos executados

| # | Verificação | Resultado |
|---|---|---|
| 1 | `npm install` no subprojeto (só devDependencies: typescript, @types/node) | ✅ Passou |
| 2 | `npm run typecheck` (`tsc --noEmit`, strict, nodenext) | ✅ Passou, 0 erros |
| 3 | `npm run teste` (node:test) — score, checks de HTML e variantes | ✅ Passou — 18/18 testes |
| 4 | Tabela de pontos idêntica à nota `03-score-de-qualidade.md` (teste-guarda) | ✅ Passou |
| 5 | Faixas nos limites exatos (30/31, 60/61, 80/81) e corte de IA = 61 | ✅ Passou |
| 6 | Ponta a ponta: fixture "site antigo" local (tabela 960px, marquee, jQuery 1.x, © 2015, sem CTA, 2 links quebrados) | ✅ Score 100 → prioridade máxima, 7 critérios com evidência correta |
| 7 | Ponta a ponta: fixture "site moderno" local (viewport, wa.me, © 2026) | ✅ Score 10 → ignorar (só https, esperado em localhost http) |
| 8 | Determinismo das variantes (mesmo domínio → mesma variante; lote não concentra numa base) | ✅ Passou |
| 9 | Nota Obsidian de lead gerada em `prospeccao-sites/leads/` com frontmatter, evidências e checklist | ✅ Passou (exemplo fictício versionado) |
| 10 | Isolamento do app: pasta excluída do tsconfig/eslint/jest da raiz | ✅ Configurado (exclude + ignores + testPathIgnorePatterns) |

## Problemas encontrados e resolvidos

| Problema | Causa | Correção |
|---|---|---|
| Análise de sites externos falha neste ambiente (403 no CONNECT) | Política de rede do ambiente remoto só libera registries de pacotes | Teste ponta a ponta feito com servidores locais de fixture (`python3 -m http.server`); em máquina local o acesso é direto. Atrás de proxy: `NODE_USE_ENV_PROXY=1` |
| `<meta …>` na evidência sumiria na renderização da nota (Obsidian trata como HTML) | Texto de evidência com tags | Evidências envolvidas em crases no relatório |

## Pendências abertas

- Calibrar os pesos do score com os primeiros 100 sites reais do nicho escolhido (registrar novo teste ao rodar o primeiro lote).
- Links de referência de design ainda não preenchidos (`automacao/referencias/referencias-design.json`) — aguardando o fundador.
- CI não roda os testes do subprojeto (decisão: fora dos gates do app por ora). Avaliar job dedicado quando a automação estabilizar.

## Evidências

```
# pass 18
# fail 0

fixture antiga  → score 100 [Prioridade máxima] → IA
  (https_problematico, nao_responsivo, layout_ruim_celular, design_antigo,
   parece_abandonado, sem_cta, botoes_quebrados)
fixture moderna → score  10 [Ignorar]
```
