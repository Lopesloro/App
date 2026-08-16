---
title: Mercado do app sem venda — guarda-roupa e estilo no aparelho
date: 2026-08-16
tags:
  - monta-looks
  - mercado
  - analise
  - guarda-roupa
  - privacidade
tipo: analise-de-mercado
status: ativo
---

# Mercado do app sem venda

> [!important] O que mudou
> Decisão do fundador (agosto/2026): **nada será vendido por enquanto**. O app deixa de ser vitrine de indicações com link de loja e passa a ser **um guarda-roupa que aprende o estilo de quem usa**, rodando inteiro no celular.
>
> Este documento responde à pergunta óbvia: *isso ainda é um mercado?*

Documento irmão de [[02-analise-de-mercado]] (que dimensiona o mercado de moda) e [[03-concorrentes]] (que mapeia os players). Aqui está o que muda com o novo posicionamento.

---

## 1. Resposta curta

Sim — e o nicho **cresceu** desde a análise de agosto/2026.

| Indicador | Leitura de 11/08/2026 | Leitura de 16/08/2026 | Movimento |
|---|---|---|---|
| Apps de guarda-roupa (global) | US$ 224 mi (2024) → US$ 399 mi (2032), CAGR 8,8% | **US$ 3,5 bi (2026) → US$ 9,2 bi (2033), CAGR 13,1%** | ⬆️ ordem de grandeza |
| Guarda-roupa cápsula (recorte) | não medido | **US$ 1,1 bi (2024) → US$ 8,5 bi (2033), CAGR 33,5%** | 🆕 |
| Closet virtual (recorte) | não medido | **US$ 2,4 bi (2025) → US$ 4,8 bi (2033), CAGR 9,7%** | 🆕 |

> [!warning] Leia com desconfiança
> A diferença entre "US$ 399 mi em 2032" e "US$ 9,2 bi em 2033" não é o mercado crescendo 20x em cinco dias — é **consultoria diferente medindo coisa diferente**. Uma conta só o app; outra conta o ecossistema inteiro (integração com varejo, try-on, analytics de closet).
>
> A conclusão que sobrevive às duas leituras é a única que importa: **o nicho existe, é crescente, e nenhuma das duas contas o coloca como mercado bilionário no Brasil sozinho.** Continua valendo o que [[02-analise-de-mercado]] já dizia — o valor está na intersecção, não no organizador de armário puro.

## 2. Quem já está lá

| App | Escala | Modelo | O que ele não faz |
|---|---|---|---|
| **Whering** | ~7 mi de usuárias; 5 mi de downloads no início de 2025, +1 mi orgânicos num trimestre | Grátis forte + premium | Português do Brasil, vocabulário brasileiro |
| **Acloset** | ~7 mi de usuárias | Freemium com teto de 100 peças | Idem; e o teto é a fricção que nos ensina algo |
| **Indyx** | Não divulga | Stylist humana, a partir de US$ 60 | Preço fora da realidade brasileira |
| **Vesta, GetWardrobe, Nouva** | Menores | Variado | Idem |

> [!tip] O sinal mais útil dessa tabela
> Whering cresceu **1 milhão de usuárias num trimestre, organicamente** — sem mídia paga. Guarda-roupa digital é produto de boca a boca. Isso é exatamente o tipo de produto que **não precisa de receita no primeiro ano para crescer**, e reforça a decisão de não vender agora.

## 3. Por que não vender agora é defensável

Não é só economia de esforço. São três coisas que a versão comercial **impedia**:

### 3.1 Não dependemos de ninguém para o app funcionar

A versão anterior precisava de: contrato de afiliado com Renner, C&A, Amaro e Arezzo; curadoria publicando fotos; pipeline de imagens. Sem isso, o feed era uma tela de dados de exemplo.

O catálogo de **tipos** de roupa não precisa de nada disso. São 66 peças que existem no vocabulário de moda brasileiro e não saem de linha. O app funciona hoje, sozinho, sem parceiro, sem servidor e sem internet.

### 3.2 A privacidade deixa de ser promessa e vira arquitetura

Este é o ponto competitivo real. Em 2026, IA que roda no aparelho saiu de "diferencial técnico" para **estratégia de mercado**: as regulações (GDPR, CCPA, **LGPD**, PDPA, DPDP indiana) convergiram para a mesma exigência técnica — dado pessoal protegido dentro do app, por padrão.

O algoritmo de estilo deste app roda inteiro no celular. Não existe servidor com "o que a Ana gosta de vestir" porque **não existe servidor**. Isso:

- elimina a maior parte do risco de LGPD do produto (não se vaza o que não se coleta);
- é uma frase de marketing que os concorrentes de 7 milhões de usuárias não podem dizer;
- funciona offline, no metrô e no aparelho barato.

