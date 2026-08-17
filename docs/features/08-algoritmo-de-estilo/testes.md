---
title: Algoritmo de estilo — testes
date: 2026-08-16
tags:
  - monta-looks
  - feature
  - algoritmo
  - testes
tipo: registro-de-teste
status: aprovado
---

# Algoritmo de estilo — testes

| Campo | Valor |
|---|---|
| Data | 2026-08-16 |
| Escopo | Aprendizado, afinidade, confiança, explicação e ordenação |
| Resultado | ✅ 43 testes novos, todos passando |
| Comando | `npx jest src/features/estilo` |

## O app começa sem opinião

| Teste | O que garante na prática |
|---|---|
| Perfil novo não tem peso em nada | Não há estilo chutado de fábrica |
| Afinidade é exatamente 0,5 para qualquer peça | "Sem opinião" é um valor definido, não um número qualquer |
| **Não finge saber o estilo de quem acabou de instalar** | Sem estilo dominante, sem motivo, resumo honesto |

## Aprender com o que a usuária guarda

| Teste | O que garante na prática |
|---|---|
| Guardar aumenta o peso dos estilos da peça | O básico funciona |
| Não altera o perfil recebido | Função pura — nenhum efeito escondido |
| Remover puxa o peso para baixo | Tirar peça também é informação |
| Descartar pesa mais contra do que remover | Rejeição explícita vale mais que faxina de armário |
| **Peça com três estilos não ensina três vezes mais** | Um voto por peça, dividido entre as etiquetas |
| **500 marcações não estouram o limite** | O peso satura em 1, o perfil não corrompe |
| **Cada novo voto move menos que o anterior** | Retorno decrescente comprovado, não só afirmado |
| **O gosto acompanha a mudança de estação** | Inverno de tricô → verão de linho: o clássico encolhe |

## Afinidade

| Teste | O que garante na prática |
|---|---|
| Perfil clássico dá nota alta a peça clássica | O algoritmo faz o que promete |
| E nota mais baixa a peça do lado oposto | A distinção é real, não ruído |
| Fica sempre entre 0 e 1 | Testado com o catálogo inteiro |

## Confiança

| Teste | O que garante na prática |
|---|---|
| Começa em zero | O app não interfere antes de ter base |
| Cresce com o uso e satura em 1 | Não passa de 100% de certeza |
| **Só afirma um estilo depois de evidência suficiente** | 2 peças → silêncio; 8 peças → "clássico" |

## Explicar para a usuária

| Teste | O que garante na prática |
|---|---|
| Diz o motivo em português, sem jargão | Verificado que a frase **não** contém "peso", "score", "vetor" |
| **Não inventa motivo para peça que não combina** | Devolve nulo — a tela não mostra linha nenhuma |
| O resumo muda conforme o app aprende | Três estágios: "ainda não sei" → "começando" → "clássico" |
| O caimento preferido aparece quando há um | Perfil de peça solta identifica "solto" |
| O ranking vem do maior para o menor | A régua da tela de perfil mostra na ordem certa |

## A busca manda mais que o palpite

Esta seção é a garantia estrutural da feature.

| Teste | O que garante na prática |
|---|---|
| **`AJUSTE_MAXIMO < PESO_TEXTO`** | A desigualdade em si é testada — se alguém trocar as constantes, o CI para |
| Quem procura "camisa" recebe camisa, com perfil esportivo | O gosto não sobrepõe o pedido |
| Quem procura "bota" recebe bota, com perfil clássico | Idem, no sentido contrário |
| O ajuste respeita a faixa declarada | Verificado peça por peça no catálogo inteiro |

## O estilo desempata dentro do mesmo nível

| Teste | O que garante na prática |
|---|---|
| Sem texto, o gosto ordena o catálogo | Folhear mostra primeiro o que se parece com ela |
| Dois perfis diferentes veem topos diferentes | O personalizado é realmente personalizado |
| Dentro de um filtro, a peça do estilo certo sobe | Filtrar por calçado mostra scarpin para umas, tênis para outras |

## Perfil vazio não bagunça a ordem

| Teste | O que garante na prática |
|---|---|
| Ajuste é exatamente zero para toda peça | Nenhuma interferência sem base |
| A ordem cai no alfabeto, não em ordem aleatória | Duas aberturas mostram a mesma lista |
| A busca por texto continua funcionando normalmente | O algoritmo não atrapalha quem ainda não tem perfil |

## Ler o perfil guardado no aparelho

| Teste | O que garante na prática |
|---|---|
| Perfil válido volta inteiro | Persistência funciona |
| Versão diferente começa do zero | Não adivinha qual peso ia em qual chave |
| Lixo (`null`, `42`, `"texto"`, `[]`) não derruba o app | Seis formatos inválidos testados |
| **Termo novo entra em zero sem invalidar o resto** | Dá para crescer o vocabulário sem apagar o perfil das usuárias |
| Peso adulterado para fora da faixa é cortado | Arquivo editado à mão não quebra a matemática |
| Chave desconhecida é ignorada | Sem lixo entrando no modelo |
| Contador negativo vira zero | Sem confiança negativa |

## Não testado ainda

- [ ] **Se o algoritmo acerta na vida real.** Todos os testes acima verificam que ele faz o que foi projetado — nenhum verifica se o projeto está certo. Isso só o teste com 5 a 8 mulheres do público-alvo responde (bloco 8 de [[../../CHECKLIST|CHECKLIST]]).
- [ ] Comportamento com armário de centenas de peças
- [ ] Se `INTERACOES_PARA_CONFIAR = 8` é o número certo — foi escolhido por julgamento, não por dado

O que é: [[o-que-e]] · Decisões: [[como-funciona]] · Voltar: [[../README|Features]]
