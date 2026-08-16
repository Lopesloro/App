---
title: Checklist — o que falta até a loja
date: 2026-08-12
tags:
  - monta-looks
  - checklist
  - roadmap
tipo: checklist
status: ativo
---

# Checklist — o que falta

Ordem de execução. Cada bloco depende do anterior. Marque `[x]` conforme fechar.

> [!tip] Como usar
> No Obsidian, clicar na caixinha marca sozinho. Os itens em **negrito** são os que travam tudo que vem depois.

---

> [!warning] Decisão do fundador — 16/08/2026
> **Nada será vendido por enquanto.** O bloco 6 (dinheiro) sai do caminho crítico. O app agora faz uma coisa: procurar tipo de roupa, marcar e montar o guarda-roupa. Ver [[09-mercado-sem-venda]].

## ✅ Já está pronto

- [x] Documentação completa (mercado, concorrentes, planos, segurança, backlog, testes)
- [x] Repositório com CI e 5 verificações de segurança automáticas
- [x] Proteção da branch principal (nada entra sem revisão e testes verdes)
- [x] App Expo criado, compila e gera pacote de 4,7 MB
- [x] Cofre de credenciais (Keychain/Keystore) com testes
- [x] Dois visuais completos, trocáveis dentro do app
- [x] **Catálogo com 66 tipos de roupa, com busca sem acento e por apelido**
- [x] **Guarda-roupa: marcar peça, ver o armário por categoria, sem limite**
- [x] **Algoritmo de estilo que aprende no celular, explicável, sem enviar dado**
- [x] **Monetização desligada por chave, com o caminho de volta testado**
- [x] **Code review completo, com 7 dos 8 achados corrigidos**
- [x] 275 testes automatizados, todos passando
- [x] Guardado, funcionando e fora das abas: feed de indicações, detalhe do look, salvar looks, meus looks salvos

---

## 🔴 Bloco 1 — Coisas que só você pode fazer

Nada aqui depende de programação. **Enquanto isso não acontecer, o app não sai do lugar.**

