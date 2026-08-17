---
title: Documento de planejamento original
date: 2026-08-17
tags:
  - prospeccao-sites
  - fonte
tipo: arquivo
status: arquivado
---

> [!info] Fonte
> Documento de planejamento completo, consolidado das conversas sobre o projeto. As decisões dele estão organizadas por assunto nas notas ligadas em [[00-INDEX-prospeccao]]. Este arquivo é a fonte — não editar; evoluções vão nas notas de tópico.

# Planejamento — Máquina de Prospecção e Reconstrução de Sites

> Documento de planejamento. Captação de clientes com sites desatualizados → análise → demonstração → conversão.

---

## Ideia original (rascunho)

Captação de clientes que possuem sites desatualizados. Pequena busca pela Apify por sites desatualizados e que não funcionam muito bem. App server para mandar mensagem simples, somente para a resposta, antes de fazer e gastar tokens — economia de tokens. Falar diretamente com o dono nas mensagens. Custo baixo apenas para a conversão rápida: custo de 10% do valor antes de iniciar para valer.

Automatização para mensagem do WhatsApp; logo após a resposta, ler o que foi dito. Falaremos somente com o dono para ter uma melhora. Logo após a confirmação do dono, já entra o Claude Code para ver o site antigo e refatorá-lo de uma forma nova e realista — principalmente ficar muito bom para o cliente ver pelo celular, apenas apresentando o trabalho.

E se podemos ter uma segunda conversa já com o link: é muito importante que funcione automatizado pelo GitHub Pages, para o usuário conseguir abrir o link com botão funcionando. Aqui o nosso agente de IA não falará mais — nós iremos entrar.

**Observações-chave adicionadas depois:**

- As mensagens devem ser sempre em forma amigável — não podemos parecer automáticos.
- **Muito importante que as mensagens sejam curtas.**
- Estruturação 100% antes de qualquer lançamento.
- É muito importante que chegue uma notificação para eu ver, pois será tudo automático.

---

## Avaliação: onde há potencial e onde há risco

A ideia pode funcionar, mas do jeito que está descrita existem alguns pontos que podem fazer o projeto perder dinheiro ou virar uma automação complexa demais. O principal é separar o processo em:

**prospecção → filtro → contato humano/dono → cobrança → execução → entrega → pós-venda**

### 1. A proposta central

Você está propondo algo parecido com:

Encontrar empresas que têm um site antigo/ruim → identificar o dono → iniciar uma conversa barata → confirmar que estamos falando com o responsável → cobrar 10% antecipado → reconstruir o site com IA → publicar automaticamente → mandar o link funcionando → tentar converter para o restante do projeto.

Isso é interessante porque você não precisa vender "desenvolvimento de site" inicialmente. Você vende algo muito mais simples:

> "Encontrei um problema no seu site e posso te mostrar uma versão melhor."

Essa mudança é importante.

### 2. O funil que eu montaria

**Etapa 1 — Encontrar empresas**

Usar a Apify para coletar empresas de determinados segmentos:

- clínicas
- restaurantes
- oficinas
- imobiliárias
- escritórios
- salões
- lojas
- prestadores de serviços
- empresas locais

Mas eu não começaria tentando pegar qualquer empresa. Começaria com **1 ou 2 nichos**. Por exemplo: clínicas odontológicas de São Paulo. Isso permite criar um sistema muito mais específico.

### 3. O filtro automático é extremamente importante

Você não quer mandar mensagem para qualquer empresa. A Apify pode encontrar milhares de empresas, mas depois você precisa criar um **score de qualidade do site**.

| Critério | Pontos |
| --- | --- |
| Site não abre | +30 |
| Site extremamente lento | +20 |
| Não é responsivo | +20 |
| Design antigo | +15 |
| HTTPS problemático | +10 |
| Botões quebrados | +10 |
| Não possui CTA | +10 |
| Layout ruim no celular | +20 |
| Site parece abandonado | +15 |

Faixas de decisão:

- **0–30:** ignorar
- **31–60:** talvez
- **61–80:** prospectar
- **81–100:** prioridade máxima

Isso é muito melhor do que simplesmente "a Apify encontrou empresas". Você quer: *"a Apify encontrou empresas com alta probabilidade de precisar do nosso serviço."*

### 4. A IA pode fazer a primeira análise

