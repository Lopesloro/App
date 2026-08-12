---
title: Feed de indicações — testes
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - feed
  - testes
tipo: registro-de-teste
status: aprovado
---

# Feed de indicações — testes

| Campo | Valor |
|---|---|
| Data | 2026-08-12 |
| Executor | Equipe de desenvolvimento |
| Escopo | Feed de indicações (issue [#21](https://github.com/Lopesloro/App/issues/21)) |
| Resultado | ✅ 21 testes novos, todos passando (52 no projeto) |

## O que cada teste garante

### A lista carrega em partes (paginação)

| Teste | O que garante na prática |
|---|---|
| Primeira página vem com 4 looks | A tela abre rápido, sem baixar tudo de uma vez |
| Aponta onde continuar | O "carregar mais" sabe de onde seguir |
| Última página encerra | A tela para de pedir mais quando acaba — não fica rodando pra sempre |
| Percorrer tudo não repete look | A usuária não vê o mesmo look duas vezes ao rolar |

### Os filtros funcionam

| Teste | O que garante na prática |
|---|---|
| Filtrar por "trabalho" só traz look de trabalho | O botão de filtro faz o que promete |
| A contagem respeita o filtro | Não diz "8 looks" quando só há 2 daquela ocasião |
| Filtro sem resultado não quebra | Aparece "nenhum look ainda" em vez de tela branca |

### Os dados estão íntegros

| Teste | O que garante na prática |
|---|---|
| Toda página passa na conferência de formato | Dado torto vira erro claro, não tela quebrada |
| Todo look tem pelo menos uma peça | Não existe look vazio no feed |
| Nenhum look repetido | Sem duplicata no catálogo |
| Nenhuma peça repetida entre looks | Os links de compra não se embaralham |

### O cartão do look

| Teste | O que garante na prática |
|---|---|
| Mostra nome, quantidade de peças e preço total | A informação que decide o toque está visível |
| Soma o preço certo | R$ 189,90 + R$ 129,90 + R$ 299,90 = R$ 619,70 |
| Mostra o selo de IA quando é imagem gerada | Transparência com a usuária |
| Não mostra o selo em foto real | O selo não vira enfeite sem sentido |
| Descreve o look para leitor de tela | Usuária cega consegue usar o app |
| Avisa qual look foi tocado | O toque leva ao look certo, não a outro |
| Não quebra sem ação de toque | Reaproveitar o cartão em outra tela não derruba o app |
| Plural certo com 1 peça | "1 peça", não "1 peças" |

## Como rodar

```bash
npm test
```

## O que estes testes **não** cobrem

Sendo honesto sobre o limite:

- **Não testam a rolagem de verdade no celular.** Isso é teste de aparelho, e vai entrar quando houver build (Maestro, ver [[../../08-plano-de-testes|plano de testes]]).
- **Não testam velocidade.** Medir se roda liso com 500 looks num Android de entrada precisa de aparelho real.
- **Não testam a API de verdade**, porque ela ainda não existe.

## Problema encontrado e corrigido

Ao escrever o teste do look com uma peça só, apareceu **"1 pecas"** na tela — plural errado e sem acento. Corrigido em todos os textos do app: agora é "1 peça" / "3 peças", e todo texto visível para a usuária foi acentuado corretamente.

Voltar: [[o-que-e]] · [[como-funciona]]
