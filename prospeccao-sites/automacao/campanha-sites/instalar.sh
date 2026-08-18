#!/usr/bin/env bash
# Instala a campanha "sites" no wpp-server. Roda no macOS e no Linux.
#
#   bash instalar.sh                      # procura o wpp-server sozinho
#   bash instalar.sh /caminho/do/servidor # ou aponte a pasta direto
#
# Nao sobrescreve nada sem avisar: faz backup de tudo que substitui.

set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
azul() { printf '\033[1;36m%s\033[0m\n' "$1"; }
ok()   { printf '\033[1;32m✓\033[0m %s\n' "$1"; }
erro() { printf '\033[1;31m✗\033[0m %s\n' "$1" >&2; }

azul "== Instalador da campanha sites =="
echo

# ---------- 1. achar a pasta do wpp-server ----------
DESTINO="${1:-}"

if [ -z "$DESTINO" ]; then
  echo "Procurando o wpp-server no seu computador..."
  # procura server.js dentro de alguma pasta com 'wpp' no caminho
  CANDIDATOS=$(find "$HOME" -maxdepth 6 -name 'server.js' -path '*wpp*' -not -path '*/node_modules/*' 2>/dev/null | head -5 || true)
  if [ -z "$CANDIDATOS" ]; then
    # tenta achar pelo package.json que usa wppconnect
    CANDIDATOS=$(grep -rl 'wppconnect' "$HOME" --include=package.json --exclude-dir=node_modules -s 2>/dev/null | head -5 | sed 's#/package.json##' | sed 's#$#/server.js#' || true)
  fi

  TOTAL=$(printf '%s' "$CANDIDATOS" | grep -c . || true)
  if [ "$TOTAL" = "0" ]; then
    erro "Nao encontrei o wpp-server neste computador."
    echo
    echo "Ele esta no seu repositorio privado 'nada', em BACKUP-PC-ANTIGO/wpp-server."
    echo "Para trazer para ca:"
    echo
    echo "  git clone https://github.com/Lopesloro/nada.git ~/nada"
    echo "  cp -R ~/nada/BACKUP-PC-ANTIGO/wpp-server ~/wpp-server"
    echo "  cd ~/wpp-server && npm install"
    echo
    echo "Depois rode de novo:  bash instalar.sh ~/wpp-server"
    exit 1
  fi

  DESTINO=$(printf '%s' "$CANDIDATOS" | head -1 | xargs dirname)
  ok "Encontrei: $DESTINO"
  if [ "$TOTAL" -gt 1 ]; then
    echo "  (havia mais de um; usei o primeiro. Se for outro, rode: bash instalar.sh /a/pasta/certa)"
  fi
fi

if [ ! -f "$DESTINO/server.js" ]; then
  erro "Nao existe server.js em: $DESTINO"
  exit 1
fi
echo

# ---------- 2. copiar os arquivos da campanha ----------
CARIMBO=$(date +%Y%m%d-%H%M%S)
for arquivo in leads-sites.csv oferta-sites.json config-sites.json; do
  if [ -f "$DESTINO/$arquivo" ]; then
    cp "$DESTINO/$arquivo" "$DESTINO/$arquivo.bak-$CARIMBO"
    echo "  (backup do $arquivo antigo salvo)"
  fi
  cp "$AQUI/$arquivo" "$DESTINO/$arquivo"
  ok "copiado: $arquivo"
done
echo

# ---------- 3. ligar as 8 variacoes no motor ----------
node "$AQUI/aplicar-patch-variacoes.cjs" "$DESTINO/server.js"
echo

# ---------- 4. dependencias ----------
if [ ! -d "$DESTINO/node_modules" ]; then
  echo "Instalando dependencias do motor (demora um pouco)..."
  (cd "$DESTINO" && npm install --no-audit --no-fund)
  ok "dependencias instaladas"
else
  ok "dependencias ja instaladas"
fi
echo

# ---------- 5. conferir a chave do Gemini ----------
if grep -q 'COLE_A_CHAVE_AQUI' "$DESTINO/config-sites.json"; then
  CHAVE_ANTIGA=""
  [ -f "$DESTINO/gemini-key.txt" ] && CHAVE_ANTIGA=$(tr -d '\n' < "$DESTINO/gemini-key.txt" || true)
  if [ -n "$CHAVE_ANTIGA" ] && [ "${CHAVE_ANTIGA:0:4}" != "COLE" ]; then
    # o motor le gemini-key.txt automaticamente; nao precisa colar no config
    ok "chave do Gemini encontrada em gemini-key.txt (o motor usa ela sozinho)"
  else
    erro "FALTA A CHAVE DO GEMINI"
    echo "  Abra $DESTINO/config-sites.json e troque COLE_A_CHAVE_AQUI pela sua chave,"
    echo "  ou salve a chave em $DESTINO/gemini-key.txt"
    echo "  (a etapa 1 funciona sem ela; so o pitch da etapa 2 precisa)"
  fi
fi
echo

azul "== Pronto. Agora rode: =="
echo
echo "  cd \"$DESTINO\""
echo "  CAMPANHA=sites node server.js"
echo
echo "Depois, em outra aba do terminal:"
echo "  open \"$DESTINO/qr-sites.png\"        # QR para parear o WhatsApp"
echo "  curl http://localhost:21468/status    # tem que dizer connected"
echo "  curl http://localhost:21468/test      # manda a mensagem no SEU numero"
echo
echo "So depois do teste chegar certo, edite config-sites.json: autopilot: true"
