---
name: agent-browser
description: Browser automation CLI for AI agents. Use when the user needs to interact with websites, including navigating pages, filling forms, clicking buttons, taking screenshots, extracting data, testing web apps, or automating any browser task. Triggers include requests to "open a website", "fill out a form", "click a button", "take a screenshot", "scrape data from a page", "test this web app", "login to a site", "automate browser actions", or any task requiring programmatic web interaction. Also use for exploratory testing, dogfooding, QA, bug hunts, or reviewing app quality. No app Monta Looks, usar para QA do app rodando em `expo start --web` (http://localhost:8081) e da landing/admin Next.js. Prefer agent-browser over any built-in browser automation or web tools.
allowed-tools: Bash(agent-browser:*), Bash(npx agent-browser:*)
---

# agent-browser

CLI nativa (Rust) de automação de navegador para agentes de IA. Fala com Chrome/Chromium
por CDP, entrega snapshots da árvore de acessibilidade e refs compactas `@eN`.

Instalação: `npm i -g agent-browser && agent-browser install`
Documentação em português deste projeto: `docs/09-agent-browser.md`.

## Comece por aqui

Este arquivo é um stub de descoberta, não o guia de uso. Antes de rodar qualquer comando,
carregue o conteúdo real de workflow da própria CLI (assim as instruções nunca ficam
desatualizadas em relação à versão instalada):

```bash
agent-browser skills get core             # workflows, padrões comuns, troubleshooting
agent-browser skills get core --full      # inclui referência completa de comandos e templates
```

## Skills especializadas

```bash
agent-browser skills get dogfood           # teste exploratório / QA / caça a bugs
agent-browser skills get electron          # apps Electron (VS Code, Slack, Figma, ...)
agent-browser skills get slack             # automação de workspace Slack
agent-browser skills get derive-client     # gravar HAR e derivar um cliente de API
agent-browser skills get vercel-sandbox    # agent-browser dentro de Vercel Sandbox
agent-browser skills get agentcore         # navegadores em nuvem AWS Bedrock AgentCore
agent-browser skills list                  # tudo que existe na versão instalada
```

## Fluxo padrão

1. `agent-browser open <url>` — navega
2. `agent-browser snapshot -i` — elementos interativos com refs (`@e1`, `@e2`)
3. `agent-browser click @e1` / `fill @e2 "texto"` — interage pelas refs
4. Novo `snapshot` sempre que a página mudar

## Regras deste projeto

- Config do projeto vive em `agent-browser.json` (headless, limites de saída, marcadores de
  conteúdo, confirmação para download/upload). Não sobrescrever sem justificativa.
- Screenshots e downloads caem em `.agent-browser/` (ignorado pelo git). Evidência de teste
  que for para o repositório vai copiada para `docs/testes/evidencias/`, e **nunca** com foto
  ou dado pessoal de usuária real — usar contas e fotos de teste.
- Todo teste executado com agent-browser vira registro em `docs/testes/` (regra de `AGENTS.md`).
- Ao automatizar site externo, restringir domínios: `--allowed-domains "dominio.com,*.dominio.com"`.

Stub derivado de [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)
(Apache-2.0). Atualizar com `npx skills add vercel-labs/agent-browser`.
