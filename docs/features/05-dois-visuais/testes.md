---
title: Dois visuais — testes
date: 2026-08-12
tags:
  - monta-looks
  - feature
  - design
  - testes
tipo: registro-de-teste
status: aprovado
---

# Dois visuais — testes

| Campo | Valor |
|---|---|
| Data | 2026-08-12 |
| Executor | Equipe de desenvolvimento |
| Escopo | Dois fronts trocáveis e app exclusivo de celular |
| Resultado | ✅ 17 testes novos, todos passando (146 no projeto) |

## As duas direções estão completas

| Teste | O que garante na prática |
|---|---|
| Existem exatamente dois visuais | Nem um a menos (escolha fictícia), nem um a mais sem decisão |
| Cada um tem nome e descrição | A tela de escolha nunca mostra opção sem rótulo |
| **Cada um define as 10 cores, todas em formato válido** | Nenhuma tela fica sem cor por token esquecido |
| **As duas são visualmente distintas** | O teste com usuárias compara coisas diferentes de verdade |
| Texto nunca é preto puro nem igual ao fundo | Legibilidade garantida nas duas direções |

## A escolha funciona e persiste

| Teste | O que garante na prática |
|---|---|
| Começa no padrão | Usuária nova vê o visual definido, não uma tela sem cor |
| Troca de visual | O básico funciona |
| **A escolha continua depois de fechar o app** | Ela não precisa reescolher toda vez |
| Primeira abertura não quebra | Sem preferência salva, o app abre normal |
| **Visual inventado volta ao padrão** | Quando uma direção for descartada, quem a tinha salva não fica com tela branca |
| Arquivo corrompido volta ao padrão | App abre mesmo com dado local danificado |
| Recusa valores inválidos (vazio, nulo, número, objeto) | Dado local adulterado não vira estado do app |

## Verificações fora dos testes automáticos

| Verificação | Resultado |
|---|---|
| Conferência de tipos | ✅ zero erro |
| Conferência de estilo de código | ✅ zero problema |
| O app compila e gera o pacote | ✅ 4,6 MB |
| Suíte completa do projeto | ✅ 146 testes |

## O que **não** foi testado

- **Nenhum dos dois visuais foi visto em celular.** Contraste real, comportamento no sol, e como a cor se comporta em tela OLED só aparecem em aparelho. Este é justamente o teste que falta — e é o motivo de existirem dois.
- **Não há teste automático da tela de escolha.** Telas são cobertas por teste de aparelho, que depende de build.
- **As fontes de cada direção ainda não foram embarcadas** — hoje as duas usam a fonte padrão do sistema. A personalidade tipográfica de cada direção ainda não é visível.

## Próximo passo natural

Teste de preferência com 5–8 mulheres do público-alvo, com o app rodando no celular delas. Roteiro em [[../../08-plano-de-testes|plano de testes]].

Voltar: [[o-que-e]] · [[como-funciona]]