Você pode pegar URL, HTML, screenshot, informações da empresa, telefone, WhatsApp, nome da empresa e segmento, e fazer uma análise automática.

Mas existe uma regra importante: **não use um modelo caro para todo mundo.** Primeiro faça verificações baratas.

```
Empresa encontrada
       ↓
Site responde?
       ↓
HTML consegue ser baixado?
       ↓
Mobile aparentemente funciona?
       ↓
Site tem problemas claros?
       ↓
Score > X?
       ↓
Só então usar IA
```

Isso é exatamente onde sua ideia de economia de tokens faz sentido.

### 5. O primeiro WhatsApp NÃO deveria ser feito por um agente inteligente completo

Você não precisa gastar tokens para responder "Olá, tudo bem?". Pode ser uma automação simples:

```
Olá, tudo bem?
Falo com o responsável pelo site da [EMPRESA]?
```

E acabou. Não precisa Claude. Não precisa GPT. Não precisa agente. Pode ser uma lógica simples.

### 6. Depois da resposta, entra a inteligência

Se a empresa responde *"Sim, sou eu."*, agora você tem um sinal muito mais valioso. Seu sistema pode classificar:

```
lead_status = owner_confirmed     # confirmou que é responsável
lead_status = wrong_person        # não é
lead_status = uncertain           # resposta ambígua → mandar para análise
```

### 7. Uma mudança importante: "dono" → "responsável pela decisão"

Você disse *"falaremos somente com o dono"*. Eu transformaria isso em: **"queremos chegar ao responsável pela decisão."**

Porque, na prática, o dono pode não cuidar do site. Pode ser gerente, sócio, marketing, administrativo, agência, filho do proprietário etc. Se você insistir exclusivamente no "dono", pode perder leads bons.

### 8. O grande diferencial: não vender primeiro

Em vez de "Olá, fazemos sites. Gostaria de contratar?", você chega com:

> "Analisamos o site da sua empresa e encontramos alguns pontos que poderiam melhorar principalmente a experiência pelo celular. Posso te mostrar uma ideia?"

Você está oferecendo **evidência**, não promessa.

### 9. A parte do Claude Code faz sentido

Depois que existe interesse real:

```
Lead qualificado
       ↓
Pagamento inicial
       ↓
Sistema recebe URL
       ↓
Claude Code analisa projeto/site
       ↓
Reconstrução
       ↓
Testes
       ↓
GitHub
       ↓
GitHub Pages
       ↓
URL de demonstração
```

Mas não deixe o Claude Code simplesmente "refatorar qualquer site". Crie um padrão, algo como:

```
/analyze
/build
/test
/mobile
/accessibility
/seo
/deploy
```

E cada projeto passa por essas etapas.

### 10. O foco em mobile é correto

Eu venderia o produto inicialmente como: **"uma versão moderna e muito melhor no celular."** Porque é muito fácil demonstrar — antes (site antigo) / depois (site novo).

Isso é muito mais poderoso do que falar "nosso código é moderno". O cliente não se importa muito com React, Next.js, Claude ou GitHub. Ele quer saber: *"isso vai me trazer mais clientes?"*

### 11. GitHub Pages: cuidado aqui

A ideia de publicar automaticamente é boa, mas eu não faria GitHub Pages ser dependência obrigatória do **produto final**. Para demonstrações, excelente. Para produção, considere: domínio próprio, HTTPS, DNS, formulários, WhatsApp, analytics, SEO, backend, integrações, manutenção.

Separe os dois:

```
Demo                        Produção
empresa-demo.github.io  →   www.empresa.com.br
```

### 12. Os botões precisam ser testados automaticamente

Não basta gerar o site. O agente precisa testar:

```
[ ] Site abre
[ ] HTTPS funciona
[ ] Mobile funciona
[ ] WhatsApp abre
[ ] Telefone funciona
[ ] Menu funciona
[ ] Formulário funciona
[ ] Links funcionam
[ ] Imagens carregam
[ ] Página não possui erros
```

Uma etapa automática de QA antes de mandar o link. Imagine vender "olha o novo site" e o botão de WhatsApp não funcionar — isso destrói confiança.

### 13. Dois tipos de conversa

**Conversa 1 — Qualificação.** Automatizada. Objetivo: descobrir se existe interesse. Não tentar vender tudo.

