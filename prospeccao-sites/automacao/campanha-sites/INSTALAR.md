# Pasta pronta — é só copiar e rodar

Tudo nesta pasta vai para a pasta do seu **wpp-server**. Nada precisa ser editado
além da chave do Gemini.

## O que tem aqui

| Arquivo | O que é |
|---|---|
| `leads-sites.csv` | **194 leads reais** de São Paulo, prontos na fila |
| `leads-sites.xlsx` | A mesma lista em planilha, com filtro e resumo |
| `oferta-sites.json` | As mensagens — 8 variações + regras do pitch |
| `config-sites.json` | Ritmo: 25 min, delay até 3 min, janela 9h–18h |
| `aplicar-patch-variacoes.cjs` | Liga o sorteio das 8 variações no server.js |
| `FALAS.md` | **Todas** as falas que o robô pode dizer |

## Passo a passo (5 minutos)

```bash
# 1. copiar tudo para a pasta do wpp-server
cp leads-sites.csv oferta-sites.json config-sites.json /caminho/do/wpp-server/

# 2. ligar as variações no motor (faz backup sozinho, roda quantas vezes quiser)
node aplicar-patch-variacoes.cjs /caminho/do/wpp-server/server.js

# 3. colocar a chave do Gemini
#    abrir config-sites.json e trocar COLE_A_CHAVE_AQUI

# 4. subir o motor da campanha
cd /caminho/do/wpp-server
CAMPANHA=sites node server.js          # porta 21468
```

## Parear o WhatsApp

Depois do passo 4, o QR aparece de duas formas:

- **arquivo:** `qr-sites.png` na pasta do wpp-server — abre e escaneia
- **navegador:** `http://localhost:21468/qr.png`

No celular: **WhatsApp → Aparelhos conectados → Conectar um aparelho**.

Confirme que pareou: `http://localhost:21468/status` deve mostrar `connected`.

## Testar no seu número (antes de qualquer lead)

```bash
curl http://localhost:21468/test
```

Isso monta a mensagem **do próximo lead real da fila** e manda para o **seu**
número (`myNumber` do config = 5519998334896). Nenhum lead é marcado como
enviado. Você vê exatamente o que a empresa veria.

Para ver o pitch (etapa 2) sem enviar nada:

```bash
curl "http://localhost:21468/test-pitch?resposta=Sou%20eu%20sim"
```

## Só então ligar de verdade

Com o teste OK, edite `config-sites.json`:

```json
"autopilot": true
```

O motor relê o arquivo sozinho — não precisa reiniciar.

## Acompanhar

- `http://localhost:21468/status` — estado e o que ele está fazendo agora
- `http://localhost:21468/leads` — quantos já receberam mensagem
- `state-sites.json` — estado de cada lead

## Se precisar parar na hora

Troque `"autopilot": false` no config. Efeito imediato, sem reiniciar.
