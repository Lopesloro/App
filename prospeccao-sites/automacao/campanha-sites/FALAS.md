# Todas as falas da campanha "sites"

Tudo que o robô pode dizer está aqui. Nada fora desta lista sai no WhatsApp.

---

## Etapa 1 — Primeira mensagem (SEM IA, sorteada entre 8 variações)

O robô sorteia uma destas a cada lead. Zero tokens gastos. `{SAUDACAO}` vira
"Bom dia" / "Boa tarde" / "Boa noite" conforme a hora.

1. `{SAUDACAO}! Aqui é o Gabriel. Falo com o responsável pelo site da {EMPRESA}?`
2. `{SAUDACAO}, tudo bem? Meu nome é Gabriel. Você cuida do site da {EMPRESA}?`
3. `{SAUDACAO}! Gabriel falando. Quem cuida do site da {EMPRESA} por aí?`
4. `{SAUDACAO}, tudo certo? Aqui é o Gabriel. Consigo falar com quem responde pelo site da {EMPRESA}?`
5. `{SAUDACAO}! Sou o Gabriel. Estou tentando falar com o responsável pelo site da {EMPRESA}, é você mesmo?`
6. `{SAUDACAO}, tudo bem? Gabriel aqui. Você é a pessoa certa pra falar sobre o site da {EMPRESA}?`
7. `{SAUDACAO}! Aqui é o Gabriel. Uma pergunta rápida: quem cuida do site da {EMPRESA}?`
8. `{SAUDACAO}, tudo bom? Me chamo Gabriel. Falo com você sobre o site da {EMPRESA}?`

**Por que 8 e não 1:** mandar a mesma frase 20 vezes por dia é o padrão que faz
o WhatsApp marcar a conta como spam. Variar é proteção da conta, não estética.

### Como sai de verdade (primeiros 8 leads da fila, 9h da manhã)

| # | Empresa | Mensagem |
|---|---|---|
| 1 | Pró Estética Vila Mariana | Bom dia! Aqui é o Gabriel. Falo com o responsável pelo site da Pró Estética Vila Mariana? |
| 2 | Sorridents Tatuapé | Bom dia, tudo bem? Meu nome é Gabriel. Você cuida do site da Sorridents Clínicas Odontológicas Tatuapé? |
| 3 | Clínica Pró Estética Vila Leopoldina | Bom dia! Gabriel falando. Quem cuida do site da Clínica Pró Estética Vila Leopoldina por aí? |
| 4 | Mitras Estética | Bom dia, tudo certo? Aqui é o Gabriel. Consigo falar com quem responde pelo site da Mitras Estética? |
| 5 | Robson Dantas Advocacia | Bom dia! Sou o Gabriel. Estou tentando falar com o responsável pelo site da Robson Dantas Advocacia, é você mesmo? |
| 6 | Campos Advocacia | Bom dia, tudo bem? Gabriel aqui. Você é a pessoa certa pra falar sobre o site da Campos Advocacia Especializada? |
| 7 | Edimar Ruiz Advogado | Bom dia! Aqui é o Gabriel. Uma pergunta rápida: quem cuida do site da Edimar Ruiz Advogado Unidade Tatuapé? |
| 8 | Iara Imobiliária | Bom dia, tudo bom? Me chamo Gabriel. Falo com você sobre o site da Iara Imobiliária Zona Leste? |

---

## Etapa 2 — Pitch (COM IA, só depois que o lead responde)

A IA escreve na hora, mas dentro de regras fixas. **Nunca** sai nada fora disso:

- No máximo 4 linhas
- Tom humano, jamais linguagem de propaganda
- Cita **um** problema concreto do site — provar, não opinar
- Oferece a demonstração da **página inicial**, sem custo e sem compromisso
- Diz explicitamente que, se não fizer sentido, é só falar
- Termina com pergunta de sim/não
- **Nunca** fala preço, prazo, contrato ou tecnologia
- **Nunca** promete site completo
- **Nunca** chama o site de feio ou velho

### Exemplos do que a IA vai produzir

> Obrigado pelo retorno! Dei uma olhada no site de vocês pelo celular e o botão
> de contato fica difícil de achar — provavelmente algumas pessoas desistem antes
> de chamar. Posso preparar uma versão demonstrativa da página inicial pra você
> comparar, sem custo e sem compromisso? Se não fizer sentido, é só me dizer.

> Que bom falar com você! Reparei que o site de vocês demora bastante pra abrir
> no celular, e isso costuma fazer o visitante desistir antes de ver os serviços.
> Posso montar uma demonstração de como a página inicial poderia ficar? É sem
> custo, e se não gostar tudo bem.

> Legal, obrigado! Olhando o site pelo celular, o menu fica meio apertado e a
> pessoa demora pra achar o WhatsApp. Se quiser, preparo uma versão demonstrativa
> da página inicial pra você ver a diferença — sem custo nenhum. Faz sentido?

---

## Etapa 3 — Envio da demonstração

> Pronto! Fiz uma demonstração de como a página inicial poderia ficar: **{LINK}**
>
> Dá uma olhada pelo celular também. O que achou?

O link só é enviado **depois** que a página publicada passa no QA de 12 itens.

---

## Etapa 4 — PARADA

Quando o lead disser se **gostou ou não** da demonstração, o robô **para de
responder** e avisa o Gabriel. Dali em diante quem fala é você.

---

## Ritmo dos envios

| Item | Valor |
|---|---|
| Intervalo entre mensagens | **25 minutos** |
| Atraso aleatório antes de cada envio | **20s a 3 minutos** |
| Janela de horário | 9h às 18h |
| Máximo por dia | 20 mensagens |
| Variações da 1ª mensagem | 8 |
