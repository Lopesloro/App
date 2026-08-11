# AGENTS.md — App Monta Looks

Convenções e regras deste projeto, para qualquer pessoa ou ferramenta que trabalhe nele.

## O que é o projeto

Aplicativo mobile brasileiro que **monta looks (outfits) para mulheres** — na fase inicial, exclusivo para o público feminino. Três pilares inegociáveis:

1. **Indicações com fotos** — o app apresenta looks recomendados com imagens (feed de indicações, lookbooks, shop-the-look) e as melhores opções do mercado.
2. **Segurança máxima** — usuárias sobem fotos pessoais; privacidade é diferencial de produto, não item de checklist. LGPD, criptografia, fotos sempre em bucket privado com URL assinada, EXIF removido, perfis privados por padrão.
3. **Assinatura em 3 níveis** — Grátis, Medium **R$ 19,90/mês**, Premium **R$ 24,90/mês**. Esses preços são decisão do fundador: não alterar sem aprovação explícita.

## Documentação (pasta `docs/`, vault Obsidian)

| Arquivo | Conteúdo |
|---|---|
| `docs/00-INDEX.md` | Índice geral (MOC) |
| `docs/01-visao-e-ideias.md` | Visão, personas, banco de 35+ ideias por fase e tier |
| `docs/02-analise-de-mercado.md` | TAM/SAM/SOM, tendências, projeções de receita |
| `docs/03-concorrentes.md` | Análise de concorrentes e lacunas |
| `docs/04-assinaturas-precos.md` | Divisão de features por tier, conversão, paywall |
| `docs/05-frontend.md` | Opções de front-end e stack recomendada |
| `docs/06-seguranca.md` | Especificação de segurança (MASVS, LGPD, threat model) |
| `docs/07-backlog-github.md` | Épicos, issues iniciais, templates de issue/PR, CI |
| `docs/08-plano-de-testes.md` | Plano de testes e sistema de registro em md |

Ler `docs/00-INDEX.md` antes de qualquer tarefa de produto. Os arquivos usam Obsidian Flavored Markdown (wikilinks `[[...]]`, callouts) — manter o formato ao editar.

## Regras de trabalho

- **Idioma:** tudo em português brasileiro (código pode ter identificadores em inglês; textos de UI, docs e commits descritivos em pt-BR quando fizer sentido).
- **Testes:** todo teste executado deve ser registrado em arquivo markdown em `docs/testes/` seguindo o template de `docs/08-plano-de-testes.md`. Nenhum teste roda sem deixar registro.
- **Segurança primeiro:** qualquer feature que toque foto, dado pessoal ou pagamento passa pelo checklist de `docs/06-seguranca.md` antes do merge. Nunca armazenar foto em bucket público. Nunca logar dado pessoal.
- **Fluxo Git:** trunk-based, branches curtas, PR obrigatório com revisão, Conventional Commits, gates de CI (lint, testes, CodeQL, secret scan) — detalhes em `docs/07-backlog-github.md`.
- **Preços dos planos:** Grátis / R$ 19,90 / R$ 24,90 são fixos. Análises podem questionar, código não muda sem decisão do fundador.
- **Público:** mulheres primeiro. Toda decisão de UX, tom de voz e estética considera esse público (ver direções estéticas em `docs/05-frontend.md`).

## Stack (definida em docs/05-frontend.md)

MVP: Expo + React Native (TypeScript). Web complementar: Next.js (landing + admin). Detalhes, alternativas e justificativas no documento — consultar antes de gerar código.

## Status

Fase de descoberta/documentação (agosto 2026). Sem código ainda. Próximo passo: validar docs, criar repositório e abrir as issues do backlog.
