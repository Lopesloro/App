---
title: agent-browser — automação de navegador para agentes
date: 2026-08-17
tags:
  - monta-looks
  - ferramentas
  - qa
  - automacao
  - agentes
tipo: guia-de-ferramenta
status: ativo
---

# agent-browser — automação de navegador para agentes

Ferramenta oficial de automação web e QA do projeto: [`vercel-labs/agent-browser`](https://github.com/vercel-labs/agent-browser) (Vercel Labs, licença Apache-2.0, versão 0.34.0 em ago/2026). É uma **CLI nativa em Rust** que dirige Chrome/Chromium pelo **CDP** (Chrome DevTools Protocol) — sem Playwright, sem Puppeteer, sem Node no runtime.

Notas relacionadas: [[00-INDEX]] · [[06-seguranca]] · [[08-plano-de-testes]] · [[AGENTS]]

> [!important] Por que ela existe no nosso projeto
> Um agente de IA (Claude Code, Cursor, Codex…) não "vê" o app. Com agent-browser ele abre o app web, lê a página como **árvore de acessibilidade** (não como pixels nem HTML cru), clica, preenche formulário, tira screenshot, mede performance, audita acessibilidade e devolve tudo em texto/JSON. É o que transforma "acho que a tela de paywall está certa" em teste verificável com evidência.

---

## 1. Como está configurado aqui

| Arquivo | Papel |
|---|---|
| `agent-browser.json` | Config do projeto: headless, marcadores de conteúdo, limite de saída, pastas de screenshot/download, confirmação obrigatória para `download`/`upload`, daemon morre após 10 min ociosos |
| `.mcp.json` | **Conector MCP**: expõe o agent-browser como servidor MCP (`npx -y agent-browser mcp --tools core,debug,react`) para qualquer cliente MCP (Claude Code, Cursor, etc.) |
| `.claude/skills/agent-browser/SKILL.md` | Skill do Claude Code — stub de descoberta que aponta para `agent-browser skills get core` |
| `package.json` | Scripts `browser`, `browser:setup`, `browser:doctor`, `browser:qa`, `browser:dashboard` |
| `.gitignore` | Bloqueia `.agent-browser/`, `agent-browser.local.json`, `*.har`, `*-auth.json`, `*.trace.zip` |
| `AGENTS.md` | Regra curta para qualquer agente que trabalhe no repositório |

### Instalação (uma vez por máquina)

```bash
npm install -g agent-browser   # binário Rust nativo
agent-browser install          # baixa o Chrome for Testing (canal oficial do Google p/ automação)
agent-browser doctor           # diagnóstico do ambiente
```

Alternativas: `brew install agent-browser` (macOS), `cargo install agent-browser` (Rust), ou build do código-fonte (precisa de Node 24+, pnpm 11+ e Rust). No Linux, `agent-browser install --with-deps` instala também as libs de sistema. `agent-browser upgrade` detecta o método de instalação e atualiza sozinho.

> [!warning] Node 24+ para a versão atual
> O pacote npm declara `engines: node >=24`. Em máquina com Node 22 o npm resolve para a **0.27.0** (última compatível), que não tem comandos novos como `a11y`. Confirmado na prática — ver `docs/testes/2026-08-17-agent-browser.md`. Use Node 24+ para ter a 0.34.0.

### Uso no dia a dia

```bash
npm run browser:setup                       # 1ª vez
npx expo start --web                        # sobe o app em http://localhost:8081
npm run browser:qa                          # abre o app numa sessão isolada, só localhost
npx -y agent-browser snapshot -i            # lista elementos interativos com refs
npx -y agent-browser click @e3
npx -y agent-browser screenshot
npx -y agent-browser close
```

---

## 2. O modelo mental: refs `@eN` em vez de seletores

O comando `snapshot` devolve a **árvore de acessibilidade** com uma ref por elemento:

```
- heading "Monta Looks" [level=1, ref=e1]
- textbox "E-mail" [ref=e2]
- button "Entrar" [ref=e3]
```

O agente então age pelas refs: `fill @e2 "voce@exemplo.com"`, `click @e3`. Vantagens: saída pequena (cabe no contexto do modelo), estável (não quebra com mudança de CSS) e **já vigia acessibilidade** — se um botão não tem nome acessível, ele aparece anônimo no snapshot. Isso conversa direto com a regra de RNTL do [[08-plano-de-testes]] (consultar por papel/texto, nunca por `testID` primeiro).

Também aceita seletores tradicionais (`#submit`, `.item`), texto, XPath e localizadores semânticos (`find role button click --name "Entrar"`).

---

## 3. Tudo que ele faz — catálogo completo

### 3.1 Navegação e ciclo de vida

`open [url]` (aliases `goto`, `navigate`) · `back` · `forward` · `reload` · `pushstate <url>` (navegação SPA client-side, detecta o router do Next) · `close` / `close --all` · `connect <porta>` (anexa a um Chrome já rodando via CDP).

`open` sem URL sobe o navegador em `about:blank` — é o gancho para preparar cookies, rotas de rede e init scripts **antes** da primeira navegação.

### 3.2 Interação

`click` (com `--new-tab`) · `dblclick` · `focus` · `type` · `fill` · `press <tecla>` · `keyboard type|inserttext` · `keydown` / `keyup` · `hover` · `select` · `check` / `uncheck` · `scroll <direção> [px]` · `scrollintoview` · `drag <origem> <destino>` · `upload <sel> <arquivos>`.

Cliques falham cedo e com explicação quando outro elemento cobre o alvo (banner de cookies, modal) — em vez de clicar no lugar errado em silêncio.

### 3.3 Leitura de página

- `snapshot` — árvore de acessibilidade. Filtros: `-i` (só interativos), `-c` (compacto), `-d N` (profundidade), `-s "#main"` (escopo), `--urls` (URLs dos links).
- `read [url]` — texto "agent-friendly". Sem URL lê o DOM renderizado da aba ativa (com estado de login); com URL busca sem abrir o Chrome, pedindo `text/markdown`, tentando `.md`, e procurando o `llms.txt` mais próximo. Opções: `--outline`, `--llms index|full`, `--filter`, `--raw`, `--require-md`, `--json`.
- `get text|html|value|attr|title|url|count|box|styles|cdp-url`.
- `is visible|enabled|checked`.
- `find role|text|label|placeholder|alt|title|testid|first|last|nth` + ação (`click`, `fill`, `check`, `hover`, `text`).

### 3.4 Espera

`wait <seletor>` · `wait <ms>` · `wait --text "Bem-vinda"` · `wait --url "**/looks"` · `wait --load load|domcontentloaded|networkidle` · `wait --fn "window.pronto === true"` · `wait "#spinner" --state hidden`.

### 3.5 Captura e comparação

- `screenshot [caminho]` — `--full` (página inteira), `--annotate` (rótulos numerados sobre os elementos), `--screenshot-format png|jpeg`, `--screenshot-quality`, `--screenshot-dir`.
- `pdf <caminho>`.
- `diff snapshot` — regressão estrutural contra o último snapshot ou um baseline salvo.
- `diff screenshot --baseline antes.png [-t 0.2]` — diff visual pixel a pixel.
- `diff url <v1> <v2> [--screenshot] [--selector "#main"]` — compara duas versões do app (ex.: staging vs produção).

### 3.6 Qualidade: acessibilidade, React e Web Vitals

- `a11y [url]` — auditoria **axe-core** embutida no binário (funciona offline e sob CSP restrito). `--tags wcag2a,wcag2aa`, `--selector`, `--json`. Saída lista impacto, regra, link do fix e seletores das falhas. *(disponível a partir da 0.28; na 0.27 o comando não existe.)*
- `vitals [url]` — LCP, CLS, TTFB, FCP, INP + resumo de hidratação, agnóstico de framework.
- `react tree` / `react inspect <fiberId>` (props, hooks, state, source) / `react renders start|stop` (perfil de renders) / `react suspense` — exige subir com `--enable react-devtools`. Serve para o app web (React Native Web) e para a landing/admin Next.js.

### 3.7 Rede

`network route <url>` (interceptar) · `--abort` (bloquear) · `--body <json>` (mockar resposta) · `--resource-type script` (bloquear só scripts) · `network unroute` · `network requests` com filtros `--filter`, `--type xhr,fetch`, `--method POST`, `--status 2xx` · `network request <id>` (detalhe completo) · `network har start|stop [arquivo.har]` (com ou sem corpos das respostas).

Uso típico aqui: provar que a foto da usuária sobe para bucket privado com URL assinada, que nenhum endpoint vaza dado pessoal em query string, e simular API fora do ar para testar estados de erro.

### 3.8 Abas, janelas, frames e diálogos

`tab` (lista, ids estáveis `t1`, `t2` e rótulos próprios) · `tab new [--label docs] [url]` · `tab <id|rótulo>` · `tab close` · `window new` · `frame <sel>` / `frame main` · `dialog accept [texto]` / `dialog dismiss` / `dialog status`.

`alert` e `beforeunload` são aceitos automaticamente (não travam o agente); `confirm` e `prompt` exigem decisão explícita. `--pin-tab` prende a sessão à sua própria aba quando vários agentes dividem um Chrome.

### 3.9 Estado do navegador, cookies e storage

`cookies` / `cookies set` (inclusive `--curl` importando um "Copy as cURL") / `cookies clear` · `storage local|session [chave] [set|clear]` · `state save|load|list|show|rename|clear|clean --older-than <dias>`.

### 3.10 Emulação

`set viewport <l> <a> [escala]` · `set device "iPhone 14"` · `set geo <lat> <lng>` · `set offline on|off` · `set headers <json>` · `set credentials <u> <s>` · `set media dark|light` · `mouse move|down|up|wheel` · `--color-scheme` · `--user-agent`.

Essencial para o nosso público mobile: testar o app web em viewport de celular, tema escuro e conexão offline.

### 3.11 Depuração e observabilidade

`console` (`--json`, `--clear`) · `errors` (exceções JS não capturadas) · `highlight <sel>` · `inspect` (abre o DevTools) · `trace start|stop` · `profiler start|stop` · `eval <js>` (com `-b` base64 ou `--stdin`) · `addinitscript` / `removeinitscript`.

**Dashboard** (`agent-browser dashboard start`, porta 4848): viewport ao vivo em JPEG, feed cronológico de comandos com timing, console do navegador, criação de sessões pela UI e um painel de chat com IA. É o "assistir o agente trabalhar" — ótimo para o fundador acompanhar um QA sem ler log.

**Streaming**: cada sessão sobe um servidor WebSocket com o viewport (`stream enable|status|disable`), para preview ao vivo ou "pair browsing" (humano e agente na mesma tela).

### 3.12 Sessões, perfis e autenticação

| Recurso | Para quê |
|---|---|
| `--session <nome>` | Instâncias isoladas em paralelo (cookies, storage, histórico e auth próprios) |
| `--restore` | Salva/restaura estado automaticamente por chave de sessão (`~/.agent-browser/sessions/`), com validação opcional por URL/texto/JS |
| `--profile <nome\|caminho>` | Reaproveita um perfil real do Chrome (login já feito) ou um diretório persistente |
| `--auto-connect` + `state save` | Importa a autenticação de um Chrome que você já usa |
| `auth save` / `auth login` | **Cofre de credenciais** local sempre criptografado; o LLM nunca vê a senha |
| `AGENT_BROWSER_ENCRYPTION_KEY` | Criptografa os arquivos de estado em repouso |
| `session list` / `session info --json` / `session id --scope worktree` | Inspeção e ids estáveis por worktree |

### 3.13 Execução em lote e automação de nível agente

- `batch "open ..." "snapshot -i" "click @e1"` ou JSON via stdin, com `--bail` — vários passos numa única invocação (elimina overhead de processo).
- `--json` — toda saída estruturada para consumo por agente.
- `chat "abra o app e faça login"` — modo linguagem natural (single-shot ou REPL), traduzindo instrução em comandos; exige `AI_GATEWAY_API_KEY` (Vercel AI Gateway).
- `mcp` — servidor **Model Context Protocol** por stdio, com perfis de ferramentas: `core`, `network`, `state`, `debug`, `tabs`, `react`, `mobile`, `all`. É o modo em que configuramos o conector no `.mcp.json`.
- `skills list|get <nome> [--full]` — a própria CLI serve a documentação da versão instalada, então as instruções do agente nunca ficam velhas.

### 3.14 Segurança (tudo opt-in)

| Recurso | Flag | O que resolve |
|---|---|---|
| Cofre de credenciais | `auth save` / `auth login` | Senha nunca entra no contexto do LLM |
| Marcadores de conteúdo | `--content-boundaries` | Delimita o conteúdo da página com nonce aleatório → defende contra **prompt injection** vinda do site |
| Allowlist de domínios | `--allowed-domains` | Bloqueia navegação, sub-recursos, WebSocket, EventSource, `sendBeacon` e WebRTC fora da lista → barra exfiltração |
| Política de ações | `--action-policy policy.json` | `default: deny` + lista do que pode (`navigate`, `snapshot`, `click`…) |
| Confirmação de ações | `--confirm-actions eval,download,upload` | Ação sensível fica pendente até `agent-browser confirm <id>` (auto-nega em 60s) |
| Limite de saída | `--max-output 50000` | Impede que uma página gigante afogue o contexto |
| Plugins | `plugin add/list/run` | Extensões externas por capacidade (`credential.read`, `browser.provider`, `launch.mutate`, `command.run`), fora do processo |

Categorias de ação da política: `navigate`, `click`, `fill`, `eval`, `download`, `upload`, `snapshot`, `scroll`, `wait`, `read`, `get`, `interact`, `network`, `state`.

> [!warning] Regra do Monta Looks
> Nossa `agent-browser.json` já liga `contentBoundaries`, `maxOutput` e confirmação para `download`/`upload`. Ao automatizar **qualquer site externo**, adicionar `--allowed-domains`. Nunca rodar automação logada na conta real de uma usuária — só contas e fotos de teste. Ver [[06-seguranca]].

### 3.15 Onde o navegador roda

- Local: Chrome/Chromium (Chrome for Testing), engine alternativa `lightpanda`, `--headed` para ver a janela, `--webgpu`, `--proxy`, `--executable-path`, `--extension`, `--ignore-https-errors`, `--allow-file-access`.
- Remoto/nuvem: `--cdp <porta|ws://>`, `--auto-connect`, e provedores **Browserless, Browserbase, Browser Use, Kernel, AWS Bedrock AgentCore**, além de **Vercel Sandbox** e AWS Lambda.
- Mobile real: **Safari no Simulador iOS** e dispositivo iOS físico via Appium/WebDriverAgent (exige macOS + Xcode) — caminho natural para testar o app web em Safari, que é o ponto cego do nosso stack.
- Desktop: apps **Electron** (VS Code, Slack, Figma…).
- Plataformas do binário: macOS ARM64/x64, Linux ARM64/x64, Windows x64.

### 3.16 Arquitetura

CLI Rust + **daemon Rust** falando CDP direto. O daemon sobe no primeiro comando e persiste entre comandos (por isso o segundo comando é instantâneo); depois de 1 hora ocioso (10 min na nossa config) ele salva o estado configurado, fecha o navegador e sai. Timeout padrão de operação: 25 s (`AGENT_BROWSER_DEFAULT_TIMEOUT`).

---

## 4. Onde isso encaixa no Monta Looks

| Necessidade do projeto | Comando |
|---|---|
| QA exploratório do app web antes do PR | `agent-browser skills get dogfood` + `batch` |
| Regressão visual de tela de look/paywall | `diff screenshot --baseline` |
| Acessibilidade (público feminino amplo, leitores de tela) | `a11y --tags wcag2a,wcag2aa` |
| Performance da landing/admin | `vitals`, `react renders` |
| Provar que foto vai para bucket privado | `network requests --type xhr,fetch --filter upload` + `network har start` |
| Testar app offline / conexão ruim | `set offline on`, `network route '*' --abort` |
| Evidência para o registro de teste | `screenshot --annotate`, `console`, `errors` |
| Guardar login de conta de teste | `auth save` + `auth login` (cofre criptografado) |

> [!important] Registro obrigatório
> Toda execução vira linha no registro de `docs/testes/` (regra do fundador em [[08-plano-de-testes]]). Evidência sensível não sobe: copiar para `docs/testes/evidencias/` só o que não contém dado pessoal.

---

## 5. Limites conhecidos

- Precisa de Node 24+ para instalar a versão atual pelo npm (ver aviso na seção 1).
- `--allowed-domains` é incompatível com CDP pré-existente, `--auto-connect`, perfis do Chrome, restauração de estado, iOS e Safari — nesses modos o agent-browser não consegue instalar a contenção antes dos scripts da página.
- `chat` e o painel de IA do dashboard exigem chave do Vercel AI Gateway (custo à parte).
- Automação roda contra o **app web** (Expo Web/Next.js). Para o app nativo em device, o plano segue sendo Maestro, conforme [[08-plano-de-testes]].
- Em ambiente com egress restrito (ex.: sessões remotas do Claude Code), navegação para domínios externos pode ser bloqueada pela política de rede — `localhost` continua funcionando.
