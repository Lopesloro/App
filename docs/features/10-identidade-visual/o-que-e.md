---
title: Identidade visual — o que é e por quê
date: 2026-08-26
tags:
  - monta-looks
  - feature
  - marca
  - design
tipo: feature
status: pronta
---

# Identidade visual

## O que é

O app ganhou cara própria: uma **marca**, um **visual futurista** e uma **tela
de abertura** que se apresenta em três segundos.

## A marca

Um cabide que também é um prisma.

O app pega o que a pessoa já tem e decompõe aquilo em estilo. Um prisma faz
exatamente isso com a luz: entra uma coisa só, saem as componentes dela.

Por isso o desenho tem **duas leituras**:

- de relance, no tamanho de um ícone, é um **cabide** — ninguém precisa
  decifrar nada para saber que o assunto é roupa;
- de perto, o corpo é um **prisma**, e da base saem três feixes: as três
  dimensões que o algoritmo aprende (estilo, caimento, ocasião).

> [!info] Por que vetor desenhado à mão
> O mesmo arquivo serve para o ícone de 16px e para a tela cheia, sem borrar e
> sem exportar dez tamanhos. As cores vêm da paleta ativa, então a marca
> acompanha a troca de visual em vez de destoar dela. E não há imagem para
> baixar — nada externo que possa falhar.

## O visual futurista

Uma terceira direção, chamada **Neon Futuro**, que passou a ser o padrão.

As duas primeiras eram claras e editoriais — nasceram da ideia de que o app
seria uma revista de moda. Esta parte de outro lugar: o app não mostra roupa
dos outros, ele **lê** o guarda-roupa de quem usa e devolve um diagnóstico.
Isso é instrumento, não revista. E instrumento tem tela escura, leitura em neon
e informação brilhando sobre fundo calmo.

| | Neon Futuro | Editorial Areia | Vinho Moderno |
|---|---|---|---|
| Fundo | Quase preto azulado | Areia clara | Rosé claro |
| Destaque | Verde-água neon | Terracota | Burgundy |
| Sensação | Instrumento | Revista | Vitrine |

As três continuam disponíveis em **Perfil → Visual**. A escolha definitiva só
acontece depois do teste com usuárias.

> [!success] Ganho prático, além do gosto
> Fundo escuro gasta menos bateria em tela OLED (a maioria dos celulares do
> público-alvo) e cansa menos a vista à noite — que é quando se decide a roupa
> do dia seguinte.

## Acessibilidade não foi sacrificada pelo estilo

Neon em fundo escuro é fácil de errar. **Todos os pares de cor foram medidos**
contra o critério WCAG AA, e há teste automatizado travando isso:

| Par | Contraste | Mínimo |
|---|---|---|
| Texto principal sobre o fundo | 17,3:1 | 4,5:1 |
| Texto suave sobre o fundo | 7,9:1 | 4,5:1 |
| Texto sobre o botão neon | 11,6:1 | 4,5:1 |
| Cor de erro sobre o fundo | 7,2:1 | 3:1 |

> [!warning] Um erro que o tema escuro revelou
> O texto sobre o botão preenchido usava a cor de "superfície" — branco. No
> tema claro funcionava; no escuro virava **branco sobre neon claro**,
> ilegível. Agora cada paleta declara sua própria cor de texto sobre o
> primário, e há teste garantindo os 4,5:1 nas três direções.

## A tela de abertura

O único momento em que o app tem a atenção inteira de quem chegou.

- **Um fundo vivo:** duas manchas de luz que respiram devagar. Movimento lento
  é a forma mais barata de dizer "isto aqui é vivo" sem escrever nada.
- **A marca entra primeiro**, sozinha, com um brilho que pulsa. Depois o texto.
  Depois os botões. É a ordem em que a pessoa precisa entender as coisas: quem
  é você, o que você faz, o que eu faço agora.
- **Um selo de privacidade** logo abaixo do texto: *"Roda no seu celular ·
  nada sai daqui"*. É o diferencial do produto, e ele aparece antes do botão.
- **"Começar" entra direto**, sem cadastro.

> [!info] Quem pediu menos movimento, recebe menos movimento
> Com "reduzir movimento" ligado no sistema, tudo fica parado na posição final
> — o visual continua, a animação não. Movimento contínuo causa enjoo e dor de
> cabeça em quem tem sensibilidade vestibular, e o sistema já sabe quem são
> essas pessoas.

## O login parou de mentir

Antes, o botão "Continuar" validava e-mail e senha e **não fazia mais nada** —
a pessoa ficava presa sem entender por quê. Não existe servidor de contas.

Agora a tela **admite** isso e oferece a porta que funciona:

> *"Os dados estão certos, mas o servidor de contas ainda não existe. Entre sem
> conta — o app funciona inteiro assim."*

Uma tela que finge que vai funcionar é pior do que uma que explica por que não vai.

O medidor de força da senha também mudou: em vez da palavra "média", são três
barras que se entendem de relance — com o rótulo preservado para leitor de tela.

## O que ainda falta

| Falta | Quando |
|---|---|
| Fontes próprias embarcadas | Hoje usa a fonte do sistema |
| Ícone do app e splash definitivos | Os arquivos PNG ainda são os do scaffold |
| Nome definitivo da marca | Bloco 1 de [[../../CHECKLIST\|CHECKLIST]] |
| Teste do visual no sol, num celular real | Depende de ver o app num aparelho |

Detalhes: [[como-funciona]] · Testes: [[testes]] · Voltar: [[../README|Features]]
