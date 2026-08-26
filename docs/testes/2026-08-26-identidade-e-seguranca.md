---
title: Registro de teste — identidade visual e segurança de chaves
date: 2026-08-26
tags:
  - monta-looks
  - teste
tipo: registro-de-teste
status: aprovado
---

# Registro — identidade visual, tema futurista e segurança de chaves

## Comandos

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ sem erro |
| `npx expo lint` | ✅ 0 erros, 0 avisos |
| `npm test` | ✅ **295 testes**, 24 suítes |
| `npm run e2e` | ✅ **23 de 23 passos**, 0 erro de console |
| `npx expo export --platform web` | ✅ 19 rotas geradas |

Crescimento: 280 → **295** testes unitários; 8 → **23** passos no navegador.

## O que foi construído

| Bloco | Entrega |
|---|---|
| A | Marca em SVG: cabide que também é prisma |
| B | Terceira direção visual (Neon Futuro), agora padrão |
| C | Tela de abertura animada e login que admite não ter servidor |
| D | Auditoria de segredos + trava automática contra chave exposta |
| E | Suíte de navegador com 23 passos e log por passo |

## Defeitos encontrados — e como

### Pelos testes de contraste

**Texto ilegível sobre o botão neon.** A cor do texto sobre o botão preenchido
vinha de `surface` (branco). No tema claro funcionava por coincidência; no
escuro virava branco sobre neon claro.

Corrigido com o token `inkSobrePrimario`, e travado por teste nas três direções.

### Pelo teste de navegador

Três defeitos que **nenhum** dos 295 testes unitários pegava, porque nenhum
monta tela de verdade:

| Defeito | Sintoma | Correção |
|---|---|---|
| React Navigation com tema próprio | Retângulo `#F2F2F2` atrás do app escuro | Ponte `temaDaNavegacao()` |
| Documento nascia branco | Flash branco antes do app desenhar | `src/app/+html.tsx` + `web.output: 'static'` |
| Documento fixo em escuro | Bordas escuras ao escolher tema claro | Sincronização com a paleta ativa |

> [!warning] O terceiro fui eu que criei
> Ele apareceu **por causa da correção do segundo**, e só foi pego porque a
> suíte inteira rodou de novo. É o argumento contra rodar só o passo que estava
> falhando.

### Pelas capturas de tela

Duas coisas que passavam em todos os testes e ainda assim estavam feias:

- **O halo atrás da marca era um disco de borda dura**, não um brilho. Uma
  `View` circular com cor sólida e opacidade baixa produz uma forma, não luz.
  Trocado por gradiente radial em SVG (`Brilho`).
- **Os cartões usavam pastéis de tema claro** sobre fundo preto — seis
  retângulos brilhantes puxando atenção para longe do nome da peça. A cor
  passou a acompanhar o tema.

Nenhuma das duas seria encontrada sem olhar. Teste verde não é o mesmo que
produto bom.

### Pelo Playwright, um falso positivo meu

Duas verificações minhas apontavam falha e o app estava certo: eu lia
`document.body`, mas o React Native Web pinta num `div` próprio e deixa o body
transparente. O erro estava no teste.

Registrado aqui porque a lição vale: **antes de "corrigir" o código, confirmar
que o teste está medindo a coisa certa.**

## Segurança de chaves

| Verificação | Resultado |
|---|---|
| Segredos no código rastreado | ✅ nenhum |
| Segredos no histórico (18 commits) | ✅ nenhum |
| Segredos no pacote web exportado | ✅ nenhum |
| `.env` rastreado pelo git | ✅ nenhum (só `.env.example`) |
| `.gitignore` cobrindo `.env` | ✅ sim |
| Chamada direta a provedor de IA | ✅ nenhuma |

### Teste de eficácia da trava

Uma chave falsa em formato válido (`AIza...`, nunca funcionou) foi plantada de
propósito no código rastreado.

| Momento | `nao ha chave em formato conhecido` | `nenhuma EXPO_PUBLIC_ com cara de segredo` |
|---|---|---|
| Com a chave plantada | ❌ vermelho | ❌ vermelho |
| Depois de remover | ✅ verde | ✅ verde |

> [!success] Por que este teste existe
> Uma trava que nunca disparou não é uma trava — é decoração. Agora sabemos que
> ela pega o caso real.

### A decisão sobre o Gemini

**A chave não pode entrar no app.** O pacote vai inteiro para o aparelho e
qualquer pessoa consegue lê-lo — não existe ofuscação que resolva, e a fatura
do uso indevido chega para o fundador.

O caminho é: app → nosso servidor (guarda a chave) → Gemini. Está escrito em
`src/features/ia/cliente-ia.ts`, desligado por `IA_ATIVA` até a API existir.

Detalhes: [[../10-ia-e-chaves]].

## O que ainda não foi testado

- [ ] **O app num celular físico** — continua sendo o item nº 1 do projeto
- [ ] Desempenho da animação num Android de entrada
- [ ] Se o público-alvo acha o visual futurista atraente
- [ ] Leitor de tela percorrendo a tela de abertura
- [ ] O e2e no CI (roda só na máquina, ainda não no GitHub Actions)

Feature: [[../features/10-identidade-visual/o-que-e]] · Índice: [[../00-INDEX]] · Checklist: [[../CHECKLIST]]
