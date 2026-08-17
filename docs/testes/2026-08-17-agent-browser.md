# Registro de teste — Configuração do agent-browser como conector

| Campo | Valor |
|---|---|
| Data | 2026-08-17 |
| Versão | agent-browser 0.27.0 (npm resolveu essa versão por causa do Node 22); repositório upstream em 0.34.0 |
| Ambiente | Container remoto Linux x86_64 (Claude Code na web), Node v22.22.2, npm 10.9.7, Chromium 1194 local |
| Executor | Agente (Claude Code) a pedido do fundador |
| Escopo | Instalar, validar e configurar `vercel-labs/agent-browser` como ferramenta de automação/QA do projeto (`docs/09-agent-browser.md`) |

## Casos executados

| # | Verificação | Resultado |
|---|---|---|
| 1 | `npm install -g agent-browser` instala o binário nativo | ✅ Passou — 1 pacote, 4 s |
| 2 | `agent-browser doctor --offline --quick` diagnostica o ambiente | ✅ Passou — 4 pass, 1 fail (Chrome ausente, esperado sem `agent-browser install`) |
| 3 | Detecção/uso de Chromium existente via `AGENT_BROWSER_EXECUTABLE_PATH` | ✅ Passou — usou `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` |
| 4 | `open` + `snapshot -i` numa página local (`http://localhost:8099`) | ✅ Passou — 3 elementos com refs `@e1..@e3` |
| 5 | `fill @e2` + `click @e3` + `get text #ok` (fluxo de formulário ponta a ponta) | ✅ Passou — retornou `Bem-vinda, gabriela@exemplo.com` |
| 6 | `batch` executando 6 comandos numa invocação | ✅ Passou |
| 7 | `screenshot` grava arquivo PNG | ✅ Passou — 10,5 KB |
| 8 | `vitals` (Web Vitals) responde | ✅ Passou |
| 9 | `console` / `errors` sem ruído na página de teste | ✅ Passou — saída vazia |
| 10 | Navegação para domínio externo (`https://example.com`) | ⚠️ Bloqueado pelo ambiente — `net::ERR_TUNNEL_CONNECTION_FAILED`; o proxy de egresso respondeu **403 ao CONNECT** (política da sessão remota), não é falha da ferramenta |
| 11 | `a11y` (auditoria axe-core) | ❌ `Unknown command` na 0.27.0 — comando existe a partir de versão posterior; requer Node 24+ para instalar a 0.34.0 |
| 12 | Config do projeto `agent-browser.json` validada contra o schema oficial (chaves camelCase) | ✅ Passou — todas as chaves usadas existem em `agent-browser.schema.json` |
| 13 | Servidor MCP (`agent-browser mcp`, conector do `.mcp.json`) | ❌ `Unknown command` na 0.27.0 — o subcomando só existe da 0.28 em diante. Config validada por sintaxe e contra a documentação oficial da 0.34.0; **falta validar em execução** numa máquina com Node 24+ |

## Problemas encontrados

| Problema | Causa | Correção / decisão |
|---|---|---|
| npm instalou a 0.27.0 em vez da 0.34.0 | `engines.node >= 24` no pacote; o container tem Node 22 | Documentado em `docs/09-agent-browser.md`; usar Node 24+ na máquina de desenvolvimento |
| Chrome não encontrado pelo `doctor` | `agent-browser install` não foi executado (download externo bloqueado no container) | Usado o Chromium local por `AGENT_BROWSER_EXECUTABLE_PATH`; em máquina do time, rodar `npm run browser:setup` |
| Sites externos inacessíveis | Política de egresso da sessão remota (403 no CONNECT) | Sem ação — `localhost` funciona, que é o alvo do QA do app |
| Primeira tentativa de `fill @e1` preencheu o elemento errado | Refs foram usadas antes de ler o snapshot (chute) | Reforçada no guia a regra: **sempre** `snapshot -i` antes de agir, e novo snapshot após mudança de página |

## Decisões de configuração

- **Não** adicionado como dependência do `package.json`: é ferramenta de desenvolvimento, e um `postinstall` que baixa binário Rust em todo `npm install` do CI aumentaria superfície de supply chain sem benefício. Instalação global + scripts `npx`.
- `screenshotDir`/`downloadPath` apontam para `.agent-browser/` (ignorado pelo git) para impedir commit acidental de captura com dado pessoal.
- `confirmActions: "download,upload"` — upload é o caminho de foto de usuária; passa a exigir confirmação explícita.
- `contentBoundaries` e `maxOutput` ligados por padrão (defesa contra prompt injection vinda de página e contra afogamento de contexto).

## Pendências abertas

- Revalidar os casos 11 e 13 numa máquina com Node 24+ e agent-browser 0.34.0 (`a11y` no fluxo de QA e handshake do servidor MCP).
- Rodar o primeiro QA real contra `npx expo start --web` (não executado aqui: o app web não foi levantado nesta sessão).
- Avaliar `--action-policy` restritivo (`default: deny`) quando houver fluxo de upload de foto implementado.

## Evidências

```
- heading "Monta Looks" [level=1, ref=e1]
- textbox "E-mail" [ref=e2]
- button "Entrar" [ref=e3]
✓ Done
✓ Done
Bem-vinda, gabriela@exemplo.com
```

```
agent-browser doctor
Environment  pass  CLI version 0.27.0 (linux x86_64)
Chrome       fail  No Chrome binary found
Daemons      pass  No active daemons
Summary: 4 pass, 0 warn, 1 fail
```

Screenshot de validação gerado em `.agent-browser/screenshots/` (não versionado — página de teste sintética, sem valor de evidência permanente).
