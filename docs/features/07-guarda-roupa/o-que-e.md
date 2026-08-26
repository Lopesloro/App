---
title: Guarda-roupa — o que é e por quê
date: 2026-08-16
tags:
  - monta-looks
  - feature
  - guarda-roupa
tipo: feature
status: pronta
---

# Guarda-roupa

## O que é

A aba **Guarda-roupa** mostra as peças que a usuária marcou, organizadas por categoria — na ordem em que se veste o corpo: parte de cima, parte de baixo, vestidos, casacos, calçados, bolsas, acessórios.

No topo, uma frase do algoritmo: *"Seu estilo puxa para o clássico com caimento reto."* E logo abaixo, em letra menor: *"Isso é calculado no seu celular e não sai daqui."*

Com o armário vazio, a tela não fica em branco — ela diz o que fazer e leva para a aba de busca.

O que foi marcado **continua lá quando o app fecha e abre**.

## Por que essa feature existe

### É o destino de tudo o que o app faz

Marcar peça sem ter onde vê-las juntas seria colecionar no vazio. O guarda-roupa é onde as escolhas viram alguma coisa: a pessoa abre e vê, pela primeira vez organizado, **o que ela tem**.

### É o que faz o app valer a segunda visita

Um app que a usuária abre uma vez e esquece não vale espaço no celular. Quando ela marcou 20 peças, o app deixa de ser "um lugar de procurar roupa" e vira **o lugar onde o armário dela mora**.

### É o dado que ensina o algoritmo

Cada peça marcada é um voto. O guarda-roupa não é só uma lista bonita — é literalmente a base de tudo o que o app aprende sobre estilo. Ver [[../08-algoritmo-de-estilo/o-que-e|Algoritmo de estilo]].

## Sem limite, e isso é uma decisão

Não há teto de peças. Nem 20, nem 100.

O modelo antigo tinha limite por plano — era assim que se convertia assinatura. Como **nada está à venda** ([[../../09-mercado-sem-venda|decisão do fundador]]), cobrar limite de quem não tem como pagar para sair dele só serviria para a usuária perder o que montou.

O código do limite continua no repositório, testado, para quando a assinatura voltar. Ver [[../09-sem-monetizacao/o-que-e|Sem monetização]].

## Uma proteção que já está lá, antes de precisar

A tela **bloqueia captura de tela no Android** desde já — mesmo sem ter nenhuma foto pessoal ainda.

Parece exagero, e é de propósito: quando a usuária puder fotografar as próprias peças ([#11](https://github.com/Lopesloro/App/issues/11)), o controle já vai estar lá. Segurança que se "lembra de adicionar depois" é segurança que se esquece.

> [!info] O que esse bloqueio faz e o que não faz
> No Android o bloqueio é real. No iOS o sistema não permite impedir captura — o app só é avisado. Então isso reduz risco casual e **não substitui** as barreiras de verdade: URL de foto que expira ([#37](https://github.com/Lopesloro/App/issues/37)) e autorização no servidor. Ver [[../../06-seguranca|06-seguranca]].

## Sair da conta apaga tudo

Quando a usuária sai, o guarda-roupa some do aparelho — o arquivo e a memória. O mesmo vale para o perfil de estilo.

Um celular passa de mão em mão. Se sair limpasse só a senha, a próxima pessoa herdaria o armário e as recomendações de quem usou antes.

## O que ainda falta

| Falta | Quando |
|---|---|
| O armário ir junto para outro celular | Precisa de conta e servidor ([#6](https://github.com/Lopesloro/App/issues/6)) |
| Fotografar a peça de verdade | Issue [#11](https://github.com/Lopesloro/App/issues/11) |
| Montar look com o que está no armário | Issue [#16](https://github.com/Lopesloro/App/issues/16) |
| Marcar cor e quantidade de cada peça | Depois da foto |
| Ver o que está faltando no armário | Depende de o catálogo ter mais peças |

> [!warning] Hoje o armário fica só neste celular
> Trocar de aparelho ou desinstalar o app apaga tudo. Só se resolve com conta e servidor — bloco 3 de [[../../CHECKLIST|CHECKLIST]].

Detalhes: [[como-funciona]] · Testes: [[testes]] · Voltar: [[../README|Features]]
