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

## ✅ Já está pronto

- [x] Documentação completa (mercado, concorrentes, planos, segurança, backlog, testes)
- [x] Repositório com CI e 5 verificações de segurança automáticas
- [x] Proteção da branch principal (nada entra sem revisão e testes verdes)
- [x] App Expo criado, compila e gera pacote de 4,6 MB
- [x] Cofre de credenciais (Keychain/Keystore) com testes
- [x] Feed de indicações com filtros e rolagem infinita
- [x] Detalhe do look com peças e link de compra rastreado
- [x] Salvar looks com limite por plano
- [x] Aba "Meus looks salvos"
- [x] Dois visuais completos, trocáveis dentro do app
- [x] 146 testes automatizados, todos passando

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
- [ ] **Trava dos limites de plano no servidor** ([#32](https://github.com/Lopesloro/App/issues/32)) — hoje o limite pode ser burlado
- [ ] Proteção contra abuso da API ([#39](https://github.com/Lopesloro/App/issues/39))
- [ ] Sincronizar looks salvos entre celulares

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

## 🟡 Bloco 5 — O conteúdo (sem isto o feed é vazio)

- [ ] **Painel de curadoria** para publicar as fotos dos looks ([#45](https://github.com/Lopesloro/App/issues/45))
- [ ] Pipeline que gera as imagens dos looks ([#22](https://github.com/Lopesloro/App/issues/22))
- [ ] Cadastrar catálogo real de peças e marcas ([#26](https://github.com/Lopesloro/App/issues/26))
- [ ] **Fechar contratos de afiliado com as lojas** (Renner, C&A, Amaro, Arezzo…)
  - [ ] Sem isso, os links não geram comissão — hoje são endereços de exemplo
- [ ] Publicar os primeiros 50–100 looks com foto de verdade

---

## 🟢 Bloco 6 — Dinheiro

- [ ] Criar conta na [RevenueCat](https://revenuecat.com)
- [ ] Cadastrar os produtos nas lojas: `medium_mensal` R$ 19,90 e `premium_mensal` R$ 24,90
- [ ] Ligar a compra dentro do app ([#30](https://github.com/Lopesloro/App/issues/30))
- [ ] Paywall com os planos funcionando ([#31](https://github.com/Lopesloro/App/issues/31))
- [ ] Aplicar os limites por plano de verdade ([#32](https://github.com/Lopesloro/App/issues/32))
- [ ] Cancelamento sem pegadinha ([#33](https://github.com/Lopesloro/App/issues/33))
- [ ] Testar compra em modo sandbox e registrar

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
- [ ] Medir se o feed roda liso num Android baratinho
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
| Dá para usar? | Só com dados de exemplo |
| Alguém já viu num celular? | **Não** |
| Dá para ganhar dinheiro hoje? | Não — falta contrato com as lojas e cobrança |
| Dá para cadastrar usuária? | Não — falta backend |
| Está seguro? | A base está bem construída, mas **nunca foi auditada por terceiro** |

**O que trava mais coisa:** conta Expo (Bloco 1) e backend (Bloco 3).

Ver o app hoje: [[COMO-VER-O-APP]] · Features prontas: [[features/README]] · Índice: [[00-INDEX]]
