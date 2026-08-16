---
title: Sem monetização — como funciona
date: 2026-08-16
tags:
  - monta-looks
  - feature
  - monetizacao
  - decisoes
tipo: decisoes-tecnicas
status: ativo
---

# Sem monetização — as decisões

## Onde está no código

| Arquivo | Papel |
|---|---|
| `src/lib/flags.ts` | A chave `MONETIZACAO_ATIVA` |
| `src/features/salvos/limites.ts` | Separa "tabela de planos" de "limite que vale hoje" |
| `src/app/paywall.tsx` | Guarda contra link externo |
| `src/app/look/[id].tsx` | Esconde CTA de loja e aviso de comissão |
| `src/app/(tabs)/perfil.tsx` | Esconde plano e botão de planos |

---

## Decisão 1 — Uma chave, não quinze condicionais espalhadas

Uma constante em `flags.ts`, com o comentário explicando quem decidiu, quando e o que precisa acontecer antes de religar.

Alternativa descartada: apagar as telas. Custaria semanas para reescrever depois, e a decisão do fundador é explicitamente reversível.

Alternativa descartada: variável de ambiente. Chave de produto não é configuração de build — ela precisa estar versionada, revisada em pull request e visível para quem lê o código.

## Decisão 2 — `limiteDoPlano` e `limiteVigente` são funções diferentes

```ts
limiteDoPlano('gratis')  // 10  — o que a tabela de planos promete
limiteVigente('gratis')  // ∞   — o que barra a usuária hoje
```

Parece redundância. Não é: são duas perguntas diferentes.

A tabela `LIMITE_LOOKS_SALVOS` continua sendo **decisão de produto**, documentada em [[../../04-assinaturas-precos|04-assinaturas-precos]] e travada por teste. Ela é o contrato que volta a valer quando a chave religar.

`limiteVigente` é quem o app consulta. Se as duas fossem a mesma função, desligar a monetização apagaria a decisão de preço junto — e ela teria que ser redescoberta depois.

## Decisão 3 — Guarda no paywall, não só ausência de botão

Nenhum botão aponta para `/paywall`. Ainda assim a tela tem `<Redirect href="/(tabs)" />` quando a chave está desligada.

Motivo: a navegação não é o único caminho. O app tem esquema de URL (`montalooks://paywall`), e rota digitada ou link externo chegariam lá. Mostrar preço de algo que não está à venda seria promessa falsa.

## Decisão 4 — Esconder a coluna inteira, não escrever "Indisponível"

Na tela de detalhe do look, cada peça tinha "Ver na loja" ou "Indisponível". Com a monetização desligada, a coluna inteira some.

Escrever "Indisponível" em toda peça avisaria a usuária de uma falta que ela não sentiu — e sugeriria que existe uma versão do app onde aquilo estaria disponível.

## Decisão 5 — A função de link continua pura

`montarUrlCompra()` **não** consulta a chave. Ela continua montando o link com rastreio, e continua testada.

Quem decide se o link chega à tela é a tela: `MONETIZACAO_ATIVA ? montarUrlCompra(...) : null`.

Assim a lógica de afiliado — que tem regras de segurança importantes, como bloquear esquemas `javascript:` e nunca colocar dado pessoal na URL — permanece testada nos seus próprios termos, sem depender do estado de uma chave de produto.

## Decisão 6 — Testar o que está desligado

Dois arquivos (`limites-com-monetizacao.test.ts`, `salvos-store-com-monetizacao.test.ts`) usam `jest.mock` para ligar a chave e verificar o comportamento pago inteiro.

Sem eles, o gating quebraria em silêncio e a descoberta aconteceria no dia de religar — que é o pior dia possível para descobrir bugs.

---

## O que a chave **não** faz

| Não desliga | Por quê |
|---|---|
| Os preços em `planos.ts` | São decisão do fundador e continuam travados por teste |
| A validação de segurança de URL de loja | Regra de segurança, não regra comercial |
| O feed e os looks salvos | Saíram da barra de abas por decisão de produto, não pela chave |

## Limites conhecidos

| Limite | Consequência |
|---|---|
| A chave é de tempo de compilação | Religar exige nova versão na loja, não é botão remoto |
| Nenhum teste de tela verifica o esconder | Cobertura é de lógica; a tela depende de revisão manual |
| `restaurar()` não recarrega o plano da usuária | Sem backend, o plano volta como `gratis` a cada abertura. Sem monetização não tem efeito visível — **mas precisa ser resolvido antes de religar** ([#6](https://github.com/Lopesloro/App/issues/6)) |

O que é: [[o-que-e]] · Testes: [[testes]] · Voltar: [[../README|Features]]
