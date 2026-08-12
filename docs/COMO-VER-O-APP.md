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

Dá para ver o app **hoje**, no seu celular, sem instalar nada no computador e sem pagar nada.

## Jeito 1 — No seu celular com Expo Go (recomendado)

Funciona agora. É o app de verdade, rodando no aparelho.

**No celular:**
1. Instale o **Expo Go** (App Store ou Play Store) — é grátis
2. Não precisa criar conta

**No computador:**
```bash
cd C:\Users\betem\Documents\App
npx expo start --go
```

Vai aparecer um **QR code** no terminal.

**De volta ao celular:**
- **Android:** abra o Expo Go e toque em "Scan QR code"
- **iPhone:** abra a câmera normal e aponte para o QR

O app abre no seu celular. Toda vez que o código mudar, ele atualiza sozinho.

> [!important] Celular e computador na mesma rede Wi-Fi
> Se não conectar, é quase sempre isso. Alternativa: rode `npx expo start --go --tunnel` (mais lento, mas funciona em redes diferentes).

### O que dá para fazer nessa versão

- Rolar o feed de looks e usar os filtros por ocasião
- Abrir um look e ver as peças com marca e preço
- Tocar em "Ver na loja" (abre um site de exemplo)
- Salvar looks no coração e ver na aba Salvos
- Chegar no limite de 10 looks e ver o convite para assinar
- **Trocar entre os dois visuais** em Perfil → Visual

### O que **não** funciona ainda

| Não funciona | Por quê |
|---|---|
| Fotos dos looks | Aparece um borrão colorido — a curadoria ainda não publicou imagem |
| Login | Não existe servidor |
| Fotografar peça do closet | Não existe servidor |
| Assinar de verdade | Cobrança não está ligada |

## Jeito 2 — Emulador no computador

**Não dá hoje.** Precisaria instalar o Android Studio (cerca de 10 GB) e o disco está em 98%. Além disso, ver no celular de verdade é melhor: o emulador não mostra como a cor se comporta no sol nem como o app parece na mão.

## Jeito 3 — Build instalável (depois da conta Expo)

Quando você criar a conta no [expo.dev](https://expo.dev) e adicionar o `EXPO_TOKEN` no GitHub, cada mudança na branch principal gera um instalador automaticamente. Aí o app fica no celular como aplicativo de verdade, sem precisar do Expo Go e sem o computador ligado.

Ver [[CHECKLIST]], Bloco 1.

## Se der erro

| Erro | O que fazer |
|---|---|
| "Metro bundler não inicia" | Rode `npm install` na pasta do projeto |
| QR não conecta | Confirme o mesmo Wi-Fi, ou use `--tunnel` |
| Tela branca no celular | Balance o aparelho → "Reload" |
| "Something went wrong" | Olhe a mensagem no terminal do computador |

Voltar: [[CHECKLIST]] · [[00-INDEX]]
