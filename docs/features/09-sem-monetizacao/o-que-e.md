---
title: Sem monetização — o que é e por quê
date: 2026-08-16
tags:
  - monta-looks
  - feature
  - monetizacao
  - decisao-do-fundador
tipo: feature
status: pronta
---

# Sem monetização

## O que é

Uma decisão do fundador, agosto de 2026: **nada será vendido por enquanto**.

Na prática, dentro do app:

| Antes | Agora |
|---|---|
| Tela de planos com R$ 19,90 e R$ 24,90 | Inalcançável pela navegação |
| Limite de 10 looks salvos no Grátis | Nenhum limite, em nenhum plano |
| "Você chegou ao limite. Assine para…" | Mensagem não aparece |
| Botão "Ver na loja" nas peças do look | Não aparece |
| Aviso de comissão de afiliado | Não aparece — não há comissão a declarar |
| Botão "Ver planos" no perfil | Não aparece |

## O código continua todo aqui

Nada foi apagado. Planos, preços, paywall, limites por plano, montagem de link de afiliado com rastreio — está tudo no repositório, testado, funcionando.

O que mudou foi **uma constante**:

```
src/lib/flags.ts → MONETIZACAO_ATIVA = false
```

> [!important] Por que não apagar
> Apagar seria jogar fora semanas de trabalho já testado, para reescrever tudo de novo quando a venda voltar. Manter atrás de uma chave custa uma constante — e a decisão fica reversível em um dia, não em um mês.

## E o código desligado não apodrece

O risco óbvio de código desligado é ele quebrar em silêncio, e a descoberta acontecer no dia em que se tenta religar.

Por isso existem **dois arquivos de teste que ligam a chave por mock** e verificam que o caminho de volta continua inteiro:

- os limites voltam a 10 / 100 / ilimitado;
- o bloqueio acontece exatamente no limite;
- remover continua funcionando mesmo no limite (sem dark pattern);
- a mensagem convida a assinar sem culpar a usuária.

Se alguém quebrar o gating enquanto ele está invisível, o CI acusa no mesmo dia.

## Por que essa decisão faz sentido de mercado

Resumo — o argumento completo está em [[../../09-mercado-sem-venda|09-mercado-sem-venda]]:

1. **O app não dependia mais de ninguém.** A versão comercial precisava de contrato com Renner, C&A, Amaro e Arezzo, mais curadoria publicando fotos. Sem isso, o feed era uma tela de dados de exemplo. O catálogo de tipos de roupa funciona hoje, sozinho.
2. **A privacidade virou arquitetura.** Sem venda e sem servidor, o algoritmo roda no aparelho. Em 2026 isso deixou de ser detalhe técnico e virou o diferencial que apps com 7 milhões de usuárias não conseguem oferecer.
3. **A perda de receita é teórica.** Não havia contrato de afiliado assinado nem produto cadastrado nas lojas. A receita era R$ 0 antes e continua R$ 0 — o que se adiou foi o esforço, não o faturamento.

> [!warning] O custo real
> Não é dinheiro — é **tempo de aprendizado sobre intenção de compra**. Cada mês sem link de loja é um mês sem saber qual peça gera venda, e isso importa no dia de negociar com varejista.
>
> Mitigação já no código: o algoritmo aprende o perfil de estilo, que é justamente o dado que dá valor à indicação futura. Quando a venda voltar, o app não começa do zero.

## Como religar

1. Trocar `MONETIZACAO_ATIVA` para `true` em `src/lib/flags.ts`.
2. Rodar `npx jest` — os testes do caminho de volta devem passar.

Só que **antes disso**, o bloco 6 de [[../../CHECKLIST|CHECKLIST]] precisa estar feito: CNPJ aberto, conta RevenueCat, produtos cadastrados nas lojas (`medium_mensal`, `premium_mensal`), trava de plano no servidor ([#32](https://github.com/Lopesloro/App/issues/32)) e política de privacidade publicada ([#36](https://github.com/Lopesloro/App/issues/36)).

Ligar a chave sem isso mostra preço que ninguém consegue pagar.

## Os preços continuam fixos

Grátis / R$ 19,90 / R$ 24,90 seguem sendo decisão do fundador, registrada em [[AGENTS]] e travada por teste. Desligar a venda **não** mudou nenhum preço — só parou de mostrá-los.

Detalhes: [[como-funciona]] · Testes: [[testes]] · Voltar: [[../README|Features]]
