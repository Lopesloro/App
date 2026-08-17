# Referências de design

Este arquivo alimenta a variação visual das demos — a regra é **nunca sair tudo da mesma base**.

## Como funciona

- `referencias-design.json` define as **variantes** (direção visual + tokens).
- O analisador atribui uma variante a cada lead de forma **determinística** (hash do domínio): o mesmo lead sempre recebe a mesma variante, e leads diferentes se espalham entre as variantes.
- Em lote, a distribuição evita repetir a mesma variante em sequência.
- Na hora de gerar a demo (pipeline da nota `05-producao-claude-code`), a variante do lead vira a instrução de design do Claude Code: paleta, tipografia, layout e tom + os links de referência.

## Como adicionar os links do fundador

1. Abra `referencias-design.json`.
2. Encontre a variante com a cara mais parecida com o link recebido.
3. Adicione a URL no array `links` da variante.
4. Se o link não encaixa em nenhuma variante, **crie uma variante nova** (copie o formato, invente um `id` `vNN-nome-curto`) — mais variantes = mais diversidade entre demos.

> Um link por linha do array. O relatório de cada lead marca "aguardando links" enquanto a variante sorteada estiver vazia.
