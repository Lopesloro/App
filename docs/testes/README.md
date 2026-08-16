# Registro de testes

Regra do projeto: **todo teste executado vira registro em markdown nesta pasta** — manual ou automatizado com execução relevante (sandbox de pagamento, teste de purge, usabilidade etc.).

- Template completo e exemplo preenchido: [`../08-plano-de-testes.md`](../08-plano-de-testes.md)
- Nome do arquivo por sprint: `REGISTRO-TESTES-sprint-XX.md`
- Nome do arquivo avulso: `YYYY-MM-DD-nome-da-feature.md`
- PR sem o registro correspondente = Definition of Done não cumprida (ver [`../07-backlog-github.md`](../07-backlog-github.md), seção 8).

## Registros

| Data | Arquivo | Escopo | Resultado |
|---|---|---|---|
| 2026-08-11 | [`2026-08-11-setup-repositorio.md`](2026-08-11-setup-repositorio.md) | Setup do repositório, CI e proteções (Fase 0, issue #48) | ✅ 10/11 passou, 1 corrigido |
| 2026-08-12 | [`2026-08-12-scaffold-expo.md`](2026-08-12-scaffold-expo.md) | Scaffold Expo + núcleo de segurança (Fase 1, issue #48) | ✅ lint, typecheck e 31 testes verdes; 7 problemas corrigidos |
| 2026-08-16 | [`2026-08-16-desligar-monetizacao.md`](2026-08-16-desligar-monetizacao.md) | Desligar a monetização + 7 correções do code review | ✅ 167 testes verdes |
| 2026-08-16 | [`2026-08-16-guarda-roupa-e-estilo.md`](2026-08-16-guarda-roupa-e-estilo.md) | Catálogo de roupas, guarda-roupa, algoritmo de estilo e telas | ✅ 275 testes, lint e typecheck limpos, pacote de 4,7 MB |
