# App Monta Looks

Aplicativo mobile brasileiro que monta looks para mulheres, com **indicações fotográficas** das melhores opções do mercado, **segurança máxima** (LGPD by design) e assinatura em 3 níveis.

| Plano | Preço |
|---|---|
| Grátis | R$ 0 (anúncios + afiliados) |
| Medium | R$ 19,90/mês |
| Premium | R$ 24,90/mês |

## Documentação

Toda a documentação de produto, mercado e engenharia está em [`docs/`](docs/) (compatível com Obsidian — abrir a raiz do repo como vault):

- [`docs/00-INDEX.md`](docs/00-INDEX.md) — índice geral
- [`docs/01-visao-e-ideias.md`](docs/01-visao-e-ideias.md) — visão, personas, 43 ideias por fase
- [`docs/02-analise-de-mercado.md`](docs/02-analise-de-mercado.md) — TAM/SAM/SOM e projeções
- [`docs/03-concorrentes.md`](docs/03-concorrentes.md) — análise competitiva
- [`docs/04-assinaturas-precos.md`](docs/04-assinaturas-precos.md) — estratégia de planos
- [`docs/05-frontend.md`](docs/05-frontend.md) — stack: Expo + React Native (TS)
- [`docs/06-seguranca.md`](docs/06-seguranca.md) — threat model, MASVS, LGPD
- [`docs/07-backlog-github.md`](docs/07-backlog-github.md) — backlog, fluxo de PR, CI
- [`docs/08-plano-de-testes.md`](docs/08-plano-de-testes.md) — plano de testes e registro

Regras do projeto para agentes de IA: [`CLAUDE.md`](CLAUDE.md).

## Regras de ouro

1. Nada entra em `main` sem pull request revisado e checks verdes (incluindo gates de segurança).
2. Todo teste executado vira registro em markdown em [`docs/testes/`](docs/testes/).
3. Fotos de usuárias são dado sensível: issues que tocam upload/armazenamento/exibição de foto levam label `seguranca` obrigatória.
4. Preços dos planos são fixos — não mudar sem decisão do fundador.

## Status

Fase 0 (fundação) — repositório, backlog e processos. Código do app começa na Fase 1 (auth + segurança de fotos). Ordem de ataque no final de [`docs/07-backlog-github.md`](docs/07-backlog-github.md).