- [ ] **Escolher o nome do app** e conferir se está livre
  - [ ] Consultar no [registro.br](https://registro.br) (domínio)
  - [ ] Consultar no [INPI](https://busca.inpi.gov.br) (marca)
  - [ ] Candidatos atuais: Lookeria, Combinei
- [ ] **Criar conta no [expo.dev](https://expo.dev)** (grátis)
  - [ ] Gerar um token de acesso
  - [ ] Adicionar no GitHub: Settings → Secrets and variables → Actions → novo segredo chamado `EXPO_TOKEN`
  - [ ] Isso liga o build automático e permite instalar o app no celular
- [ ] Liberar espaço no computador — está em 98% cheio, e desenvolvimento mobile precisa de folga
- [ ] Decidir: usar NativeWind? (a documentação pedia, não foi adotado — ver [[features/00-base-do-app/como-funciona|explicação]])
- [ ] Decidir: manter os dois visuais ou escolher um?

---

## 🟠 Bloco 2 — Ver o app funcionando

Depois do Bloco 1.

- [ ] **Ver o app no seu celular** (instruções em [[COMO-VER-O-APP]])
- [ ] Testar os dois visuais no celular, na rua e no sol
- [ ] **Escolher o visual definitivo** (ou manter os dois)
- [ ] Gerar o primeiro build de verdade (`eas build`)
- [ ] Instalar esse build no seu celular e usar por alguns dias

---

## 🟡 Bloco 3 — Backend (o maior pedaço)

**Sem isto, 4 coisas continuam impossíveis:** login, foto, cobrança e sincronizar entre celulares.

- [ ] Definir onde hospedar (recomendado: AWS São Paulo, por causa da LGPD)
- [ ] **Criar a API base** (autenticação, banco de dados, deploy)
- [ ] Cadastro e login com e-mail e senha ([#6](https://github.com/Lopesloro/App/issues/6))
- [ ] Login com Google e Apple ([#7](https://github.com/Lopesloro/App/issues/7))
- [ ] Recuperação de senha ([#8](https://github.com/Lopesloro/App/issues/8))
- [ ] Exclusão de conta com apagamento real dos dados ([#10](https://github.com/Lopesloro/App/issues/10))
- [ ] Trava dos limites de plano no servidor ([#32](https://github.com/Lopesloro/App/issues/32)) — só volta a importar quando a venda religar
- [ ] Proteção contra abuso da API ([#39](https://github.com/Lopesloro/App/issues/39))
- [ ] **Sincronizar o guarda-roupa entre celulares** — hoje trocar de aparelho apaga o armário
- [ ] Recarregar o perfil da usuária ao abrir o app (achado nº 8 do code review — depende de [#6](https://github.com/Lopesloro/App/issues/6))

> [!important] O perfil de estilo é caso à parte
> Sincronizar o guarda-roupa entre celulares é desejável. Sincronizar o **perfil
> de estilo** significa mandar para um servidor o que a usuária gosta de vestir —
> exatamente o que hoje o app não faz, e que é o argumento de privacidade do
> produto ([[09-mercado-sem-venda]]). Se for feito, tem que ser decisão consciente,
> com consentimento separado.

---

## 🟡 Bloco 4 — Fotos (o coração do produto)

Depende do Bloco 3.

- [ ] Armazenamento privado das fotos (Cloudflare R2 ou S3)
- [ ] **Endereços de foto que expiram em 15 minutos** ([#37](https://github.com/Lopesloro/App/issues/37))
- [ ] Criptografia das fotos em trânsito e guardadas ([#35](https://github.com/Lopesloro/App/issues/35))
- [ ] Remover localização da foto antes de enviar
- [ ] Fotografar peça do closet com recorte de fundo ([#11](https://github.com/Lopesloro/App/issues/11))
- [ ] Categorizar peças ([#12](https://github.com/Lopesloro/App/issues/12))
- [ ] Editar e excluir peças ([#13](https://github.com/Lopesloro/App/issues/13))

---

## 🟡 Bloco 5 — O conteúdo

> [!note] Este bloco encolheu
> Ele existia porque o feed de indicações precisava de foto de look para não ser
> uma tela vazia. O feed saiu das abas, e o catálogo de **tipos** de roupa não
> depende de curadoria nenhuma — funciona hoje. O que sobra aqui é o que volta a
> importar quando o feed voltar.

- [ ] Foto de cada tipo de roupa no catálogo — melhora muito o reconhecimento visual
- [ ] Painel de curadoria para publicar as fotos dos looks ([#45](https://github.com/Lopesloro/App/issues/45))
- [ ] Pipeline que gera as imagens dos looks ([#22](https://github.com/Lopesloro/App/issues/22))
- [ ] Cadastrar catálogo real de peças e marcas ([#26](https://github.com/Lopesloro/App/issues/26))
- [ ] Fechar contratos de afiliado com as lojas (Renner, C&A, Amaro, Arezzo…) — só faz sentido com base de usuárias
- [ ] Publicar os primeiros 50–100 looks com foto de verdade

---

## 🟢 Bloco 6 — Dinheiro (congelado por decisão do fundador)

> [!warning] Não comece este bloco ainda
> Nada será vendido por enquanto. Este bloco fica registrado como o caminho de
> volta: o código já existe e é testado ([[features/09-sem-monetizacao/o-que-e|Sem monetização]]),
> falta o mundo real. Religar antes disto mostra preço que ninguém consegue pagar.

- [ ] Base de usuárias que justifique a conversa com varejista
- [ ] Criar conta na [RevenueCat](https://revenuecat.com)
- [ ] Cadastrar os produtos nas lojas: `medium_mensal` R$ 19,90 e `premium_mensal` R$ 24,90
- [ ] Ligar a compra dentro do app ([#30](https://github.com/Lopesloro/App/issues/30))
- [ ] Paywall com os planos funcionando ([#31](https://github.com/Lopesloro/App/issues/31))
- [ ] Aplicar os limites por plano de verdade ([#32](https://github.com/Lopesloro/App/issues/32))
- [ ] Cancelamento sem pegadinha ([#33](https://github.com/Lopesloro/App/issues/33))
- [ ] Testar compra em modo sandbox e registrar
- [ ] Trocar `MONETIZACAO_ATIVA` para `true` em `src/lib/flags.ts` — **último passo, não o primeiro**

---

## 🟢 Bloco 7 — Obrigações legais (antes de qualquer usuária real)

> [!warning] Não pule este bloco
> Se vazar foto de usuária sem isto pronto, o problema não é técnico — é jurídico.

- [ ] **Política de privacidade** escrita e publicada ([#36](https://github.com/Lopesloro/App/issues/36))
- [ ] Termos de uso
- [ ] Tela de consentimento no cadastro, separada para foto
- [ ] Nomear um encarregado de dados (DPO)
- [ ] Relatório de impacto (RIPD)
- [ ] Exportar dados da usuária quando ela pedir ([#38](https://github.com/Lopesloro/App/issues/38))
- [ ] Registro de quem acessou foto de usuária ([#40](https://github.com/Lopesloro/App/issues/40))
- [ ] Abrir CNPJ (as lojas de aplicativo exigem para receber)

---

## 🟢 Bloco 8 — Testar de verdade

- [ ] Escrever os testes de tela (Maestro) — hoje nenhuma tela tem teste automático
- [ ] Rodar o verificador de segurança no aplicativo pronto (MobSF)
- [ ] Rodar o verificador de segurança na API (OWASP ZAP)
- [ ] Testar que a foto some mesmo quando a conta é excluída
- [ ] Testar que o endereço da foto expira
- [ ] **Teste com 5 a 8 mulheres do público-alvo** — sentar do lado e observar
  - [ ] Elas acham no catálogo as peças que têm de verdade? (cada busca vazia é peça faltando)
  - [ ] O estilo que o app diz bate com o que elas diriam de si mesmas?
  - [ ] Elas entendem e confiam na frase "calculado no seu celular"?
- [ ] Medir se a lista de roupas rola lisa num Android baratinho
- [ ] **Auditoria de segurança independente** (a automatizada falhou por limite de conta e nunca rodou)

---

## 🔵 Bloco 9 — Lançar

- [ ] Beta fechado com 50 a 200 mulheres (TestFlight e Play Interno)
- [ ] Corrigir o que o beta apontar
- [ ] Ícone e tela de abertura definitivos
- [ ] Textos e prints para a página nas lojas
- [ ] Enviar para revisão da Apple e do Google
- [ ] Página de divulgação na web (Next.js)
- [ ] Primeira campanha com nano influenciadoras

---

## ⚫ Dívidas técnicas (não travam nada, mas não esqueça)

- [ ] Remover a exceção do `image-size` quando o Expo atualizar ([#62](https://github.com/Lopesloro/App/issues/62))
- [ ] Voltar o CI para `npm ci` ([#63](https://github.com/Lopesloro/App/issues/63))
- [ ] Exigir aprovação de revisor no PR quando entrar o segundo desenvolvedor
- [ ] Embarcar as fontes de cada visual (hoje usa a fonte do sistema)
- [ ] Observabilidade e relatório de erro ([#49](https://github.com/Lopesloro/App/issues/49))

---

## Resumo honesto do estado

| Pergunta | Resposta |
|---|---|
| O app existe? | Sim, compila e navega |
| Dá para usar? | **Sim, de verdade** — procurar roupa, marcar e montar o guarda-roupa funciona sem servidor, sem internet e sem parceiro |
| Alguém já viu num celular? | **Não** |
| Dá para ganhar dinheiro hoje? | Não, e por decisão — nada será vendido por enquanto |
| Dá para cadastrar usuária? | Não — falta backend. O app funciona sem conta, mas o armário fica só neste celular |
| O algoritmo de estilo funciona? | Faz o que foi projetado (43 testes). **Se o projeto está certo, só o teste com usuárias responde** |
| Está seguro? | A base está bem construída, e o algoritmo não envia dado nenhum — mas **nunca foi auditada por terceiro** |

**O que trava mais coisa:** conta Expo (Bloco 1). Sem ela, ninguém viu o app num
celular ainda — e o app agora tem algo de verdade para ser visto.

Ver o app hoje: [[COMO-VER-O-APP]] · Features prontas: [[features/README]] · Índice: [[00-INDEX]]
