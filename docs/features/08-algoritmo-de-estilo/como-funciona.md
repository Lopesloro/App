---
title: Algoritmo de estilo — como funciona
date: 2026-08-16
tags:
  - monta-looks
  - feature
  - algoritmo
  - decisoes
tipo: decisoes-tecnicas
status: ativo
---

# Algoritmo de estilo — como funciona por dentro

## Onde está no código

| Arquivo | O que faz |
|---|---|
| `src/features/estilo/vocabulario.ts` | Os termos que o algoritmo aprende |
| `src/features/estilo/perfil-estilo.ts` | A matemática: aprender, afinidade, confiança, explicar |
| `src/features/estilo/ordenar.ts` | Onde a busca encontra o gosto |
| `src/features/estilo/estilo-store.ts` | O perfil guardado no aparelho |

Tudo são funções puras, exceto o store. Isso é o que permite 43 testes rodarem em um segundo, sem simular tela nem rede.

---

## O modelo, em uma linha

```
peso ← peso + TAXA × sinal × (1 − |peso|)
```

Cada peça marcada aplica isso aos atributos dela. É só.

### O termo `(1 − |peso|)` é o coração da regra

Sem ele, dez peças boho seguidas empurrariam o peso ao infinito, e nenhuma evidência contrária conseguiria trazer de volta — o perfil ficaria **preso** no primeiro estilo que a usuária marcou.

Com ele, cada novo voto move menos que o anterior. O peso converge para 1 sem nunca passar, e continua sensível a mudança de gosto. Há teste verificando as duas coisas: que 500 marcações do mesmo estilo não estouram o limite, e que cada salto é menor que o anterior.

### As constantes

| Constante | Valor | Por quê |
|---|---|---|
| `TAXA_APRENDIZADO` | 0,35 | Alto demais oscila a cada toque; baixo demais não aprende no primeiro dia |
| `DECAIMENTO` | 0,02 | O quanto os atributos não votados encolhem — é isso que deixa o gosto mudar |
| `INTERACOES_PARA_CONFIAR` | 8 | Abaixo disso o app não afirma estilo nenhum |

### Os sinais

| Sinal | Força | Por quê |
|---|---|---|
| `guardou` | +1,0 | Escolha deliberada |
| `removeu` | −0,5 | Metade: remover costuma ser correção de toque errado ou faxina, não rejeição |
| `descartou` | −0,8 | "Não é pra mim" é rejeição de verdade (botão ainda não existe na tela) |

## Decisão — Um voto por peça, não um por etiqueta

Uma camisa de linho é boho **e** minimalista **e** clássica. Uma saída de praia é só boho.

Se cada etiqueta recebesse o voto inteiro, a camisa de linho ensinaria três vezes mais que a saída de praia — só por ser mais difícil de classificar. O sinal é dividido pelo número de etiquetas: **a peça vale um voto**.

Há teste comparando exatamente esse par de peças.

## Decisão — Afinidade por dimensões com peso

```
afinidade = 0,45 × estilo
          + 0,20 × caimento
          + 0,20 × ocasião
          + 0,10 × categoria
          + 0,05 × estação
```

Estilo pesa mais porque é o que a pessoa percebe primeiro numa roupa. Estação pesa quase nada porque diz mais sobre o mês do que sobre o gosto.

O resultado sai em 0 a 1, com **0,5 significando "sem opinião"** — e não um número qualquer que a tela mostraria como se fosse julgamento. Perfil vazio devolve exatamente 0,5 para toda peça, e há teste disso.

## Decisão — A desigualdade que protege a busca

A ordem final é:

```
pontuação = pontuaçãoDeTexto × PESO_TEXTO + ajusteDeEstilo
com |ajusteDeEstilo| ≤ AJUSTE_MAXIMO < PESO_TEXTO
```

`PESO_TEXTO` é 1000; `AJUSTE_MAXIMO` é 100. Como o menor degrau entre dois níveis de relevância de texto vale 5000 pontos, o perfil **nunca** consegue mover uma peça de um nível para outro.

Consequências, ambas testadas:

- Com texto digitado: o estilo só reordena **dentro** do mesmo nível de relevância.
- Sem texto digitado: todas as peças empatam em relevância, e o gosto ordena o catálogo sozinho — que é o que se espera de quem está folheando.

O primeiro teste do arquivo `ordenar.test.ts` verifica a desigualdade em si. Se alguém trocar as constantes, ele quebra antes de qualquer usuária notar.

## Decisão — A confiança encolhe o ajuste

```
ajuste = confiança × (afinidade − 0,5) × 2 × AJUSTE_MAXIMO
```

Com perfil vazio, `confiança = 0` e o ajuste é **exatamente zero** — a ordem cai no alfabeto, previsível e estável. O app só começa a interferir quando tem base.

## Decisão — Ler o perfil do aparelho com desconfiança

`migrarPerfil()` reconstrói o perfil por cima de um vazio:

| Situação | O que acontece |
|---|---|
| Versão diferente | Começa do zero — melhor que adivinhar qual peso ia em qual chave |
| Chave que não existe mais | Ignorada |
| Termo novo no vocabulário | Entra em zero, o resto é preservado |
| Peso fora da faixa (adulterado) | Cortado em −1 / +1 |
| Contador negativo | Vira zero |
| Lixo total (`null`, `42`, `"texto"`) | Perfil vazio, app não cai |

É o que torna seguro **acrescentar** termos ao vocabulário sem invalidar o perfil de ninguém.

## Decisão — Explicar ou ficar calado

`explicarAfinidade()` devolve `string` ou `null`. Ordem de tentativa:

1. Estilo dominante **e** caimento preferido batem → frase com os dois
2. Só o estilo → frase do estilo
3. Só o caimento → frase do caimento
4. Nenhum dos dois, mas a ocasião principal bate → frase da ocasião
5. Nada bate → `null`, e a tela não mostra linha nenhuma

Nada de "achamos que você vai gostar". Frase genérica ensina a usuária a ignorar o texto, e aí a explicação inteira perde a função.

---

## O que este algoritmo não é

| Não é | Por quê |
|---|---|
| Filtragem colaborativa | Precisaria de milhares de usuárias e de mandar dados para um servidor |
| Rede neural | Não caberia no aparelho, não seria explicável, e não teria dado para treinar |
| Análise de coloração pessoal | Exige foto do rosto — outro produto, outro risco de LGPD |
| Detecção de tendência | Exigiria dado de mercado em tempo real |

É um **modelo linear de preferência, online, com decaimento**. A escolha certa para o problema que existe hoje: uma usuária, zero servidores, resposta instantânea e explicável.

## Limites conhecidos

| Limite | Consequência | Saída |
|---|---|---|
| Aprende só do catálogo | Estilo fora das 66 peças é invisível | Catálogo maior |
| Não sabe a estação atual | Recomenda tricô em janeiro se a usuária gosta de tricô | Issue [#20](https://github.com/Lopesloro/App/issues/20) |
| Não pergunta nada | Depende de a usuária marcar para aprender | Quiz opcional ([#9](https://github.com/Lopesloro/App/issues/9)) |
| Perfil não sai do aparelho | Trocar de celular reinicia o aprendizado | Consequência aceita da decisão de privacidade |
| Sem telemetria | Não sabemos se acerta na vida real | Issue [#49](https://github.com/Lopesloro/App/issues/49), com dado agregado e anônimo |

O que é: [[o-que-e]] · Testes: [[testes]] · Voltar: [[../README|Features]]