**Conversa 2 — Demonstração.** Depois que o cliente demonstra interesse: *"Preparei uma demonstração para você."* Aí entra o link. E nesse momento eu faria **menos IA, não mais** — mande "Aqui está a demonstração" e deixe o trabalho falar.

### 14. A cobrança de 10%

Interessante como mecanismo de compromisso, mas não trate os 10% como simplesmente "taxa".

```
Projeto:  R$ 2.000
Entrada:  R$ 200
Saldo:    R$ 1.800
```

A entrada serve para reservar o projeto, iniciar a personalização e preparar a versão final. Isso reduz muito o número de curiosos, porque existe uma diferença enorme entre "sim, gostei" e "sim, paguei R$ 200 para começar".

### 15. Porém, existe um problema enorme

Você precisa decidir: **construir antes ou depois do pagamento?**

- Construir antes → gasta recursos com pessoas que nunca compram.
- Construir depois → demonstração menos personalizada.

Modelo híbrido:

| Antes do pagamento | Depois dos 10% |
| --- | --- |
| análise | site completo |
| screenshot | conteúdo refinado |
| conceito | funcionalidades |
| versão demonstrativa limitada | domínio, publicação, ajustes |

Isso protege sua margem.

### 16. Onde a ideia pode dar MUITO certo

1. **Nicho específico.** Dentistas → você aprende quais problemas esses sites normalmente têm. Depois imobiliárias, depois restaurantes. A automação fica cada vez melhor.
2. **Oferta extremamente visual.** Antes: site antigo. Depois: site moderno. Vende muito melhor do que uma apresentação comercial.
3. **Baixo custo operacional.** Automatizando scraping, análise, classificação, primeira mensagem, confirmação, geração do projeto, testes e deploy, você consegue prospectar uma quantidade muito maior de empresas.

---

## Onde provavelmente NÃO vai dar certo

### ❌ Problema 1 — Spam

Disparar WhatsApp em massa sem controle traz bloqueios, denúncias, baixa taxa de resposta, problemas com políticas da plataforma e reputação ruim do número. Não construa uma máquina de spam — construa uma **máquina de prospecção altamente segmentada e controlada**.

### ❌ Problema 2 — Encontrar o telefone não significa encontrar o dono

O número que a Apify encontra pode ser recepção, funcionário, WhatsApp comercial, agência ou número antigo. A confirmação do decisor precisa ser uma etapa real do funil.

### ❌ Problema 3 — A IA pode fazer um site feio

"Claude Code + site antigo" não significa automaticamente site excelente. Você precisa ter design system, templates, padrões de UX, componentes reutilizáveis, regras de mobile, regras de acessibilidade e critérios de qualidade. A IA deve operar **dentro de um sistema**, não criar qualquer coisa.

### ❌ Problema 4 — O cliente pode dizer "faz de graça"

Defina muito bem a fronteira: **análise/demonstração ≠ desenvolvimento contratado.** Se você entregar um site completo antes de cobrar, algumas pessoas vão pegar o trabalho e desaparecer.

### ❌ Problema 5 — O preço pode ficar baixo demais

A armadilha: "se é feito por IA, então deveria ser barato." Você está vendendo **resultado comercial, não tokens.** Se conseguir reconstruir um site de R$ 2.000 com custo operacional de R$ 100–300, ótimo — mas não venda por R$ 500 só porque sua tecnologia é barata.

---

## Arquitetura

```
                    APIFY
                      ↓
             Empresas / URLs
                      ↓
              SITE ANALYZER
                      ↓
               SCORE DO SITE
                      ↓
          ┌───────────┴───────────┐
          ↓                       ↓
       SCORE BAIXO            SCORE ALTO
          ↓                       ↓
       DESCARTA             QUALIFICA LEAD
                                  ↓
                           WHATSAPP SIMPLES
                                  ↓
                              RESPOSTA
                                  ↓
                         CLASSIFICADOR IA
                                  ↓
                    ┌─────────────┴─────────────┐
                    ↓                           ↓
                NÃO DONO                    RESPONSÁVEL
                    ↓                           ↓
                  PARA                     CONVERSA
                                                ↓
                                           INTERESSE?
                                                ↓
                                              SIM
                                                ↓
                                           PAGAMENTO 10%
                                                ↓
                                           CLAUDE CODE
                                                ↓
                                      NOVO SITE / REFACTOR
                                                ↓
                                       TESTES AUTOMÁTICOS
                                                ↓
                                             DEPLOY
                                                ↓
                                         LINK DE DEMO
                                                ↓
                                        CLIENTE APROVA
                                                ↓
                                     DOMÍNIO / PRODUÇÃO
                                                ↓
                                     PAGAMENTO RESTANTE
```

