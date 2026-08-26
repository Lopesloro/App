---
title: Identidade visual — como funciona
date: 2026-08-26
tags:
  - monta-looks
  - feature
  - marca
  - decisoes
tipo: decisoes-tecnicas
status: ativo
---

# Identidade visual — as decisões

## Onde está no código

| Arquivo | O que faz |
|---|---|
| `src/components/marca/logo.tsx` | A marca, em SVG |
| `src/components/marca/brilho.tsx` | Gradiente radial reutilizável |
| `src/components/marca/fundo-aurora.tsx` | O fundo vivo das telas de entrada |
| `src/components/ui/icones.tsx` | Os três ícones das abas |
| `src/theme/tokens.ts` | `NEON_FUTURO` e o token `inkSobrePrimario` |
| `src/theme/temas.ts` | A terceira direção e a marca `escuro` |
| `src/app/(auth)/boas-vindas.tsx` | A tela de abertura |
| `src/app/+html.tsx` | O documento da web, para não haver flash branco |

---

## Decisão 1 — Brilho é gradiente radial, não `View` colorida

A tentativa óbvia — uma `View` circular com `backgroundColor` e opacidade baixa
— produz um **disco**, não um brilho: a borda é uma linha nítida, e o olho a lê
como forma sólida.

O primeiro desenho da tela de abertura tinha exatamente isso, e a captura de
tela deixou claro: era uma bola verde atrás da marca, não um halo.

Luz de verdade cai com a distância. `Brilho` é um `RadialGradient` em SVG, do
centro cheio até transparente na borda, com um passo intermediário — sem ele a
queda é linear e o resultado parece um cone.

**Descartado:** `shadowRadius` (iOS) e `elevation` (Android) desenham sombras
escuras atrás de caixas, não servem para halo colorido, e cada plataforma trata
de um jeito diferente.

## Decisão 2 — O token `inkSobrePrimario`

Não dá para deduzir a cor do texto que fica sobre o botão preenchido: no tema
claro o primário é escuro e pede texto branco; no escuro o primário é neon e
pede texto quase preto.

O código usava `surface` — que é branco nos temas claros e funcionava por
coincidência. No tema escuro `surface` continua claro, e o resultado era branco
sobre neon: ilegível.

Agora cada paleta declara essa cor, e há teste exigindo 4,5:1 nas três direções.

## Decisão 3 — Ícones desenhados, não uma família importada

Trazer Ionicons ou Lucide para usar três símbolos custa peso no pacote e uma
dependência a mais. E nenhuma dessas famílias tem um "guarda-roupa" que se
entenda.

Os três seguem as mesmas regras para parecerem parentes: caixa de 24×24, traço
de 1.8, pontas arredondadas, só contorno (preenchido brigaria com o neon), cor
vinda de fora.

Sem eles, o expo-router desenhava um marcador genérico — e três triângulos
iguais não dizem nada sobre para onde cada aba leva.

## Decisão 4 — A cor do cartão segue o tema

Cada peça deriva uma cor do próprio id, para ser reconhecível ao rolar. O
**matiz** é o mesmo nos dois casos; o que muda é a luz:

```
claro:   hsl(matiz, 34%, 86%)   → pastel
escuro:  hsl(matiz, 42%, 24%)   → tom fundo e saturado
```

Sem essa distinção, os pastéis claros iam para o tema escuro e viravam seis
retângulos brilhantes numa tela preta, puxando a atenção para longe do nome da
peça, que é o que importa.

## Decisão 5 — O documento da web também segue o tema

Dois problemas encontrados pelo teste de navegador, ambos invisíveis nos testes
unitários:

**a) O React Navigation tinha o próprio tema.** Ele pinta o fundo das telas e
das transições com o tema *dele*, não com o nosso — e usava o padrão claro
(`#F2F2F2`). Aparecia um retângulo cinza atrás do app escuro. A correção é uma
ponte: `temaDaNavegacao()` traduz a nossa paleta para o formato dele.

**b) A página nascia branca.** Entre o navegador carregar o HTML e o React
desenhar, quem manda na cor é o documento — e o intervalo era branco, um flash
violento antes de um app escuro. `src/app/+html.tsx` resolve, mas só é usado
com `web.output: 'static'`; com a saída padrão o Expo ignora o arquivo.

E um terceiro, que a correção de (b) criou: com o documento fixo em escuro,
escolher um tema claro deixaria bordas escuras em volta. Por isso o `_layout`
sincroniza `document.documentElement` com a paleta ativa.

> [!info] Nada disso roda no celular
> `+html.tsx` só existe na web, e a sincronização é protegida por
> `typeof document === 'undefined'`.

## Decisão 6 — Animação que se desliga sozinha

Toda animação passa por `useReducedMotion()`. Com a opção ligada no sistema, os
valores vão direto ao estado final: o visual continua, o movimento não.

As animações rodam por Reanimated, na thread de UI — não passam pelo JavaScript
a cada quadro, então não engasgam enquanto a busca filtra o catálogo.

---

## Limites conhecidos

| Limite | Consequência |
|---|---|
| Fonte do sistema | O visual perde personalidade tipográfica |
| Ícone e splash ainda são do scaffold | O PNG não combina com a marca nova |
| `output: 'static'` na web | Gera um HTML por rota; exige servidor que resolva URL limpa (ver `e2e/servidor.mjs`) |
| Nenhum teste mede desempenho da animação | Num Android de entrada pode engasgar — não medido |

O que é: [[o-que-e]] · Testes: [[testes]] · Voltar: [[../README|Features]]
