---
title: Meus looks salvos — testes
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - salvos
  - testes
  - seguranca
tipo: registro-de-teste
status: aprovado
---

# Meus looks salvos — testes

| Campo | Valor |
|---|---|
| Data | 2026-08-12 |
| Executor | Equipe de desenvolvimento |
| Escopo | Tela de coleção, coração no cartão e endurecimento da validação do catálogo |
| Resultado | ✅ 31 testes novos, todos passando (129 no projeto) |

## O coração no cartão

| Teste | O que garante na prática |
|---|---|
| Não aparece onde a tela não oferece salvar | O mesmo cartão serve várias telas sem poluir |
| Aparece quando a tela oferece | O básico funciona |
| Coração vazio quando não salvo, cheio quando salvo | A usuária vê o estado sem precisar abrir |
| **Salvar não abre o look junto** | Um toque, uma ação — não cai numa tela que não pediu |
| Anuncia "Salvar look" / "Remover dos salvos" | Usuária cega sabe o que o botão faz agora |
| Avisa qual look salvar | Salva o look certo, não o vizinho |

## Segurança: catálogo hostil é barrado na entrada

Estes testes existem porque o catálogo virá de planilha e de API de parceiro — fontes que não controlamos.

| Teste | O que garante na prática |
|---|---|
| **Recusa código `../paywall`** | Catálogo comprometido não desvia a navegação |
| Recusa `x/../../perfil` | Não sobe de diretório na rota |
| Recusa `look?redirect=evil` | Não injeta parâmetro na rota |
| Recusa `look%2f001` (barra codificada) | Não escapa pela codificação |
| Recusa código com espaço, vazio ou longo demais | Entrada malformada não passa |
| **Recusa foto `file:///...`** | App não tenta ler arquivo do aparelho |
| Recusa foto/link `javascript:` | Não executa código |
| Recusa `data:` e `intent:` | Não injeta página nem abre outro app |
| Aceita `http` e `https` | Loja e foto de verdade continuam funcionando |
| Aceita o catálogo legítimo inteiro | O endurecimento não quebrou nada existente |

| Teste especial | Por que existe |
|---|---|
| **Documenta que `z.string().url()` do zod aceita `javascript:`** | Prova por teste o motivo de não usar a validação padrão. Se alguém "simplificar" no futuro, o teste explica o porquê |

## Como rodar

```bash
npm test
```

## O que **não** foi testado

- **A tela em si não tem teste automatizado.** As telas são cobertas por teste de aparelho (Maestro), que depende de build — ver [[../../08-plano-de-testes|plano de testes]]. O que foi testado aqui é a lógica e o cartão.
- **Não foi testado em celular.**
- **Não testa coleção grande.** Com centenas de salvos, a tela busca um por um; pode precisar de otimização. Não dá para medir sem aparelho.

## Nota honesta sobre esta revisão

Estes achados de segurança vieram de **leitura manual do código**. Uma auditoria automatizada com agentes paralelos foi iniciada e **falhou por limite de gastos da conta** antes de produzir qualquer resultado — ela não aprovou o código, ela não rodou. Uma auditoria independente ainda está pendente.

Voltar: [[o-que-e]] · [[como-funciona]]
