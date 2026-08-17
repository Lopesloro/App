# Automação — máquina de prospecção de sites

Subprojeto Node **independente do app Expo** (a raiz do repo exclui esta pasta do lint/typecheck/jest dela). Implementa a Fase 2 do plano ([[10-mvp-e-metricas]]): analisador de sites + score + variantes de design.

## O que já faz

- **Analisador** (`src/analisador.ts`): cascata barata da nota [[03-score-de-qualidade]] — site responde? → https ok? → lento? → HTML (viewport, layout fixo, sinais de design antigo, copyright parado, CTA, conteúdo misto) → amostra de links internos quebrados. **Zero IA** — o campo `usarIA` só marca quem passou do corte (61).
- **Score e faixas** (`src/score.ts`): espelho exato da nota 03; teste automatizado quebra se divergir.
- **Variantes de design** (`src/estilo.ts` + `referencias/`): cada lead recebe uma base visual determinística, com espalhamento no lote — nenhuma demo sai igual à outra. Links de referência entram em `referencias/referencias-design.json`.
- **Nota Obsidian por lead** (`src/relatorio.ts`): cada análise vira `prospeccao-sites/leads/<dominio>.md` com score, evidências, variante reservada e o checklist do funil.
- **6 modelos de site completos** (`src/demo/`): cada variante é um site próprio (layout, tipografia, estrutura e decorações diferentes), com conteúdo por segmento, **QA automático de 12 itens** e capturas mobile/desktop. Ver `../14-modelos-de-site.md`.

## Como usar

```bash
cd prospeccao-sites/automacao
npm install          # só devDependencies (typescript + @types/node)

# um site
npm run analisar -- https://exemplo.com.br --nome "Empresa Exemplo"

# lote (uma URL por linha, # comenta)
npm run lote -- lista.txt

# demos (saída em saida/demos/<slug>/index.html)
npm run demo -- --nome "Clínica Sorriso" --segmento clinica --cidade "São Paulo" \
                --whatsapp 5511999999999 --dominio clinicasorriso.com.br --todas
npm run capturas     # PNGs mobile + desktop em saida/capturas

# qualidade
npm run teste        # node:test
npm run typecheck    # tsc --noEmit
```

Requer Node ≥ 22 (roda TypeScript direto via type-stripping). As capturas usam o Chromium local via `playwright-core` (`CHROMIUM_PATH=/caminho` se não for encontrado).

Segmentos disponíveis: `clinica`, `restaurante`, `oficina`, `imobiliaria`, `salao`, `advocacia`. Sem `--todas`, gera só a variante reservada do domínio.

## O que ainda NÃO faz (por decisão, não por falta)

- Não manda WhatsApp — [[04-conversas-whatsapp]] depende da escolha da API oficial.
- Não chama IA — a análise cara só entra depois do corte, e ainda não está ligada.
- Não publica no GitHub Pages — a pasta gerada já é publicável, falta automatizar.
- Não puxa dados reais do site antigo — as demos usam presets por segmento.
