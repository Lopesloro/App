---
title: Como ver o app rodando
date: 2026-08-17
tags:
  - monta-looks
  - guia
tipo: guia
status: ativo
---

# Como ver o app rodando

> [!important] O jeito mais rápido: o navegador
> ```bash
> npm install
> npm run web
> ```
> Abre em `http://localhost:8081`. Sem instalar nada, sem celular, sem conta.
> Funciona em qualquer computador.

---

## Por que o iPhone ficou difícil

Antes de perder tempo tentando, entenda o problema — ele não é seu.

**O Expo Go da App Store está travado no SDK 54.** A Apple não aprova as
submissões novas do Expo há meses, e este projeto usa o **SDK 57**. Ao tentar
abrir, o iPhone responde:

> *Project is incompatible with this version of Expo Go*

E a App Store **não oferece atualização**, porque não existe atualização para
oferecer. Nenhuma tentativa por esse caminho vai funcionar.

Fonte: [Expo Go and the App Store — changelog oficial](https://expo.dev/changelog/expo-go-and-app-store-may-2026).

## As quatro formas de ver o app

| Forma | Custo | Serve para |
|---|---|---|
| **Navegador** (`npm run web`) | Grátis, imediato | ✅ Ver a lógica funcionando hoje |
| **Android + Expo Go** | Grátis | ✅ Sensação real de celular |
| **Simulador do iPhone** | Grátis, ~10 GB de disco (Xcode) | Ver no formato iPhone |
| **iPhone de verdade** (`eas go`) | **US$ 99/ano** (conta Apple) | Testar cor no sol, peso na mão |

---

## 1. Navegador (recomendado para começar)

```bash
cd caminho/para/App
npm install
npm run web
```

Abre sozinho no navegador. Se não abrir, vá em `http://localhost:8081`.

Para ver como fica no celular: aperte **F12**, clique no ícone de celular
(*Toggle device toolbar*) e escolha um iPhone na lista.

> [!info] A web é janela, não é o produto
> O produto continua sendo aplicativo de celular — [[05-frontend]] descartou o
> PWA como produto principal, e isso não mudou. A web existe aqui para
> **desenvolver e demonstrar**, e porque hoje ela é o único caminho gratuito e
> instantâneo.
>
> O que não funciona na web, de propósito: o cofre de credenciais (navegador
> não tem Keychain) e o bloqueio de captura de tela. Nada disso é usado no
> app atual, que funciona sem conta.

## 2. Android com Expo Go

```bash
npm install
npx expo start --go
```

No celular, abra o **Expo Go** e toque em **"Scan QR code"** — o leitor de
dentro do app lê bem o QR do terminal.

Se houver VPN, firewall ou redes separadas, use o túnel:

```bash
npx expo start --go --tunnel
```

Ele mostra um endereço terminado em `.exp.direct`. Digite esse no Expo Go.

## 3. Simulador do iPhone (Mac)

Precisa do **Xcode** (App Store do Mac, grátis, cerca de 10 GB).

1. Instale o Xcode e abra uma vez para aceitar os termos
2. `npx expo start --go`
3. Aperte a tecla **`i`**

O Expo instala a versão certa do Expo Go direto no simulador, sem passar pela
App Store — por isso funciona com o SDK 57.

## 4. iPhone de verdade

Só com `eas go`, que gera o **seu próprio** Expo Go e o distribui pelo
TestFlight. Exige conta de desenvolvedor Apple (US$ 99/ano) — regra da Apple,
não do Expo.

Depende da conta no [expo.dev](https://expo.dev), Bloco 1 de [[CHECKLIST]].

---

## O que dá para fazer nesta versão

O app abre **sem cadastro**: toque em **Começar** e você já está dentro. Não
há servidor, e tudo funciona no próprio aparelho.

**Aba Roupas**
- Procure `camisa`, `saia`, `tênis` — a lista muda enquanto você digita
- Procure sem acento: `sandalia`, `trico`, `oculos`
- Procure pelo apelido: `rasteirinha`, `ciganinha`, `hoodie`, `jumpsuit`, `crossbody`
- Procure pela sensação: `boho`, `festa`, `academia`
- Filtre pelos chips de categoria
- **Toque no cartão** para guardar a peça

**Aba Guarda-roupa**
- As peças aparecem agrupadas por categoria, de cima para baixo do corpo
- No topo, o resumo do que o algoritmo aprendeu

**Aba Perfil**
- A régua dos estilos, quantas escolhas isso representa e o percentual de certeza
- Troque entre os dois visuais
- Apague tudo num toque

> [!tip] Como ver o algoritmo funcionando
> Marque **8 peças do mesmo estilo** — por exemplo: camisa social, scarpin,
> blazer de alfaiataria, mocassim, trench coat, relógio clássico, lenço de
> seda e calça de alfaiataria.
>
> Antes de 8 escolhas o app diz *"Estou começando a entender"* e não afirma
> nada. Depois, ele fala: *"Seu estilo puxa para o clássico."* Isso é
> proposital — fingir que conhece alguém em dois toques é o jeito mais rápido
> de perder a confiança de quem usa ([[features/08-algoritmo-de-estilo/o-que-e|por quê]]).

## O que ainda **não** funciona

| Não funciona | Por quê |
|---|---|
| Foto das peças | Cada peça é um bloco de cor; depende de curadoria ([#22](https://github.com/Lopesloro/App/issues/22)) |
| Fotografar a sua roupa | Precisa de servidor ([#11](https://github.com/Lopesloro/App/issues/11)) |
| Levar o guarda-roupa para outro celular | Precisa de conta e servidor ([#6](https://github.com/Lopesloro/App/issues/6)) |
| Comprar qualquer coisa | Desligado por decisão do fundador ([[09-mercado-sem-venda]]) |

## Erros comuns

| O que aparece | O que fazer |
|---|---|
| *"Project is incompatible with this version of Expo Go"* | É o SDK 54 da App Store. Use o navegador, Android ou simulador |
| App Store não mostra "Atualizar" no Expo Go | Mesma causa. Não há atualização a instalar |
| Câmera do iPhone: "nenhum arquivo encontrado" | Não use a câmera — digite o endereço dentro do Expo Go |
| Expo Go carregando para sempre (Android) | Ajustes de rede local, ou use `--tunnel` |
| `Port 8081 is being used` | Já há um servidor rodando; feche a outra janela ou use `--port 8082` |
| Tela branca | Recarregue a página (web) ou balance o aparelho → **Reload** |

## Depois: build instalável

Quando você criar a conta no [expo.dev](https://expo.dev) e adicionar o
`EXPO_TOKEN` no GitHub, cada mudança na branch principal gera um instalador —
e o app fica no celular como aplicativo de verdade, sem Expo Go e sem o
computador ligado.

Ver [[CHECKLIST]], Bloco 1.

Voltar: [[CHECKLIST]] · [[00-INDEX]]