## Stack

| Camada | Ferramenta |
| --- | --- |
| Prospecção | Apify |
| Backend/orquestração | Node.js/TypeScript + PostgreSQL |
| WhatsApp | solução oficial/API compatível com as políticas do WhatsApp Business |
| IA | modelo barato para classificação; Claude Code para desenvolvimento; modelo mais capaz somente quando necessário |
| Código | GitHub |
| Deploy de demonstração | GitHub Pages ou outro hosting estático |
| Deploy final | Vercel / Cloudflare / etc., dependendo do cliente |
| Automação | filas + workers |

## Uma coisa que eu NÃO faria

```
Apify → Claude → WhatsApp → Claude → Claude → Claude → Claude
```

Isso vai comer dinheiro. Eu faria:

```
Regras → Filtros → Regras → Modelo barato → Humano/evento importante → Modelo caro
```

**IA somente quando aumenta o valor da decisão.**

---

## O MVP deveria ser MUITO menor

Não tente construir tudo inicialmente.

**MVP 1 — 100 empresas, um único nicho** (ex.: dentistas de São Paulo):

1. encontrar site
2. analisar
3. selecionar 20
4. verificar contato
5. conversar
6. descobrir quantos respondem
7. descobrir quantos são responsáveis
8. descobrir quantos aceitam ver uma demonstração
9. descobrir quantos pagam os 10%

Só isso.

## O número que realmente importa

Não é "quantos sites conseguimos gerar?" — é **quanto custa adquirir um cliente?**

```
Cenário bom              Cenário ruim
100 leads                100 leads
   ↓                        ↓
30 respondem             5 respondem
   ↓                        ↓
15 são responsáveis      1 é responsável
   ↓                        ↓
8 querem ver             0 paga
   ↓
4 pagam entrada
   ↓
3 fecham
```

Se você conseguir o primeiro cenário com custo baixo, a máquina é muito interessante. Se for o segundo, não importa quão incrível seja seu agente.

## Avaliação sincera

| Dimensão | Nota |
| --- | --- |
| Ideia comercial | 8/10 |
| Potencial de automação | 9/10 |
| Facilidade técnica | 7/10 |
| Risco de spam/bloqueio | 7/10 |
| Risco de gerar sites ruins | 6/10 |
| Potencial de margem | 9/10 |
| Dificuldade de aquisição/conversão | 8/10 |

**Vale testar. Mas não vale construir a megaautomação agora. Primeiro prove que alguém paga.**

## O caminho que eu seguiria

- **Fase 1 — Validar oferta:** 100 empresas → encontrar sites ruins → contato manual/semi-automático → ver se existe interesse.
- **Fase 2 — Automatizar prospecção:** depois de descobrir qual mensagem converte — Apify → banco → score → WhatsApp.
- **Fase 3 — Automatizar qualificação:** resposta → classificação → responsável → interesse.
- **Fase 4 — Automatizar produção:** pagamento → Claude Code → GitHub → testes → deploy.
- **Fase 5 — Automatizar entrega:** link → aprovação → domínio → cobrança final.

## A principal mudança de posicionamento

Não pense no produto como *"IA que cria sites."* Pense como:

> "Encontramos empresas que estão perdendo uma oportunidade por terem um site ruim e mostramos uma versão melhor antes de pedir o contrato."

A IA é o motor interno. O cliente compra o resultado.

Comece com um único objetivo: **conseguir os primeiros 3 clientes pagantes manualmente, documentar exatamente o processo e só então transformar cada etapa em automação.** Isso reduz drasticamente o risco de passar semanas construindo um agente sofisticado para descobrir depois que o problema não era técnico — era conversão.

---

# Refinamento: mostrar o problema e oferecer a nova versão sem custo adicional

> "A questão é isso: mostrar algum problema, mostrar que podemos melhorá-lo, falar no sentido de logo após falar o que está dando erro, mostrar uma nova opção de site se concordarem, sem nenhum adicional."

