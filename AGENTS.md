# AGENTS.md — App Monta Looks

Convenções e regras deste projeto, para qualquer pessoa ou ferramenta que trabalhe nele.

## O que é o projeto

Aplicativo mobile brasileiro de moda feminina — na fase inicial, exclusivo para o público feminino.

**O app hoje faz uma coisa:** procurar tipo de roupa, marcar o que a usuária tem, montar o guarda-roupa dela — e aprender o estilo dela a partir disso, **no próprio aparelho**.

Pilares inegociáveis:

1. **Guarda-roupa e estilo, sem depender de ninguém** — catálogo de *tipos* de roupa (não produtos de loja), busca no aparelho, algoritmo de estilo local. Funciona sem servidor, sem internet e sem parceiro comercial.
2. **Segurança máxima** — usuárias vão subir fotos pessoais; privacidade é diferencial de produto, não item de checklist. LGPD, criptografia, fotos sempre em bucket privado com URL assinada, EXIF removido, perfis privados por padrão. **O perfil de estilo não sai do aparelho** — mudar isso é decisão de produto, não detalhe técnico.
3. **Nada será vendido por enquanto** — decisão do fundador, agosto/2026. Assinatura, paywall, limite por plano e link de afiliado ficam desligados pela chave `MONETIZACAO_ATIVA` (`src/lib/flags.ts`), com o código inteiro preservado e testado. Quando voltar: Grátis, Medium **R$ 19,90/mês**, Premium **R$ 24,90/mês** — preços fixos, não alterar sem aprovação explícita.

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
| `docs/09-mercado-sem-venda.md` | Mercado do app sem venda: guarda-roupa, privacidade no aparelho, quando religar |
| `docs/features/` | Uma pasta por feature construída: o que é, como funciona, testes |
| `docs/CHECKLIST.md` | Estado atual e o que falta até a loja, em ordem de execução |

Ler `docs/00-INDEX.md` antes de qualquer tarefa de produto. Os arquivos usam Obsidian Flavored Markdown (wikilinks `[[...]]`, callouts) — manter o formato ao editar.

## Regras de trabalho

- **Idioma:** tudo em português brasileiro (código pode ter identificadores em inglês; textos de UI, docs e commits descritivos em pt-BR quando fizer sentido).
- **Testes:** todo teste executado deve ser registrado em arquivo markdown em `docs/testes/` seguindo o template de `docs/08-plano-de-testes.md`. Nenhum teste roda sem deixar registro.
- **Segurança primeiro:** qualquer feature que toque foto, dado pessoal ou pagamento passa pelo checklist de `docs/06-seguranca.md` antes do merge. Nunca armazenar foto em bucket público. Nunca logar dado pessoal.
- **Fluxo Git:** trunk-based, branches curtas, PR obrigatório com revisão, Conventional Commits, gates de CI (lint, testes, CodeQL, secret scan) — detalhes em `docs/07-backlog-github.md`.
- **Monetização:** desligada. Não adicionar preço, botão de assinar, link de loja ou aviso de comissão em tela nenhuma. Se uma feature nova precisar de gating comercial, ela passa por `MONETIZACAO_ATIVA` e ganha teste do caminho de volta — ver `docs/features/09-sem-monetizacao/`.
- **Preços dos planos:** Grátis / R$ 19,90 / R$ 24,90 são fixos. Análises podem questionar, código não muda sem decisão do fundador.
- **Vocabulário de moda:** os termos vivem em `src/features/estilo/vocabulario.ts` e são compartilhados por catálogo, busca e algoritmo. Só **acrescentar** termo, no fim da lista — remover ou renomear invalida o perfil já aprendido no aparelho das usuárias.
- **Dado da usuária no aparelho:** todo store que guarda algo dela se inscreve em `registrarLimpezaDeSessao` (`src/lib/limpeza-sessao.ts`). Sem isso, a próxima pessoa a usar o celular herda os dados da anterior.
- **Público:** mulheres primeiro. Toda decisão de UX, tom de voz e estética considera esse público (ver direções estéticas em `docs/05-frontend.md`).

## Stack (definida em docs/05-frontend.md)

MVP: Expo + React Native (TypeScript). Web complementar: Next.js (landing + admin). Detalhes, alternativas e justificativas no documento — consultar antes de gerar código.

## Status

Agosto/2026. O app funciona de ponta a ponta (busca de roupas, guarda-roupa, algoritmo de estilo), com 275 testes automatizados, sem backend e sem nada à venda.

O que trava mais coisa: **ninguém viu o app num celular ainda** — depende de uma conta no expo.dev (bloco 1 de `docs/CHECKLIST.md`).
