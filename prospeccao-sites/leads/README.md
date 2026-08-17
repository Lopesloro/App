# Leads analisados

Cada site analisado pela automação vira uma nota nesta pasta, gerada por `automacao/src/relatorio.ts`: score com evidências, variante de design reservada e o checklist do funil daquele lead.

- Gerar: `cd ../automacao && npm run analisar -- <url> --nome "Empresa"` (ou `npm run lote -- lista.txt`).
- A nota `EXEMPLO-clinica-ficticia.com.br.md` é **fictícia**, gerada só para mostrar o formato.
- Faixas: ⚪ ignorar · 🟡 talvez · 🟢 prospectar · 🔴 prioridade máxima ([[03-score-de-qualidade]]).
- A checklist de cada nota é o estado vivo do lead no funil ([[02-funil-de-vendas]]) — marcar conforme avança.
