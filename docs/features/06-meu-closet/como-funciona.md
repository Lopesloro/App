---
title: Meu closet — como funciona por dentro
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - closet
  - decisoes
tipo: decisao-tecnica
status: ativo
---

# Meu closet — como funciona

## As peças

| Arquivo | O que faz |
|---|---|
| `src/features/closet/tipos.ts` | Categorias, cores, tamanhos e onde cada peça entra no look |
| `src/features/closet/catalogo.ts` | As 46 peças prontas |
| `src/features/closet/captura.ts` | Câmera e galeria, com as regras de privacidade |
| `src/features/closet/closet-store.ts` | O closet salvo no aparelho |
| `src/components/closet/ilustracao-peca.tsx` | O desenho de cada peça |
| `src/components/look/ilustracao-look.tsx` | Compõe o look a partir das peças |
| `src/app/(tabs)/closet.tsx` | A aba |
| `src/app/closet/adicionar.tsx` | Adicionar (lista pronta ou foto) |
| `src/app/closet/[id].tsx` | Detalhe da peça |

## Decisão 1 — Localização removida da foto na origem

**O que fizemos:** a captura usa `exif: false`.

**Por quê:** toda foto de celular carrega latitude, longitude, modelo do aparelho e data. Foto de roupa tirada no quarto levaria **o endereço da usuária** junto. Removemos onde a foto nasce, não depois — assim não existe janela em que o dado sensível exista.

## Decisão 2 — Escala de tamanho muda por tipo de peça

**O que fizemos:** blusa oferece P/M/G; calça oferece 36–48; sapato 33–41; bolsa é "Único".

**Por quê:** oferecer "M" para um sapato ou "38" para um colar faria a usuária desconfiar do app inteiro. Detalhe pequeno que sinaliza se quem fez entende de roupa.

## Decisão 3 — Peças desenhadas, não fotografadas

**O que fizemos:** silhuetas vetoriais por categoria e cor.

**Por quê:** foto de catálogo precisa de licença de cada marca (não temos contrato), e link para imagem externa quebra sem aviso quando o site sai do ar. Vetor é offline, leve e nítido em qualquer tela.

**Consequência boa:** o mesmo traço serve o closet e o feed. O app **compõe o look** empilhando as peças por parte do corpo. Vestido e macacão ocupam o corpo todo, então nesses casos não há "peça de baixo" — a composição sabe disso.

## Decisão 4 — Guardar só o caminho local da foto

**O que fizemos:** a peça guarda o caminho do arquivo no aparelho.

**Por quê:** não existe servidor. Inventar upload agora seria criar a superfície de risco antes de ter as proteções de `docs/06-seguranca.md`. Tem teste conferindo que nada gravado contém `http`.

## Decisão 5 — Peça corrompida não derruba o closet

**O que fizemos:** ao restaurar, cada peça é validada individualmente; as inválidas são descartadas e as boas ficam.

**Por quê:** se validássemos a lista inteira de uma vez, uma peça corrompida apagaria o closet todo da usuária. Perder uma peça é ruim; perder trinta é imperdoável.

## Decisão 6 — Módulo neutro para schemas compartilhados

**O que fizemos:** `src/lib/schemas-comuns.ts` guarda o id seguro e a URL segura. O feed e o closet importam dali.

**Por quê:** o feed precisa da taxonomia do closet, e o closet precisa do id seguro que estava no feed — isso criou uma **importação circular**. Em teste passava despercebido; ao abrir o app de verdade, quebrava com "Cannot access before initialization" e a tela não subia.

> [!info] Achado por rodar, não por testar
> Os 174 testes passavam com o ciclo no lugar. Só apareceu ao abrir o app no navegador. É um lembrete de que teste automatizado não substitui abrir o produto.

## Decisão 7 — O coração saiu de dentro do cartão

**O que fizemos:** o coração de salvar agora é irmão do cartão, não filho.

**Por quê:** botão dentro de botão é HTML inválido na web e, no celular, faz o leitor de tela anunciar "botão, dentro de botão" — a usuária cega não descobre que são duas ações. Também apareceu só ao rodar.

## Decisão 8 — Fim da parte de venda

**O que fizemos:** removemos o link de compra, a marca e o preço das peças do look.

**Por quê:** decisão do fundador — nada será vendido por enquanto. Mostrar preço e "ver na loja" prometeria uma compra que não existe. No lugar entrou informação que serve de verdade: tipo da peça e tamanho. Tem teste travando: se alguém reintroduzir `precoCentavos` ou `urlLoja` na peça, o CI quebra.

Voltar: [[o-que-e]] · Testes: [[testes]]
