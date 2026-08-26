---
title: Algoritmo de estilo — o que é e por quê
date: 2026-08-16
tags:
  - monta-looks
  - feature
  - algoritmo
  - estilo
  - privacidade
tipo: feature
status: pronta
---

# Algoritmo de estilo

## O que é

O app aprende o estilo da usuária **a partir do que ela marca**. Sem quiz, sem formulário, sem perguntar nada.

Ela procura roupas e vai marcando as que tem. Cada peça marcada é um voto nos atributos daquela peça: o estilo (clássico, boho, streetwear…), o caimento (justo, reto, solto, oversized), a ocasião (trabalho, festa, academia…), a categoria e a estação.

Depois de algumas peças, três coisas acontecem:

1. **A ordem do catálogo muda.** O que se parece com o que ela escolheu sobe.
2. **Aparece o motivo.** *"Combina com o clássico que você vem escolhendo."*
3. **O perfil fica visível.** Na aba Perfil, uma régua mostra cada estilo e o quanto ela puxa para ele.

## Como ele fala com a usuária

| Momento | O que o app diz |
|---|---|
| Recém-instalado | *"Ainda não sei nada sobre o seu estilo. Guarde algumas peças e eu começo a entender."* |
| 1 a 7 peças | *"Estou começando a entender. Mais 5 peças e já consigo te dizer o seu estilo."* |
| 8+ peças, com um estilo forte | *"Seu estilo puxa para o clássico com caimento reto."* |
| 8+ peças, sem estilo dominante | *"Você mistura bastante — não há um estilo que domine o seu guarda-roupa."* |

> [!important] O app fica calado quando não sabe
> Antes de oito interações, ele não afirma estilo nenhum e não dá motivo nenhum. Fingir conhecer alguém depois de dois toques é a forma mais rápida de perder a confiança da usuária — e ela nunca mais lê as sugestões.

## As quatro decisões que definem esse algoritmo

### 1. Roda no celular. Ponto.

Não existe servidor guardando "o que a Ana gosta de vestir", porque **não existe servidor**. A conta inteira acontece no aparelho.

O que isso dá, de graça:

- **Privacidade que é arquitetura, não promessa.** Não se vaza o que não se coleta. É o argumento que apps concorrentes com 7 milhões de usuárias não podem usar ([[../../09-mercado-sem-venda|análise de mercado]]).
- **Funciona offline.** No metrô, no avião, no aparelho sem plano de dados.
- **Instantâneo.** Zero espera de rede ao digitar.
- **Conformidade com a LGPD por construção.** Ver [[../../06-seguranca|06-seguranca]].

### 2. Aprende rápido, com pouca gente

Um recomendador clássico ("quem gosta disso também gostou daquilo") precisa de milhares de usuárias antes de acertar a primeira sugestão. Este app não tem milhares de usuárias — tem zero.

Este algoritmo não aprende sobre *"quem se parece com você"*. Aprende sobre *"o que **você** escolheu"*. Por isso funciona a partir da terceira peça, no primeiro dia, com uma única usuária.

### 3. Dá para explicar em português

Cada sugestão vira uma frase: *"Tem o clássico e o caimento reto que você vem escolhendo."*

Num app de moda isso não é enfeite. A usuária precisa entender **por que** a peça apareceu, senão a recomendação vira ruído. E quando não há motivo verdadeiro, o app não inventa um — inventar ensina a ignorar o texto.

### 4. Nunca passa na frente do que ela pediu

Se a usuária digita "camisa", ela recebe camisas — mesmo que o perfil diga que ela adora vestido boho. O gosto **desempata**, nunca **manda**.

Buscar é um pedido explícito. Perfil é palpite. Palpite não sobrepõe pedido.

> [!info] Isso é garantido por uma desigualdade no código
> O ajuste que o perfil pode aplicar (`AJUSTE_MAXIMO`) é sempre menor que o espaço entre dois níveis de relevância de texto (`PESO_TEXTO`). Há um teste automatizado verificando essa desigualdade — se alguém quebrar, o CI para.

## O gosto pode mudar

Quem passou o inverno guardando tricô e no verão começa a guardar linho vê o perfil acompanhar em algumas semanas.

Isso acontece porque, a cada peça marcada, os atributos **não** envolvidos encolhem um pouquinho. O app não guarda rancor da decisão de março.

## A usuária manda no que o app sabe

Na aba **Perfil**:

- ela vê quais estilos o app aprendeu, em régua, do maior para o menor;
- vê em quantas escolhas isso se baseia e o percentual de certeza;
- e tem o botão **"Recomeçar meu estilo"**, que apaga o perfil **e** o armário.

> [!warning] Por que o botão apaga as duas coisas
> Se apagasse só o perfil, o próximo toque no armário reconstruiria o mesmo perfil — e a usuária concluiria, com razão, que o botão mente.

## O que ainda falta

| Falta | Quando |
|---|---|
| Botão "não é pra mim" no catálogo | O sinal `descartou` já existe no código, falta o botão |
| Considerar clima e estação atual | Issue [#20](https://github.com/Lopesloro/App/issues/20) |
| Sugerir look montado, não só ordenar peças | Issue [#16](https://github.com/Lopesloro/App/issues/16) |
| Apontar o que falta no armário | Depende de o catálogo crescer |
| Perfil ir junto para outro celular | Precisa de servidor — e aí a decisão de privacidade tem que ser revista com cuidado |

Detalhes técnicos: [[como-funciona]] · Testes: [[testes]] · Voltar: [[../README|Features]]