Isso melhora bastante a proposta — é mais forte do que simplesmente chegar oferecendo "criação de site". A lógica seria:

> "Encontramos alguns problemas no seu site atual. Identificamos o que pode estar prejudicando a experiência do cliente. Se você quiser, podemos preparar uma nova versão demonstrativa, sem custo adicional, para você comparar."

## O funil refinado

**1. Encontrar o site** — Apify encontra a empresa + site.

**2. Análise automática** — o sistema verifica coisas objetivas:

- site não funciona direito
- problemas no celular
- carregamento ruim
- links quebrados
- botão de WhatsApp/telefone com problema
- layout antigo
- informações difíceis de encontrar
- ausência de CTA
- problemas de navegação

**3. Primeira mensagem** — nada de vender ainda:

> "Olá! Falo com o responsável pelo site da [empresa]?"

**4. Confirmou que é responsável** — aí explicamos o problema encontrado:

> "Perfeito. Nós analisamos rapidamente o site de vocês e encontramos alguns pontos que podem estar dificultando a navegação, principalmente pelo celular. Posso te mostrar quais são?"

Muito melhor do que dizer "seu site está velho". Você precisa **provar** o problema.

**5. Mostrar o problema** — não diga apenas "o site não é responsivo". Mostre:

- **Problema 1 — Celular:** "No celular, o botão de contato fica difícil de encontrar."
- **Problema 2 — Navegação:** "Para encontrar [serviço], são necessários X passos."
- **Problema 3 — Conversão:** "Não existe um caminho claro para o cliente entrar em contato."

E, se possível, screenshot. Isso cria o momento *"nossa, realmente"* — é esse momento que você quer.

**6. Então vem a proposta:**

> "Se você quiser, podemos montar uma nova versão demonstrativa do site, baseada na empresa de vocês, sem nenhum custo adicional, para você avaliar."

Excelente porque o cliente não precisa acreditar em você. Ele pode ver.

**7. Uma diferença MUITO importante de nomenclatura**

Não chame de **"site grátis"** — cria expectativa errada. Chame de **"demonstração gratuita"** ou **"nova versão demonstrativa"**. A mensagem é "vamos mostrar como poderia ficar", não "vamos trabalhar de graça".

**8. Depois da autorização, entra o Claude Code**

```
Cliente concordou
        ↓
Sistema registra autorização
        ↓
Pega site atual
        ↓
Claude Code analisa estrutura
        ↓
Extrai informações relevantes
        ↓
Cria nova arquitetura
        ↓
Cria novo design
        ↓
Prioriza mobile
        ↓
Implementa
        ↓
Testa
        ↓
GitHub
        ↓
Deploy
        ↓
Link
```

E então: *"Pronto. Fizemos uma demonstração de como poderíamos melhorar o site. Dá uma olhada pelo celular também."*

**9. A parte mais importante da venda** — o cliente vê SITE ANTIGO vs. SITE NOVO. Você não precisa explicar tecnologia; a própria diferença visual faz o trabalho. Se ele disser "gostei, quanto fica?", aí você vende.

**10. Mudança na questão dos 10%**

Não coloque os 10% antes da primeira demonstração. Sua proposta fica muito mais poderosa se você conseguir chegar até "olha o que fizemos" sem pedir dinheiro. Depois que o cliente gostou:

> "Para transformar essa demonstração em uma versão final e colocar tudo em produção, começamos com 10% de entrada."

Primeiro gere valor percebido. Depois peça compromisso.

**11. Mas existe um limite** — evite que o sistema gere sites completos para absolutamente qualquer pessoa. Três níveis:

| Nível | O que é | Custo |
| --- | --- | --- |
| 🟢 1 — Análise | "Encontramos estes problemas." | Gratuita |
| 🟢 2 — Demonstração | Nova versão para visualizar: página inicial, estrutura principal, alguns botões, identidade visual básica | Gratuita, **com limites** |
| 🟡 3 — Projeto final | Todas as páginas, conteúdo definitivo, formulários, integrações, domínio, SEO, analytics, ajustes, publicação | Pago |

**12. Por que isso deixa a máquina mais inteligente**

```
              SITE ATUAL
                  ↓
          "Encontramos isso"
                  ↓
           PROBLEMA VISÍVEL
                  ↓
       "Podemos melhorar isso"
                  ↓
        DEMONSTRAÇÃO GRATUITA
                  ↓
        CLIENTE VÊ O RESULTADO
                  ↓
              "QUERO"
                  ↓
              CONTRATO
```