> [!info] O que ainda exige cuidado
> Rodar no aparelho não elimina a LGPD — só reduz o escopo. Quando o login e a foto de peça entrarem (issues [#6](https://github.com/Lopesloro/App/issues/6) e [#11](https://github.com/Lopesloro/App/issues/11)), volta a haver dado pessoal em trânsito. O bloco 7 de [[CHECKLIST]] continua obrigatório.

### 3.3 O produto para de brigar com a consumidora

A tendência de consumo de moda em 2026 vai na direção oposta ao fast fashion: guarda-roupa reduzido, 30 a 40 peças versáteis, recompra consciente — especialmente entre Millennials e Gen Z, que são exatamente o público-alvo.

Um app que empurra link de compra a cada tela rema contra isso. Um app que ajuda a **enxergar e usar melhor o que já se tem** rema a favor. A versão sem venda está do lado certo dessa onda — de graça.

## 4. O que se perde

Honestidade custa menos que otimismo:

| Perda | Tamanho |
|---|---|
| Receita de afiliado | R$ 0 hoje, e continuaria R$ 0 sem contrato assinado — a perda é **teórica** |
| Receita de assinatura | R$ 0 hoje; exigiria RevenueCat, produtos nas lojas e CNPJ, nada disso pronto — perda **adiada, não realizada** |
| Argumento de "descobrir peça nova" | Real. O app deixa de sugerir o que comprar |
| Dado de intenção de compra | Real, e era o ativo mais valioso do modelo anterior |

> [!important] O custo verdadeiro
> Não é dinheiro — é **tempo de aprendizado sobre intenção de compra**. Cada mês sem link de loja é um mês sem saber qual look gera venda. Isso importa no dia de negociar com varejista.
>
> Mitigação já no código: o algoritmo aprende o **perfil de estilo**, que é o dado que dá valor à indicação futura. Quando a venda voltar, o app não começa do zero — ele já sabe do que cada usuária gosta.

## 5. Quando ligar a venda de volta

A chave é uma constante (`MONETIZACAO_ATIVA` em `src/lib/flags.ts`) e o caminho de volta tem teste automatizado. O que falta não é código — é o mundo real:

- [ ] Base de usuárias que justifique a conversa com varejista (referência: nenhum varejista fecha afiliado abaixo de dezenas de milhares de usuárias ativas)
- [ ] CNPJ aberto (exigência das lojas de aplicativo)
- [ ] Conta RevenueCat e produtos cadastrados (`medium_mensal`, `premium_mensal`)
- [ ] Trava de plano no servidor ([#32](https://github.com/Lopesloro/App/issues/32)) — hoje o limite é só da interface
- [ ] Política de privacidade publicada ([#36](https://github.com/Lopesloro/App/issues/36))

Bloco 6 de [[CHECKLIST]] tem a lista completa.

## 6. O que medir enquanto não se vende

Sem receita, as métricas que importam mudam. Estas são as que dizem se o produto está funcionando:

| Métrica | Por que ela | Meta de referência |
|---|---|---|
| Peças marcadas na primeira sessão | Mede se a busca acha o que a pessoa procura | ≥ 8 |
| Usuárias que voltam no dia 7 | Guarda-roupa vazio não traz ninguém de volta | ≥ 25% |
| Interações até o perfil ter estilo dominante | Mede se o algoritmo aprende rápido | ≤ 8 (é a constante `INTERACOES_PARA_CONFIAR`) |
| Buscas sem resultado | Cada uma é uma peça faltando no catálogo | ≤ 5% das buscas |
| Peças removidas depois de marcadas | Alto = catálogo confuso ou algoritmo empurrando errado | ≤ 10% |

> [!warning] Nada disso é medido hoje
> Não há telemetria no app ([#49](https://github.com/Lopesloro/App/issues/49)). E qualquer telemetria que entrar precisa respeitar a mesma regra do algoritmo: **agregado e anônimo, ou não entra**. Medir "quantas buscas falharam" é legítimo; enviar "a Ana procurou por vestido de festa" não é.

---

## Fontes

Consultadas em 16/08/2026.

- [Verified Market Reports — Wardrobe App Market 2026-2034](https://www.verifiedmarketreports.com/product/wardrobe-app-market/)
- [Zion Market Research — Capsule Wardrobe App Market](https://www.zionmarketresearch.com/report/capsule-wardrobe-app-market)
- [Business Research Insights — Virtual Closet App Market 2026–2035](https://www.businessresearchinsights.com/market-reports/virtual-closet-app-market-117759)
- [Intel Market Research — Wardrobe App Market 2026 to 2034](https://www.intelmarketresearch.com/wardrobe-app-2025-2032-667-1709)
- [Grokipedia — Comparison of Whering, Indyx, Acloset and Fits](https://grokipedia.com/page/Comparison_of_Whering_Indyx_Acloset_and_Fits)
- [Vesta — Vesta vs Indyx vs Whering vs Acloset](https://vestatheapp.com/blog/vesta-vs-indyx-whering-acloset)
- [Appdome — 2026 GDPR & Privacy Laws for Mobile Apps](https://www.appdome.com/dev-sec-blog/gdpr-mobile-app-security-requirements-gdpr-security-requirements/)
- [Build me app — On-Device AI in 2026: Privacy-First, Faster Mobile UX](https://buildmeapp.io/blog/on-device-ai-in-2026-better-privacy-better-ux-when-it-makes-sense-for-startups/)
- [Avow — Leverage On-Device AI To Improve User Privacy And Retention](https://avow.tech/blog/on-device-ai-to-improve-user-privacy-and-retention/)
- [Patricinha Esperta — Moda Sustentável 2026: guarda-roupa consciente](https://patricinhaesperta.com.br/moda/moda-sustentavel-2026-como-montar-um-guarda-roupa-consciente-e-estiloso)
- [EZILDINHA — Moda Sustentável Feminina no Brasil 2026](https://www.ezildinha.com.br/blogs/falando-de-moda/moda-sustentavel-feminina-no-brasil-marcas-e-tendencias-2026)

Índice: [[00-INDEX]] · Mercado geral: [[02-analise-de-mercado]] · Concorrentes: [[03-concorrentes]] · Checklist: [[CHECKLIST]]
