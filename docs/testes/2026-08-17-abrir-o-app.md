---
title: Registro de teste — abrir o app de verdade
date: 2026-08-17
tags:
  - monta-looks
  - teste
tipo: registro-de-teste
status: aprovado
---

# Registro — abrir o app de verdade

> [!important] Como este teste começou
> O fundador tentou abrir o app no iPhone e não conseguiu. Investigar isso
> revelou **dois problemas**, sendo um deles grave e invisível até alguém
> tentar usar o app.

## Problema 1 (grave) — não havia como entrar no app

A tela de login validava e-mail e senha, mas **não navegava para lugar nenhum**
e nunca chamava `entrar()`. Como também não existe servidor de autenticação,
não havia **nenhum caminho** até as abas — em plataforma nenhuma.

Ou seja: o app era inalcançável. Todos os 275 testes passavam, porque nenhum
deles abria o app como uma pessoa abre.

**Correção:** entrar sem conta. O botão *Começar* entra direto.

> [!info] Por que sem conta é a resposta certa, e não um atalho
> O app inteiro funciona no aparelho: catálogo embutido, guarda-roupa local,
> algoritmo de estilo local. Nada disso precisa de servidor — então exigir
> cadastro seria pedir dado pessoal para entregar o que já funciona sem ele,
> o oposto do que o projeto promete ([[../06-seguranca]]).
>
> Quando o login existir ([#6](https://github.com/Lopesloro/App/issues/6)),
> esta porta continua: vira o "experimentar antes de criar conta", e a conta
> passa a servir para o que só servidor faz — sincronizar entre celulares.

## Problema 2 — o iPhone está bloqueado pela Apple

O Expo Go da App Store está travado no **SDK 54**; o projeto usa o **SDK 57**.
A Apple não aprova as submissões novas do Expo há meses. A App Store não
mostra atualização porque não existe atualização.

Não é erro do projeto nem do aparelho, e não tem contorno pelo Expo Go.

**Correção:** a plataforma web foi ligada como **janela de desenvolvimento**
(não como produto — [[../05-frontend]] segue valendo). `npm run web` abre o
app em segundos, sem instalar nada.

## O que foi testado

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ sem erro |
| `npx jest` | ✅ **280 testes**, 22 suítes |
| `npx expo lint` | ✅ 0 erros, 0 avisos |
| `npx expo export --platform web` | ✅ bundle de 2,9 MB |

### Teste de navegador de ponta a ponta

Primeiro teste do projeto que **abre o app e usa como uma pessoa usaria**
(Playwright + Chromium, viewport de celular).

| Passo | Resultado |
|---|---|
| Tela de boas-vindas aparece | ✅ |
| Botão *Começar* entra no app | ✅ |
| Catálogo lista as peças | ✅ |
| Busca por apelido (`rasteirinha`) | ✅ |
| Busca sem acento (`sandalia`) | ✅ |
| Marcar peça vai para o guarda-roupa | ✅ |
| Aba Guarda-roupa agrupa por categoria | ✅ |
| Aba Perfil mostra o estilo aprendido | ✅ |

**8 de 8.** Nenhum erro de JavaScript no console.

> [!tip] O que este teste pegou que os outros não pegavam
> Uma exceção que derrubava a tela do guarda-roupa na web:
> `ScreenCapture.preventScreenCaptureAsync is not available on web`. Nenhum
> teste unitário via isso, porque nenhum montava a tela de verdade.

### Confirmação visual

Com 1 peça marcada, a tela de Perfil mostrou:

- *"Estou começando a entender. Mais 7 peças e já consigo te dizer o seu estilo."*
- Régua com **Clássico** e **Minimalista**
- *"Baseado em 1 escolha sua · 13% de certeza"* — exatamente 1÷8, o valor de `INTERACOES_PARA_CONFIAR`
- *"Tudo isso é calculado no seu celular. Não enviamos seu estilo para lugar nenhum."*

O algoritmo se comporta como projetado, incluindo a recusa de afirmar um
estilo antes de ter base.

## Testes novos

| Teste | O que garante |
|---|---|
| Entrar sem conta abre o app sem token e sem cofre | Nenhuma credencial falsa é criada |
| A porta abre com conta **ou** sem conta | `podeUsarOApp` cobre os dois casos |
| Continua sem conta na próxima abertura | A escolha persiste |
| **Sem cofre disponível, quem entrou sem conta não é expulso** | O caso do navegador — sem isso, voltava à tela inicial a cada abertura |
| Apagar tudo devolve ao estado de quem nunca entrou | O botão faz o que diz |

## O que ainda não foi testado

- [ ] O app num **celular físico** — continua sendo o item nº 1. Depende da conta expo.dev ou de um Android
- [ ] Rolagem com o catálogo inteiro num Android de entrada
- [ ] Teste com 5 a 8 mulheres do público-alvo

Guia atualizado: [[../COMO-VER-O-APP]] · Índice: [[../00-INDEX]] · Checklist: [[../CHECKLIST]]
