# Todas as falas da campanha "sites"

> **Regra do fundador (18/08): o robô NUNCA se apresenta pelo nome e NUNCA cita marca.**
> Nada de "aqui é o Gabriel", nada de assinatura, nada de nome de empresa.
> Isso vale nas duas etapas e no fallback — está travado no código, não só no texto.

---

## Etapa 1 — Primeira mensagem (SEM IA, sorteada entre 8 variações)

O robô sorteia uma destas a cada lead. Zero tokens. `{SAUDACAO}` vira
"Bom dia" / "Boa tarde" / "Boa noite" conforme a hora.

1. `{SAUDACAO}! Falo com o responsavel pelo site da {EMPRESA}?`
2. `{SAUDACAO}, tudo bem? Voce cuida do site da {EMPRESA}?`
3. `{SAUDACAO}! Quem cuida do site da {EMPRESA} por ai?`
4. `{SAUDACAO}, tudo certo? Consigo falar com quem responde pelo site da {EMPRESA}?`
5. `{SAUDACAO}! Voce e a pessoa certa pra falar sobre o site da {EMPRESA}?`
6. `{SAUDACAO}, tudo bem? Uma pergunta rapida: quem cuida do site da {EMPRESA}?`
7. `{SAUDACAO}! Voces tem alguem que cuida do site da {EMPRESA}?`
8. `{SAUDACAO}, tudo bom? Falo com voce sobre o site da {EMPRESA}?`

**Por que 8 e não 1:** mandar a mesma frase 20 vezes por dia é o padrão que faz
o WhatsApp marcar a conta como spam. Variar é proteção da conta.

### Como sai de verdade

| # | Mensagem para "Sorridents Tatuapé", 9h |
|---|---|
| 1 | Bom dia! Falo com o responsavel pelo site da Sorridents Tatuapé? |
| 2 | Bom dia, tudo bem? Voce cuida do site da Sorridents Tatuapé? |
| 3 | Bom dia! Quem cuida do site da Sorridents Tatuapé por ai? |
| 4 | Bom dia, tudo certo? Consigo falar com quem responde pelo site da Sorridents Tatuapé? |
| 5 | Bom dia! Voce e a pessoa certa pra falar sobre o site da Sorridents Tatuapé? |
| 6 | Bom dia, tudo bem? Uma pergunta rapida: quem cuida do site da Sorridents Tatuapé? |
| 7 | Bom dia! Voces tem alguem que cuida do site da Sorridents Tatuapé? |
| 8 | Bom dia, tudo bom? Falo com voce sobre o site da Sorridents Tatuapé? |

---

## Etapa 2 — Pitch (COM IA, só depois que o lead responde)

A IA escreve na hora, dentro destas regras — as duas primeiras são as novas:

- NUNCA se apresentar pelo nome. Nao dizer 'aqui e o fulano', nao assinar no final.
- NUNCA citar nome de empresa, marca ou site proprio.
- Mensagem CURTA — no maximo 4 linhas. Mensagem longa no WhatsApp nao e lida.
- Tom amigavel e humano. Nunca parecer automatico, nunca linguagem de propaganda.
- Agradecer o retorno em uma linha, sem formalidade exagerada.
- Citar UM problema concreto do site — provar, nao opinar.
- Oferecer preparar uma versao demonstrativa da pagina inicial, SEM CUSTO e SEM COMPROMISSO.
- Deixar explicito que, se nao gostar ou nao for o momento, e so dizer — sem problema nenhum.
- Terminar com pergunta simples de sim/nao: 'posso preparar e te mostrar?'
- NUNCA falar de preco, prazo, contrato ou tecnologia (React, IA, GitHub).
- NUNCA prometer site completo — o que se oferece e a demonstracao da pagina inicial.
- Nao chamar o site atual de feio, velho ou ruim. Falar de oportunidade, nao de defeito.
- SEM emoji, sem giria, sem tom de urgencia ou pressao.
- Variar a abertura: nem toda mensagem deve comecar com 'Obrigado pelo retorno'.

### Exemplos do que a IA vai produzir

> Obrigado pelo retorno! Dei uma olhada no site de voces pelo celular e o botao de contato fica dificil de achar — provavelmente algumas pessoas desistem antes de chamar. Posso preparar uma versao demonstrativa da pagina inicial pra voce comparar, sem custo e sem compromisso? Se nao fizer sentido, e so me dizer.

> Que bom falar com voce! Reparei que o site demora bastante pra abrir no celular, e isso costuma fazer o visitante desistir antes de ver os servicos. Posso montar uma demonstracao de como a pagina inicial poderia ficar? E sem custo, e se nao gostar tudo bem.

> Legal, obrigado! Olhando o site pelo celular, o menu fica meio apertado e a pessoa demora pra achar o WhatsApp. Se quiser, preparo uma versao demonstrativa da pagina inicial pra voce ver a diferenca — sem custo nenhum. Faz sentido pra voce?

### Se a IA falhar (fallback)

> Perfeito, obrigado pelo retorno. Trabalho com criação de sites modernos, com foco
> total na experiência pelo celular. Posso preparar uma demonstração, sem custo e sem
> compromisso, para {EMPRESA} ver como ficaria — e se não gostar ou não for o momento,
> é só me dizer, sem problema nenhum. Pode ser?

Sem nome, sem marca, sem link, sem assinatura.

---

## Etapa 3 — Envio da demonstração

> Pronto! Fiz uma demonstracao de como a pagina inicial poderia ficar: {LINK}

Da uma olhada pelo celular tambem. O que achou?

O link só é enviado **depois** que a página publicada passa no QA de 12 itens.

---

## Etapa 4 — PARADA

Quando o lead disser se **gostou ou não** da demonstração, o robô **para de
responder** e avisa você. Dali em diante quem fala é você.

---

## Ritmo dos envios

| Item | Valor |
|---|---|
| Intervalo entre mensagens | **25 minutos** |
| Atraso aleatório antes de cada envio | **20s a 3 minutos** |
| Janela de horário | 9h às 18h |
| Máximo por dia | 20 mensagens |
| Variações da 1ª mensagem | 8 |
| Nome/marca nas mensagens | **nenhum** |
