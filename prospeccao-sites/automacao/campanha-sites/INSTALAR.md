# Pasta pronta — é só copiar e rodar

Tudo nesta pasta vai para a pasta do seu **wpp-server**.

## Instalação em um comando

No seu Mac, abra o Terminal e cole:

```bash
git clone -b claude/ideias-principais-obsidian-x6l6z4 https://github.com/Lopesloro/App.git ~/prospeccao
cd ~/prospeccao/prospeccao-sites/automacao/campanha-sites
bash instalar.sh
```

O `instalar.sh` procura o wpp-server sozinho, copia os arquivos (com backup do
que já existia), liga as 8 variações no motor e instala as dependências.

Se ele não achar o servidor, é porque este Mac não tem o wpp-server ainda — o
que existe é o backup no repositório `nada`. Nesse caso:

```bash
git clone https://github.com/Lopesloro/nada.git ~/nada
cp -R ~/nada/BACKUP-PC-ANTIGO/wpp-server ~/wpp-server
cd ~/wpp-server && npm install
cd ~/prospeccao/prospeccao-sites/automacao/campanha-sites
bash instalar.sh ~/wpp-server
```

## O que tem nesta pasta

| Arquivo | O que é |
|---|---|
| `leads-sites.csv` | **194 leads reais** de São Paulo, prontos na fila |
| `leads-sites.xlsx` | A mesma lista em planilha, com filtro e resumo |
| `oferta-sites.json` | As mensagens — 8 variações + regras do pitch |
| `config-sites.json` | Ritmo: 25 min, delay até 3 min, janela 9h–18h |
| `instalar.sh` | Instala tudo sozinho |
| `aplicar-patch-variacoes.cjs` | Liga o sorteio das 8 variações no server.js |
| `FALAS.md` | **Todas** as falas que o robô pode dizer |

## Subir o motor

```bash
cd ~/wpp-server               # ou a pasta que o instalar.sh mostrou
CAMPANHA=sites node server.js
```

## Parear o WhatsApp

Em outra aba do terminal:

```bash
open ~/wpp-server/qr-sites.png
```

No celular: **WhatsApp → Aparelhos conectados → Conectar um aparelho**.

Confirme: `curl http://localhost:21468/status` deve dizer `connected`.

## Testar no seu número (antes de qualquer lead)

```bash
curl http://localhost:21468/test
```

Monta a mensagem do **próximo lead real da fila** e manda para o **seu** número
(`myNumber` = 5519998334896). Nenhum lead é marcado como enviado.

Ver o pitch da etapa 2 sem enviar nada:

```bash
curl "http://localhost:21468/test-pitch?resposta=Sou%20eu%20sim"
```

## Só então ligar de verdade

Com o teste OK, edite `config-sites.json`:

```json
"autopilot": true
```

O motor relê sozinho — não precisa reiniciar.

## Acompanhar

- `curl http://localhost:21468/status` — o que ele está fazendo agora
- `curl http://localhost:21468/leads` — quantos já receberam mensagem

## Parar na hora

Troque para `"autopilot": false`. Efeito imediato.
