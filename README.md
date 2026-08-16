# App Monta Looks

Aplicativo mobile brasileiro de moda feminina. Hoje ele faz uma coisa:

**Procurar tipo de roupa → marcar o que você tem → montar o seu guarda-roupa.**

O app aprende o seu estilo a partir do que você marca — e essa conta acontece
inteira **no seu celular**. Não existe servidor guardando o que você gosta de
vestir, porque não existe servidor.

> **Nada está à venda.** Decisão do fundador (agosto/2026). O código de
> assinatura, paywall, limites por plano e link de afiliado continua no
> repositório, testado e pronto para voltar, atrás de uma chave
> (`MONETIZACAO_ATIVA` em `src/lib/flags.ts`). Motivo e leitura de mercado:
> [`docs/09-mercado-sem-venda.md`](docs/09-mercado-sem-venda.md).

## O que existe no app

| Aba | O que faz |
|---|---|
| **Roupas** | 66 tipos de roupa. Busca sem acento, por apelido ("rasteirinha", "hoodie") e por sensação ("boho", "academia"). Toca no cartão e a peça entra no guarda-roupa |
| **Guarda-roupa** | O armário organizado por categoria, de cima para baixo do corpo, com o resumo do estilo aprendido |
| **Perfil** | A régua do que o algoritmo aprendeu, quantas escolhas isso representa, e o botão de apagar tudo |

Guardadas no código, fora das abas: feed de indicações, detalhe do look, salvar
looks e meus looks salvos — a parte comercial.

## Rodando

```bash
npm install
npm start          # abre o Expo; leia o QR code com o Expo Go
npm test           # 275 testes
npm run typecheck
npm run lint
```

Instruções completas para ver no celular: [`docs/COMO-VER-O-APP.md`](docs/COMO-VER-O-APP.md).

## Documentação

Toda a documentação está em [`docs/`](docs/) — compatível com Obsidian, basta
abrir a raiz do repositório como vault.

**Comece por:** [`docs/00-INDEX.md`](docs/00-INDEX.md) · **Estado atual:** [`docs/CHECKLIST.md`](docs/CHECKLIST.md)

| Documento | Conteúdo |
|---|---|
| [`docs/features/`](docs/features/README.md) | Uma pasta por feature: o que é, como funciona, o que foi testado |
| [`docs/09-mercado-sem-venda.md`](docs/09-mercado-sem-venda.md) | O mercado do app sem venda, e quando religar a monetização |
| [`docs/02-analise-de-mercado.md`](docs/02-analise-de-mercado.md) | TAM/SAM/SOM e projeções |
| [`docs/03-concorrentes.md`](docs/03-concorrentes.md) | Whering, Acloset, Indyx e as lacunas |
| [`docs/01-visao-e-ideias.md`](docs/01-visao-e-ideias.md) | Visão, personas, 43 ideias por fase |
| [`docs/04-assinaturas-precos.md`](docs/04-assinaturas-precos.md) | Estratégia de planos (desligada hoje) |
| [`docs/05-frontend.md`](docs/05-frontend.md) | Stack: Expo + React Native (TypeScript) |
| [`docs/06-seguranca.md`](docs/06-seguranca.md) | Threat model, MASVS, LGPD |
| [`docs/07-backlog-github.md`](docs/07-backlog-github.md) | Backlog, fluxo de PR, CI |
| [`docs/08-plano-de-testes.md`](docs/08-plano-de-testes.md) | Plano de testes e registro |

Regras e convenções do projeto: [`AGENTS.md`](AGENTS.md).

## Regras de ouro

1. Nada entra em `main` sem pull request revisado e checks verdes.
2. Todo teste executado vira registro em markdown em [`docs/testes/`](docs/testes/).
3. Fotos de usuárias são dado sensível: issues que tocam upload/armazenamento/exibição de foto levam label `seguranca` obrigatória.
4. **O perfil de estilo não sai do aparelho.** Propor o contrário é decisão de produto, não detalhe técnico.
5. Nada será vendido por enquanto. Quando voltar, os preços são Grátis / R$ 19,90 / R$ 24,90 — fixos, decisão do fundador.

## Status

O app funciona de ponta a ponta, sozinho, sem backend e sem internet — mas
**ninguém ainda o viu num celular de verdade**. O que trava isso é uma conta no
[expo.dev](https://expo.dev): bloco 1 de [`docs/CHECKLIST.md`](docs/CHECKLIST.md).
