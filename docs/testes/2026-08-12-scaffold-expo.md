# Registro de teste — Scaffold do app Expo (Fase 1)

| Campo | Valor |
|---|---|
| Data | 2026-08-12 |
| Versão | 0.1.0 (sem build ainda) |
| Ambiente | Windows 11, Node v24.13.0, npm 11.6.2 |
| Executor | Claude (Fase 1) |
| Escopo | Issue [#48](https://github.com/Lopesloro/App/issues/48) — scaffold do projeto; base para [#6](https://github.com/Lopesloro/App/issues/6), [#7](https://github.com/Lopesloro/App/issues/7), [#35](https://github.com/Lopesloro/App/issues/35) |

## Casos executados

| # | Verificação | Resultado |
|---|---|---|
| 1 | `npm install` resolve todas as dependências (Expo SDK 57, RN 0.86, React 19.2) | ✅ Passou (1404 pacotes) |
| 2 | `npm run typecheck` (`tsc --noEmit`, strict) | ✅ Passou, 0 erros |
| 3 | `npm run lint` (`expo lint`) | ✅ Passou — 30 arquivos analisados, 0 problemas |
| 4 | `npm test` (jest-expo) | ✅ Passou — 3 suítes, 31 testes |
| 5 | Teste de guarda dos preços: Grátis R$ 0, Medium R$ 19,90, Premium R$ 24,90, gap de R$ 5 | ✅ Passou |
| 6 | Credencial só grava com `keychainAccessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY` | ✅ Passou |
| 7 | `guardar()` recusa valor vazio sem chamar o SecureStore | ✅ Passou |
| 8 | `limparCredenciais()` não deixa nenhuma das 3 chaves para trás | ✅ Passou |
| 9 | Validação de e-mail/senha (mín. 8 chars, máx. 128, trim) e medidor de força | ✅ Passou |
| 10 | `.env.example` versionado e `.env` real bloqueado pelo `.gitignore` | ✅ Passou |
| 11 | `npx expo export --platform android` empacota o app | ✅ Passou — bundle Hermes de 4,4 MB |
| 12 | Gates de CI no PR (`qualidade`, `seguranca-sast`, `dependency-review`, `codeql`) | ✅ Passou na 2ª rodada (1ª expôs 2 problemas reais, corrigidos abaixo) |

## Problemas encontrados e resolvidos

| Problema | Causa | Correção |
|---|---|---|
| `npm install` falhou com `ENOSPC: no space left on device` | Disco C: em 100% (0 byte livre) | Removido `node_modules` parcial, template temporário e `npm cache clean --force` → 5,1 GB livres |
| `react-test-renderer@19.2.8` exigia `react ^19.2.8` (projeto usa 19.2.3) | Peer dependency solta | `react-test-renderer` fixado em 19.2.3 |
| `expo-local-authentication@~57.0.7` inexistente | Versão chutada | Corrigido para `~57.0.2` (idem screen-capture e secure-store) |
| Suítes quebravam com `this._moduleMocker.clearMocksOnScope is not a function` | jest 30 instalado, mas jest-expo 57 depende de jest 29 | jest fixado em `~29.7.0`, `@types/jest` em `^29.5.14` |
| `Cannot find name 'jest'` no typecheck | `types` não declarado no tsconfig | Adicionado `"types": ["jest"]` |
| Import de `@testing-library/react-native/extend-expect` não resolvia | Removido na v13 (matchers já embutidos) | Import excluído do `jest-setup.ts` |
| `newArchEnabled` rejeitado pelo tipo `ExpoConfig` | Padrão no SDK 57, não é mais opção | Removido do `app.config.ts` |
| `.env.example` invisível ao git | Padrão `.env.*` no `.gitignore` | Exceção `!.env.example` |
| CI: `npm ci` falhou com pacotes `@emnapi/*` faltando no lock | Lockfile inconsistente — resíduo do `npm install` que estourou o disco | `node_modules` e `package-lock.json` apagados e regerados do zero |
| CI: `dependency-review` reprovou por `image-size@1.2.1` (2 advisories *high*, DoS) | Dependência transitiva do Metro, fixado pelo Expo SDK 57 | Tentado `override` para 2.0.2 → **quebrou o Metro** (`expo export` falha em PNG). Revertido; exceção `allow-ghsas` documentada no CI + issue #62 para remover |
| CI: `npm ci` seguiu falhando (`@emnapi/core@1.11.3` faltando) mesmo com lock regerado | Fallback wasm do resolver do eslint só resolve no Linux; impossível gerar essas entradas a partir do Windows | Tentado `--os=linux --cpu=x64 --libc=glibc --include=optional` e alinhar o Node do CI (20 → 24): nenhum resolveu. Trocado por `npm install` (respeita o lock, reconcilia binários de plataforma) + issue #63 |
| CI: commitlint com `Invalid revision range` | Checkout raso não alcança o commit base do PR | `fetch-depth: 0` no job `qualidade` |

## Pendências abertas

- **NativeWind não adotado neste scaffold** — `docs/05-frontend.md` especifica NativeWind v4, mas a compatibilidade com SDK 57 não foi verificada e o risco de quebrar o CI não se justifica agora. O design system usa `StyleSheet` alimentado por `src/theme/tokens.ts`, que segue sendo a fonte única — migrar depois é mecânico. **Decisão do fundador pendente.**
- **Direção estética ativa: "Editorial Areia"** (`paleta` em `tokens.ts`). "Vinho Moderno" fica versionada ao lado; trocar após teste de preferência com 5–8 usuárias.
- `codeql` ainda não está nos required status checks — agora que existe código, deve ser adicionado.
- Sem teste em device real ainda: nenhum build EAS foi gerado nesta etapa. O job `build-eas` só roda em `main` e precisa do segredo `EXPO_TOKEN`, que ainda não existe.
- Duas exceções de infraestrutura abertas com justificativa e rastreamento: [#62](https://github.com/Lopesloro/App/issues/62) (`image-size`) e [#63](https://github.com/Lopesloro/App/issues/63) (`npm ci`).

## Evidências

```
Test Suites: 3 passed, 3 total
Tests:       31 passed, 31 total
```

- Lint: 30 arquivos analisados, 0 com problema
- Typecheck: saída vazia (0 erros)
