---
title: Como ver o app rodando
date: 2026-08-12
tags:
  - monta-looks
  - guia
tipo: guia
status: ativo
---

# Como ver o app rodando

Dá para ver o app **hoje**, no seu celular, sem instalar nada além de um aplicativo grátis e sem pagar nada.

> [!warning] No iPhone, NÃO use a câmera para ler o QR
> O QR desenhado no terminal do Windows quase sempre sai deformado, e a câmera responde "nenhum arquivo encontrado". **Digite o endereço direto no Expo Go** — é o caminho abaixo, e funciona sempre.

## Passo a passo (iPhone)

### 1. No iPhone

- Instale o **Expo Go** pela App Store (grátis, não precisa criar conta)
- **Abra o Expo Go pelo menos uma vez** antes de continuar

### 2. No computador

```bash
cd C:\Users\betem\Documents\App
npx expo start --go
```

Espere aparecer `Waiting on http://localhost:8081`. Deixe essa janela aberta.

### 3. De volta ao iPhone

- Abra o **Expo Go**
- Na aba **Home**, procure o campo **"Enter URL manually"** (ou o ícone de link)
- Digite exatamente:

```
exp://192.168.0.103:8081
```

- Toque em **Connect**

O app começa a baixar e abre. Da segunda vez em diante ele fica na lista de "Recently opened", então é só tocar.

> [!info] Esse endereço pode mudar
> `192.168.0.103` é o endereço do seu computador na rede de casa. Se você trocar de Wi-Fi ou reiniciar o roteador, ele pode mudar. Para descobrir o atual, rode `ipconfig` no computador e procure "Endereço IPv4".

## Se não conectar

Tente nesta ordem:

### 1. Confirme que iPhone e computador estão na mesma rede

Redes de convidados e a "rede 5GHz" separada não conversam com a principal em alguns roteadores.

### 2. Permita "Rede local" para o Expo Go

Esta é a causa mais comum no iPhone e é silenciosa:

**Ajustes → Expo Go → Rede local** → ligar

O iOS pede essa permissão uma vez. Se você negou sem querer, o Expo Go não consegue achar o computador e nunca avisa o motivo.

### 3. Use o túnel (funciona até em redes diferentes)

Se houver VPN, firewall ou redes separadas, o túnel resolve — ele não depende da rede local:

```bash
npx expo start --go --tunnel
```

Ele mostra um endereço diferente, começando com `exp://` e terminando em `.exp.direct`. Digite **esse** endereço no Expo Go. É mais lento para carregar, mas funciona.

> [!tip] Você tem um endereço de VPN ativo
> Detectei um IP da faixa da AWS (`54.232.189.113`) no seu computador junto com o IP local. Se for VPN, ela pode estar atrapalhando a conexão pela rede local — nesse caso vá direto para o túnel.

### 4. Firewall do Windows

Na primeira vez que o servidor sobe, o Windows pergunta se libera o acesso. Se você clicou em "Cancelar", libere em:

**Configurações → Rede e Internet → Firewall → Permitir um aplicativo** → procure `Node.js`

## Passo a passo (Android)

Mais simples: abra o **Expo Go** e toque em **"Scan QR code"** — o leitor de dentro do app funciona bem com o QR do terminal. Se preferir, o mesmo endereço manual também funciona.

## O que dá para fazer nessa versão

- Rolar o feed de looks e filtrar por ocasião
- Abrir um look e ver as peças com marca e preço
- Tocar em "Ver na loja" (abre um site de exemplo)
- Salvar looks no coração e ver na aba Salvos
- Chegar no limite de 10 looks e ver o convite para assinar
- **Trocar entre os dois visuais** em Perfil → Visual

## O que ainda **não** funciona

| Não funciona | Por quê |
|---|---|
| Fotos dos looks | Aparece um bloco de cor — a curadoria ainda não publicou imagem |
| Login | Não existe servidor |
| Fotografar peça do closet | Não existe servidor |
| Assinar de verdade | Cobrança não está ligada |

## Emulador no computador

**Não dá hoje.** Precisaria do Android Studio (cerca de 10 GB) e o disco está em 98%. Fora que ver no celular de verdade é melhor: emulador não mostra como a cor se comporta no sol nem como o app cai na mão.

## Depois: build instalável

Quando você criar a conta no [expo.dev](https://expo.dev) e adicionar o `EXPO_TOKEN` no GitHub, cada mudança na branch principal gera um instalador. Aí o app fica no celular como aplicativo de verdade, sem Expo Go e sem o computador ligado.

Ver [[CHECKLIST]], Bloco 1.

## Erros comuns

| O que aparece | O que fazer |
|---|---|
| Câmera: "nenhum arquivo encontrado" | Não use a câmera — digite o endereço no Expo Go |
| Expo Go fica carregando para sempre | Permissão de Rede local (passo 2) ou use o túnel |
| "Could not connect to server" | Servidor não está rodando, ou endereço errado — confira o `ipconfig` |
| Tela branca | Balance o aparelho → "Reload" |
| "Port 8081 is being used" | Já tem um servidor rodando; feche a outra janela ou use `--port 8082` |

Voltar: [[CHECKLIST]] · [[00-INDEX]]
