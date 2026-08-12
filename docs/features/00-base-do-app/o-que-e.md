---
title: Base do app — o que é e por quê
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - base
  - seguranca
tipo: feature
status: pronta
---

# Base do app

## O que é

É a fundação onde todo o resto se apoia. Não é uma tela que a usuária vê como "funcionalidade" — é o alicerce.

Inclui:

- **As telas e a navegação** — boas-vindas, login, as 4 abas de baixo (Looks, Explorar, Closet, Perfil) e a tela de planos
- **As cores e letras** do app, definidas num lugar só
- **O cofre** que guarda a senha/token da usuária
- **O jeito de conversar com o servidor**
- **O bloqueio de print de tela** nas telas com foto pessoal

## Por que essa feature existe

Porque tudo que vem depois depende dela. Se o cofre da senha estiver errado, não adianta o feed ser bonito — o app vaza dado de mulher.

E tem uma razão de custo: **decidir cor, letra e espaçamento num arquivo só** significa que trocar a cara do app depois é mexer em um lugar, não em 40 telas. As duas direções visuais ("Editorial Areia" e "Vinho Moderno") estão prontas ali; escolher uma é trocar uma palavra.

## As decisões de segurança, em português claro

### Onde a senha da usuária fica guardada

No **cofre do celular** (Keychain no iPhone, Keystore no Android) — o mesmo lugar onde o banco guarda a sua. Não fica no armazenamento comum do app.

Além disso, configuramos duas coisas:

1. **Só abre com o celular desbloqueado.** Se alguém pegar o aparelho travado, não acessa.
2. **Não vai junto no backup.** Se a usuária fizer backup do celular e restaurar em outro aparelho, o token não vai junto. Assim um backup vazado não entrega a conta dela.

### O token nunca fica "solto" na memória

O app guarda o nome e o plano da usuária na memória, mas **nunca o token**. Toda vez que precisa falar com o servidor, ele busca no cofre.

**Por quê:** relatório de erro (quando o app trava, ele manda um relatório pra gente) costuma levar junto tudo que estava na memória. Se o token estivesse lá, ele apareceria nesses relatórios. Do jeito que fizemos, não aparece.

### Se o servidor disser "essa senha não vale mais"

O app **apaga a credencial na hora** e manda a usuária pro login, em vez de ficar tentando de novo com uma senha inválida.

**Por quê:** insistir com credencial recusada é o comportamento que dispara alarme de invasão e trava a conta da usuária de verdade.

### Print de tela bloqueado no closet

A tela do closet (onde vão ficar as fotos das roupas dela) **bloqueia print**.

> [!warning] Limite honesto disso
> No Android o bloqueio funciona de verdade. **No iPhone, não dá pra impedir print** — a Apple não permite. Então isso é uma camada a mais, não a proteção principal. A proteção de verdade é: a foto fica num endereço secreto que expira em 15 minutos e o servidor confere se é você antes de entregar.

## O preço travado por teste

Os três planos — Grátis, R$ 19,90 e R$ 24,90 — estão num arquivo só, e existe um **teste que trava esses valores**.

**Por quê:** se alguém (ou alguma IA) mexer nos preços sem querer num refactor, o teste quebra e o código não entra. É uma trava contra acidente, e reflete que os preços são decisão sua.

## O que essa base **não** faz ainda

- **Login não funciona de verdade.** A tela valida o e-mail e a senha, mas não tem servidor pra conversar. Falta [#6](https://github.com/Lopesloro/App/issues/6) e [#7](https://github.com/Lopesloro/App/issues/7).
- **Nenhuma foto é guardada ainda.** A segurança está pronta esperando as fotos chegarem.
- **Assinatura não cobra.** A tela mostra os planos, mas não tem cobrança — falta [#30](https://github.com/Lopesloro/App/issues/30).

Detalhes: [[como-funciona]] · Testes: [[testes]] · Voltar: [[../README|Features]]
