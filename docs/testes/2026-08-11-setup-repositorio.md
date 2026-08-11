# Registro de teste — Setup do repositório (Fase 0)

| Campo | Valor |
|---|---|
| Data | 2026-08-11 |
| Versão | n/a (fase de fundação, sem app) |
| Ambiente | GitHub `Lopesloro/App` (público) |
| Executor | Claude (Fase 0 automatizada) + fundador |
| Escopo | Issue [#48](https://github.com/Lopesloro/App/issues/48) — setup do repositório e pipeline de CI |

## Casos executados

| # | Verificação | Resultado |
|---|---|---|
| 1 | Push inicial em `main` (21 arquivos: docs, CLAUDE.md, templates, CI) | ✅ Passou |
| 2 | Workflow `ci` no push inicial (`detectar`, `qualidade`, `seguranca-sast` com gitleaks) | ✅ Passou (modo docs: jobs de app pulados via `detectar`) |
| 3 | 31 labels criadas (tipo, prioridade, épico, transversal, fluxo) | ✅ Passou |
| 4 | Milestones `MVP` e `v2` criados | ✅ Passou |
| 5 | 44 issues de backlog criadas (#6–#49) com labels e milestone | ✅ Passou |
| 6 | 10 issues de épico criadas (#50–#59) com tasklist das filhas | ✅ Passou (corrigido offset de numeração: filhas começam em #6, não #1) |
| 7 | Branch protection em `main`: PR obrigatório, checks `qualidade`/`seguranca-sast`/`dependency-review`, linear history, sem force-push, enforce admins | ✅ Passou |
| 8 | Secret scanning + push protection habilitados | ✅ Passou |
| 9 | Dependabot alerts + security updates habilitados | ✅ Passou |
| 10 | CI dos 5 PRs iniciais do Dependabot | ⚠️ Falhou na 1ª execução — dependency graph ainda desabilitado; graph habilitado e runs reexecutados |
| 11 | Este PR de registro passa pelos gates de proteção de `main` | ✅ (evidência: o merge deste PR) |

## Bugs / pendências abertas

- Aprovação obrigatória de revisor está em **0** (time de 1 pessoa — ver dica em `docs/07-backlog-github.md` seção 6.4). Reativar `required_approving_review_count: 1` + `require_code_owner_reviews: true` no primeiro dev contratado.
- Check `codeql` fica fora dos required checks até existir código (`package.json`) — adicionar quando a Fase 1 começar (rastreado em [#48](https://github.com/Lopesloro/App/issues/48)).
- 5 PRs do Dependabot (bumps de actions, majors) aguardando CI verde + revisão do fundador antes de merge.

## Evidências

- Commit inicial: `019c1cc` (`docs: fundacao do projeto — documentacao completa, templates e CI`)
- Issues: https://github.com/Lopesloro/App/issues
- Runs de CI: https://github.com/Lopesloro/App/actions
