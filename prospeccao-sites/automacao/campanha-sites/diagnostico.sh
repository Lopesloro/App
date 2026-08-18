#!/usr/bin/env bash
# Mostra, de uma vez, tudo que importa quando a mensagem nao chega.
#   bash diagnostico.sh
PORTA=21468
azul() { printf '\033[1;36m%s\033[0m\n' "$1"; }

azul "== 1. O motor esta rodando? =="
PID=$(lsof -ti:$PORTA 2>/dev/null || true)
if [ -n "$PID" ]; then echo "sim — PID $PID na porta $PORTA"; else echo "NAO. Rode: bash subir.sh"; exit 1; fi
echo

azul "== 2. O WhatsApp esta conectado? =="
STATUS=$(curl -s --max-time 10 "http://localhost:$PORTA/status" || echo '{}')
echo "$STATUS"
if echo "$STATUS" | grep -q '"status":"connected"'; then
  echo "-> conectado"
else
  echo "-> NAO conectado. Precisa parear: bash qr.sh (em outra aba)"
fi
echo

azul "== 3. Que mensagem o motor monta agora? =="
curl -s --max-time 45 "http://localhost:$PORTA/test" || echo "(sem resposta do /test)"
echo; echo

azul "== 4. As saudacoes SEM NOME chegaram na pasta do motor? =="
PASTA=$(lsof -p "$PID" 2>/dev/null | grep -o '/.*wpp-server' | head -1)
[ -z "$PASTA" ] && PASTA="$(dirname "$(lsof -p "$PID" 2>/dev/null | awk '/server.js/{print $NF}' | head -1)")"
echo "pasta do motor: ${PASTA:-nao identificada}"
if [ -n "$PASTA" ] && [ -f "$PASTA/oferta-sites.json" ]; then
  if grep -q 'REMETENTE' "$PASTA/oferta-sites.json"; then
    echo "-> ATENCAO: oferta-sites.json AINDA tem {REMETENTE} (arquivo velho)"
  else
    echo "-> ok: oferta-sites.json sem {REMETENTE}"
  fi
else
  echo "-> oferta-sites.json nao encontrado na pasta do motor"
fi
echo

azul "== 5. O patch que tira o nome foi aplicado no server.js? =="
if [ -n "$PASTA" ] && grep -q '_quemSou' "$PASTA/server.js" 2>/dev/null; then
  echo "-> ok: patch sem-nome aplicado"
else
  echo "-> ATENCAO: patch sem-nome NAO aplicado. Rode: bash instalar.sh"
fi
echo

azul "== 6. Ultimas linhas do log do motor =="
tail -12 "$PASTA/server-sites.out.log" 2>/dev/null || echo "(sem arquivo de log; veja a aba onde o motor esta rodando)"
