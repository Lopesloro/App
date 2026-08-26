---
title: Identidade visual — testes
date: 2026-08-26
tags:
  - monta-looks
  - feature
  - marca
  - testes
tipo: registro-de-teste
status: aprovado
---

# Identidade visual — testes

| Campo | Valor |
|---|---|
| Data | 2026-08-26 |
| Escopo | Marca, tema futurista, tela de abertura, segurança de chaves |
| Resultado | ✅ 295 testes unitários + 23/23 no navegador |
| Comandos | `npm test`, `npm run typecheck`, `npm run lint`, `npm run e2e` |

## Acessibilidade de cor (o que trava o estilo)

Estes rodam nas **três** direções visuais, não só na nova.

| Teste | O que garante |
|---|---|
| Texto principal passa em AA sobre fundo e superfície | Legibilidade do que mais se lê |
| Texto suave passa em AA | É a cor das legendas, a mais usada e a mais fácil de errar |
| **Texto sobre o botão primário passa em AA** | Era o par quebrado: branco sobre neon claro |
| Cor de erro se distingue do fundo | Aviso que não se vê não é aviso |
| A marca `escuro` bate com o fundo real | Senão a barra de status some: relógio escuro em fundo escuro |
| Nenhuma direção se parece com outra | Primários e fundos todos distintos |
| O padrão é o futurista | Trava a decisão do fundador |

> [!info] Fórmula duplicada de propósito
> O cálculo de contraste no teste é escrito de novo, independente do código que
> ele verifica. Se os dois compartilhassem a fórmula, um erro nela passaria
> despercebido dos dois lados.

## Splash e ícone acompanham o tema

| Teste | O que garante |
|---|---|
| `FUNDO_DA_MARCA` é exatamente o fundo do tema padrão | Sem flash de cor errada na abertura |
| O tema padrão é escuro, como o `userInterfaceStyle` declara | A configuração nativa não fica mentindo |

`app.config.ts` roda no Node e não consegue importar os tokens, então o valor é
repetido por necessidade. Este teste impede a repetição de virar divergência.

## Segurança de chaves

| Teste | O que garante |
|---|---|
| Nenhuma chave em formato conhecido no código | Google, OpenAI, GitHub, AWS, Slack, chave privada |
| Nenhuma `EXPO_PUBLIC_*` com cara de segredo | O prefixo significa "vai para o pacote e fica visível" |
| Nenhum `.env` rastreado | Só o `.env.example` |
| O `.gitignore` bloqueia `.env` | A proteção existe de verdade |
| O exemplo de env só tem valor público | Ninguém cola uma chave "só para exemplificar" |
| Nenhuma chamada direta a provedor de IA | Falar direto exigiria a chave no aparelho |
| O cliente de IA usa a nossa API | O caminho seguro é o único caminho |

> [!success] A trava foi testada contra ela mesma
> Uma chave falsa (formato válido, nunca funcionou) foi plantada de propósito.
> **Os dois testes ficaram vermelhos na hora**; ao remover, voltaram ao verde.
> Trava que nunca disparou não é trava.

### Auditoria manual, além dos testes

| Verificação | Resultado |
|---|---|
| Segredos no histórico inteiro (18 commits) | ✅ nenhum |
| Segredos no pacote web exportado | ✅ nenhum |

## Teste de navegador (23 passos, todos verdes)

**Entrada**

- a marca aparece na tela de abertura
- a promessa de privacidade está visível logo de cara
- o tema escuro está ativo
- **a página já nasce escura, antes do React montar**
- "Começar" entra no app sem pedir cadastro

**Catálogo** — 5 buscas por apelido e sem acento, busca vazia, filtro por categoria

**Algoritmo** — marcar 8 peças clássicas, ver as explicações aparecerem, o
guarda-roupa agrupado, o app afirmando "puxa para o clássico", a régua com 100%
de certeza

**Comércio** — nenhum preço, nenhum "Assine", nenhum "Ver planos" em lugar nenhum

**Temas** — trocar de visual muda o app inteiro; as três direções aparecem

**Persistência** — o guarda-roupa sobrevive a fechar e abrir

### O que o teste de navegador encontrou

Três defeitos que **nenhum** dos 295 testes unitários via, porque nenhum monta
tela de verdade:

| Defeito | Sintoma |
|---|---|
| React Navigation com tema próprio | Retângulo cinza claro atrás do app escuro |
| Documento nascia branco | Flash branco antes de o app desenhar |
| Documento fixo em escuro | Bordas escuras ao escolher um tema claro |

> [!warning] Um deles fui eu que criei
> O terceiro apareceu **por causa da correção do segundo**. Foi o teste rodando
> de novo que pegou. É o argumento a favor de rodar a suíte inteira depois de
> cada correção, e não só o passo que estava falhando.

## O que ainda não foi testado

- [ ] O visual num **celular físico**, no sol — continua sendo o item nº 1
- [ ] Desempenho da animação num Android de entrada
- [ ] Se o público-alvo acha o visual futurista atraente (teste com usuárias)
- [ ] Leitor de tela percorrendo a tela de abertura

O que é: [[o-que-e]] · Decisões: [[como-funciona]] · Voltar: [[../README|Features]]
