---
title: Integração com o wpp-server
date: 2026-08-17
tags:
  - prospeccao-sites
  - whatsapp
  - integracao
tipo: nota
status: integrado
---

# Integração com o wpp-server existente

> [!summary] Em uma frase
> O fundador **já tinha** um motor de prospecção por WhatsApp funcionando (wppconnect + express, com trava anti-ban); em vez de construir outro, a nossa pipeline agora alimenta esse motor.

## ✅ O que foi feito neste assunto (17/08/2026)

- [x] Motor localizado no repositório privado `Lopesloro/nada`, em `BACKUP-PC-ANTIGO/wpp-server`.
- [x] Contrato do motor lido direto do código (não suposto) e documentado abaixo.
- [x] **Exportador de leads** (`src/integracao/wpp-server.ts`): converte os leads analisados no `leads-<campanha>.csv` exato que o motor consome, ordenado por score (pior site primeiro).
- [x] **Campanha "sites"** criada (`campanha-sites/`): `oferta-sites.json` com as mensagens e `config-sites.json` com limites conservadores.
- [x] Cliente HTTP para `/status` e `/send` (usado para mandar o link da demo).
- [x] 7 testes da integração; suíte total em **43 verdes**.

## O motor (como ele funciona)

| Item | Valor |
|---|---|
| Stack | `@wppconnect-team/wppconnect` + Express |
| Porta | 21465 (padrão) · **21468** (campanha) |
| Campanhas | `CAMPANHA=sites node server.js` → usa `leads-sites.csv`, `config-sites.json`, `oferta-sites.json`, `state-sites.json`, sessão isolada |
| Endpoints | `GET /status` · `GET /qr.png` · `POST /send` · `GET /leads` · `GET /test` · `GET /test-pitch` |
| Etapa 1 | Saudação **determinística** (template, zero IA) |
| Etapa 2 | Pitch com Gemini, disparado **só quando o lead responde** |
| Estado | `state-<campanha>.json`, por lead (`saudacao_enviada` → `pitch_enviado`) |

> [!important] Anti-ban já resolvido pelo motor
> Janela de horário, limite diário (8), intervalo entre envios (60–75 min) e atraso aleatório por mensagem. A trava de intervalo é gravada **antes** do envio, então falha de rede não libera disparo rápido. **Não mexer nesses números** — é o que protege a conta.

## Colunas do CSV (ordem fixa)

```
ID,NOME,WHATSAPP,NICHO,CATEGORIA,CIDADE,PAIS,NOTA,AVALIACOES,STATUS,DATA_ENVIO,NUMERO_USADO,MENSAGEM_ENVIADA
```

Lead sem WhatsApp válido é descartado na exportação (o motor pularia a linha de qualquer forma). Números brasileiros sem DDI recebem `55` automaticamente.

## Como ligar a campanha

```bash
# 1. copiar a campanha para a pasta do motor
cp campanha-sites/oferta-sites.json campanha-sites/config-sites.json <pasta-do-wpp-server>/
# 2. preencher geminiKey no config-sites.json
# 3. exportar a fila de leads analisados  →  leads-sites.csv
# 4. subir o motor
CAMPANHA=sites node server.js        # porta 21468
# 5. parear (abrir qr-sites.png), testar com /test e só então autopilot: true
```

## O que ainda falta ligar

- [ ] Coleta Apify → exportador → `leads-sites.csv` (falta rodar a coleta).
- [ ] Gancho no estado `quer_ver` para disparar extração do site antigo + geração da demo.
- [ ] Envio automático do link da demo pelo `POST /send` após a verificação de publicação ([[06-deploy-e-demonstracao]]).

> [!warning] Observação de segurança
> `gemini-key.txt` e a `geminiKey` do `config.json` estão **commitados** no repositório `nada`. Ele é privado, então não há exposição pública — mas se um dia virar público, ou for compartilhado, essa chave vaza junto. Vale trocar a chave e passar a lê-la de variável de ambiente.

## Relacionado

[[00-INDEX-prospeccao]] · [[04-conversas-whatsapp]] · [[12-automacao]] · [[06-deploy-e-demonstracao]]