Vantagem extra: se a pessoa não gostar da demonstração, você descobre rapidamente que o problema está na oferta/design — sem ter vendido uma promessa abstrata.

O segredo será **controlar muito bem o custo de gerar cada demonstração** e não deixar a automação produzir trabalho completo para leads que não demonstraram interesse.

---

# Variações de abordagem (ângulos de oferta)

Mesmo princípio: não vender "IA" nem "site" — encontrar um problema real, mostrar o problema e entregar uma prova visual de que pode ficar melhor.

### 1. "Seu site no celular"

Talvez uma das melhores. Empresas cujo site funciona mal no celular:

> "Analisamos rapidamente o site de vocês pelo celular e encontramos alguns pontos que podem estar dificultando o contato dos clientes. Podemos te mostrar exatamente o que encontramos?"

Depois mostra 2–3 problemas e oferece uma demonstração. **Por que funciona:** extremamente concreto e fácil de demonstrar.

### 2. "Antes e depois"

> "Encontramos alguns pontos que poderiam ser melhorados no site de vocês e montamos uma ideia de como ele poderia ficar."

Transforma a venda em comparação visual. **Potencial: ⭐⭐⭐⭐⭐**

### 3. "Perda de clientes"

Em vez de "seu site está desatualizado", procure problemas de conversão: telefone difícil de encontrar, WhatsApp escondido, formulário quebrado, serviço difícil de localizar, endereço difícil de encontrar, ausência de CTA, site confuso no celular.

> "Encontramos alguns pontos no site que podem estar dificultando que um visitante entre em contato com vocês."

Muito melhor do que chamar o site de feio.

### 4. "Teste de 30 segundos"

Um pequeno sistema que analisa o site e gera um diagnóstico:

```
Experiência mobile: 4/10
Contato:            5/10
Velocidade:         6/10
Navegação:          4/10
Conversão:          3/10
```

> "Identificamos 4 pontos que poderiam ser melhorados. Se quiser, podemos mostrar uma versão alternativa."

Aparência muito mais profissional.

### 5. "Seu concorrente está melhor"

Poderosa, mas usar com cuidado. Compare experiência mobile, clareza da oferta, botão de contato, velocidade, apresentação dos serviços e aparência entre a empresa e concorrentes locais:

> "Fizemos uma comparação rápida da presença digital de algumas empresas do segmento e encontramos algumas oportunidades no site de vocês."

Não diga "seu concorrente é melhor" — gera resistência.

### 6. "Página inicial gratuita"

Em vez de reconstruir o site inteiro: *"podemos refazer somente a página inicial como demonstração."* Reduz MUITO o custo.

```
Site atual → Homepage nova → Deploy → Link → Cliente compara
```

Se gostar: *"podemos aplicar o mesmo padrão ao restante do site."* Provavelmente uma das primeiras coisas a testar.

### 7. "Landing page de uma campanha"

Em vez de reconstruir tudo: *"criamos uma página específica para divulgar [serviço/produto] de forma mais direta."* Ex.: clínica odontológica com site antigo → landing page moderna para implante dentário. Mais fácil de vender porque conecta o site diretamente a uma oferta comercial.

### 8. "Página de WhatsApp"

Para empresas que dependem bastante de WhatsApp, uma página cujo objetivo é `VISITANTE → WHATSAPP`, com serviço, benefícios, localização, fotos, avaliações, botão WhatsApp e CTA.

Você vende: *"uma página feita para transformar visitantes em conversas no WhatsApp."* Muito mais orientado a resultado.

### 9. "Google → WhatsApp"

```
Google → Site → Entende o serviço em poucos segundos → Confia → WhatsApp
```

Você analisa se o site atual consegue fazer isso. Se não:

> "Encontramos alguns pontos que podem estar fazendo o visitante desistir antes de entrar em contato."

### 10. "Site que parece de 2015"

Campanha específica para empresas com aparência extremamente antiga, sem ser ofensivo:

> "Estamos fazendo uma análise de presença digital de empresas do segmento e encontramos alguns sites que poderiam ganhar uma atualização importante de experiência e visual."
>
> "Se fizer sentido para vocês, podemos preparar uma versão demonstrativa sem custo."

