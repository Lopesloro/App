---
title: Dois visuais — como funciona por dentro
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - design
  - decisoes
tipo: decisao-tecnica
status: ativo
---

# Dois visuais — como funciona

## As peças

| Arquivo | O que faz |
|---|---|
| `src/theme/tokens.ts` | As duas paletas de cor e a escala de espaçamento |
| `src/theme/temas.ts` | Junta paleta + arredondamento de canto em cada visual |
| `src/theme/tema-store.ts` | Qual visual está ativo, e o `usePaleta()` que as telas usam |
| `src/app/escolher-visual.tsx` | A tela de escolha, com prévia |

## Decisão 1 — Cor vem do tema, layout fica fixo

**O que fizemos:** cada tela monta seus estilos com uma função que recebe a paleta. Espaçamento e tamanho continuam fixos; só a cor muda.

**Por quê:** recalcular tudo a cada mudança seria desperdício, e as duas direções compartilham a mesma estrutura — o que muda é a cor e a "dureza" do canto. Assim a troca é instantânea e o layout não dança.

## Decisão 2 — Cada visual tem seu arredondamento

**O que fizemos:** o Editorial Areia usa cantos de 16px em cartões; o Vinho Moderno, 10px.

**Por quê:** direção estética não é só cor. Canto arredondado passa suavidade; canto mais reto passa recorte gráfico, de vitrine. Se só a cor mudasse, as duas pareceriam o mesmo app pintado diferente — e o teste com usuárias não teria o que comparar.

## Decisão 3 — Prévia mostra um cartão, não uma bolinha

**O que fizemos:** a tela de escolha desenha uma miniatura de cartão de look com as cores da direção.

**Por quê:** ver quatro bolinhas coloridas não diz como o app vai parecer. Ver a foto, o texto e o botão nas proporções reais, sim. Como a decisão é justamente estética, a prévia precisa ser honesta.

## Decisão 4 — Escolha inválida volta ao padrão

**O que fizemos:** se o visual salvo não existir mais (versão antiga, arquivo adulterado), o app volta ao padrão.

**Por quê:** quando uma direção for descartada, celulares com ela salva não podem ficar sem paleta — seria tela em branco. Coberto por teste.

## Decisão 5 — Cor de texto sobre fundo colorido é um tom nomeado

**O que fizemos:** o texto do botão primário usa o tom `sobreDestaque`, não "branco".

**Por quê:** se fosse branco fixo, uma direção futura com botão claro teria texto branco sobre fundo claro — ilegível. O tom nomeado deixa cada paleta responder o que usar ali.

## Decisão 6 — App só de celular

**O que fizemos:** removemos a plataforma web de `app.config.ts`.

**Por quê:** decisão já registrada em [[../../05-frontend|05-frontend]] — a web não sustenta assinatura pelas lojas nem câmera decente no iPhone. Manter ligada custaria manutenção de algo que não seria usado.

Voltar: [[o-que-e]] · Testes: [[testes]]