### 11. "Site + Google Maps"

Analise não só o site: `Google → Site → WhatsApp → Localização`. Encontre inconsistências — telefone diferente, horário diferente, endereço diferente, site antigo, link quebrado, informações incompletas.

> "Encontramos algumas informações que poderiam ser melhor organizadas entre o Google e o site."

### 12. "Site que não transmite o tamanho da empresa"

Abordagem mais psicológica. Empresa excelente (muitos clientes, boas avaliações, anos de mercado) com site horrível:

> "A empresa de vocês parece muito mais profissional do que o site atual transmite."

Funciona bem porque você não ataca a empresa — diz que o site não representa a qualidade dela.

### 13. "Site antigo → site premium"

Empresas com ticket alto: arquitetos, advogados, clínicas, imobiliárias, consultorias, empresas B2B. Aparência e confiança importam muito. O argumento vira:

> "A ideia é fazer o site transmitir o mesmo nível de profissionalismo que vocês já entregam."

### 14. "Site específico para mobile"

Produto separado — **Mobile Upgrade**. Não mexe no desktop inicialmente:

> "Identificamos problemas na experiência mobile e criamos uma versão otimizada para celular."

Reduz o trabalho inicial e facilita muito a demonstração.

### 15. "Auditoria + demonstração" (estrutura favorita)

```
GRÁTIS
  ↓
Diagnóstico
  ↓
Demonstração
  ↓
ENTRADA
  ↓
Site completo
  ↓
RECORRÊNCIA
  ↓
Manutenção / melhorias
```

### 16. Manutenção automática (ideia ainda melhor)

Depois de entregar o site, não encerre a relação. Venda um **"plano de evolução"** mensal: pequenas alterações, novas fotos, novos serviços, ajustes, melhorias mobile, SEO básico, monitoramento, correção de links, atualizações.

O negócio deixa de ser "construí um site e acabou" e vira **"tenho uma carteira de empresas pagando mensalmente."**

### 17. Máquina de oportunidades — tipos de lead

| Tipo | Situação |
| --- | --- |
| A | Site quebrado |
| B | Site muito antigo |
| C | Site ruim no celular |
| D | Site sem CTA |
| E | Site com WhatsApp ruim |
| F | Empresa excelente + site ruim |
| G | Empresa crescendo + site antigo |
| H | Concorrentes com sites melhores |

Cada tipo recebe uma abordagem diferente — muito melhor do que uma mensagem genérica para todos.

### 18. As 5 melhores apostas

1. 🥇 **Empresa boa + site ruim** — "a empresa parece profissional, mas o site não transmite isso."
2. 🥈 **Problema mobile** — "encontramos problemas na experiência pelo celular."
3. 🥉 **Antes/depois** — "encontramos alguns pontos e criamos uma alternativa."
4. **WhatsApp/conversão** — "o visitante encontra dificuldade para entrar em contato."
5. **Homepage demonstrativa** — "refizemos a página inicial como exemplo."

Não tente vender tudo isso ao mesmo tempo. Faça 100 leads de um único segmento, divida em 2–3 abordagens e meça:

**resposta → responsável → interesse → demonstração → pagamento → fechamento**

A partir daí você descobre qual "problema" faz o cliente levantar a mão. É esse problema que deve virar o centro da sua máquina de aquisição.

---

## Estruturação final pretendida (nota do autor)

**Estruturação 100% antes de qualquer lançamento.**

```
Apify (sites antigos, sites com algum problema — não somente erros, mas
conversões para leads que entrarem no site)
        ↓
Colocar isso na automatização com o Claude para ver e fazer testes
feitos por outros modelos, para não haver erro algum
        ↓
Conversa do lead aceita
        ↓
Site automático (utilizando o Obsidian em conjunto)
        ↓
Subir automaticamente para o GitHub Pages (de graça) para visualização
        ↓
Esperar a resposta do cliente
        ↓
Confirmação de que gostaram → eu entro automaticamente
        ↓
NOTIFICAÇÃO para mim (essencial, pois será tudo automático)
```

### Regras de comunicação (não negociáveis)

- Mensagens sempre em forma **amigável** — não podemos parecer automáticos.
- Mensagens **curtas**.
- Falar com o **responsável pela decisão**, não necessariamente com o "dono".
- Provar o problema antes de propor a solução.
- Nunca prometer — mostrar.
