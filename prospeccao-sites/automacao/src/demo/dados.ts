// Modelo de dados de uma demo + presets por segmento.
// A demo é o nível 2 do funil (nota 07): página inicial completa e bonita,
// com dados reais quando existirem e ilustrativos (marcados) quando não.

export interface Servico {
  nome: string;
  descricao: string;
}

export interface Depoimento {
  texto: string;
  autor: string;
}

export interface DadosDemo {
  nomeEmpresa: string;
  slogan: string;
  descricao: string;
  segmento: string;
  cidade: string;
  /** Dígitos com DDI, ex.: 5511999999999 */
  whatsapp: string;
  telefoneExibicao?: string;
  endereco?: string;
  horario?: string;
  servicos: Servico[];
  depoimentos: Depoimento[];
  anoFundacao?: number;
  dominio: string;
}

export interface PresetSegmento {
  slogan: (nome: string, cidade: string) => string;
  descricao: (nome: string, cidade: string) => string;
  rotuloSegmento: string;
  servicos: Servico[];
  depoimentos: Depoimento[];
}

export const PRESETS: Record<string, PresetSegmento> = {
  clinica: {
    rotuloSegmento: 'Clínica odontológica',
    slogan: () => 'Seu sorriso, cuidado de perto',
    descricao: (nome, cidade) =>
      `A ${nome} atende famílias em ${cidade} com estrutura moderna, atendimento humano e horários que cabem na sua rotina.`,
    servicos: [
      { nome: 'Avaliação completa', descricao: 'Diagnóstico com radiografia digital e plano de tratamento claro, sem surpresas.' },
      { nome: 'Limpeza e prevenção', descricao: 'Profilaxia, aplicação de flúor e orientação para manter o sorriso saudável.' },
      { nome: 'Estética do sorriso', descricao: 'Clareamento, facetas e restaurações com material de última geração.' },
      { nome: 'Urgências', descricao: 'Dor de dente não espera: encaixes no mesmo dia para casos de urgência.' },
    ],
    depoimentos: [
      { texto: 'Atendimento atencioso do começo ao fim. Explicaram cada etapa do tratamento.', autor: 'Paciente da clínica' },
      { texto: 'Consegui horário no sábado e resolvi tudo em duas visitas.', autor: 'Paciente da clínica' },
    ],
  },
  restaurante: {
    rotuloSegmento: 'Restaurante',
    slogan: () => 'Comida de verdade, feita na hora',
    descricao: (nome, cidade) =>
      `O ${nome} traz para ${cidade} receitas preparadas diariamente com ingredientes frescos e um ambiente para toda a família.`,
    servicos: [
      { nome: 'Almoço executivo', descricao: 'Cardápio que muda todo dia, servido rápido para a sua hora de almoço.' },
      { nome: 'Delivery', descricao: 'Peça pelo WhatsApp e receba quentinho no conforto de casa.' },
      { nome: 'Eventos e reservas', descricao: 'Espaço reservado para aniversários, confraternizações e encontros.' },
      { nome: 'Fim de semana', descricao: 'Pratos especiais de sábado e domingo, com opções para compartilhar.' },
    ],
    depoimentos: [
      { texto: 'O melhor custo-benefício da região. Voltamos toda semana.', autor: 'Cliente do restaurante' },
      { texto: 'Delivery rápido e a comida chega impecável.', autor: 'Cliente do restaurante' },
    ],
  },
  oficina: {
    rotuloSegmento: 'Oficina mecânica',
    slogan: () => 'Seu carro em boas mãos',
    descricao: (nome, cidade) =>
      `A ${nome} é referência em ${cidade} em manutenção honesta: diagnóstico transparente, orçamento aprovado antes do serviço e garantia no que fazemos.`,
    servicos: [
      { nome: 'Revisão completa', descricao: 'Check-up com relatório do que precisa agora e do que pode esperar.' },
      { nome: 'Freios e suspensão', descricao: 'Peças de qualidade e serviço com garantia para a sua segurança.' },
      { nome: 'Diagnóstico eletrônico', descricao: 'Scanner de última geração para achar o problema sem trocar peça à toa.' },
      { nome: 'Troca de óleo expressa', descricao: 'Sem agendamento: chegou, trocou, seguiu viagem.' },
    ],
    depoimentos: [
      { texto: 'Explicaram o problema com fotos e só fizeram o que foi aprovado.', autor: 'Cliente da oficina' },
      { texto: 'Preço justo e entregaram no prazo combinado.', autor: 'Cliente da oficina' },
    ],
  },
  imobiliaria: {
    rotuloSegmento: 'Imobiliária',
    slogan: () => 'O imóvel certo, sem complicação',
    descricao: (nome, cidade) =>
      `A ${nome} conecta pessoas e imóveis em ${cidade} com curadoria de verdade: visitas acompanhadas, documentação assessorada e negociação transparente.`,
    servicos: [
      { nome: 'Compra e venda', descricao: 'Avaliação de mercado gratuita e divulgação profissional do seu imóvel.' },
      { nome: 'Locação', descricao: 'Contratos claros, vistoria detalhada e suporte durante toda a locação.' },
      { nome: 'Lançamentos', descricao: 'Condições especiais em lançamentos selecionados da região.' },
      { nome: 'Assessoria completa', descricao: 'Financiamento, documentação e cartório sem dor de cabeça.' },
    ],
    depoimentos: [
      { texto: 'Venderam meu apartamento em 5 semanas, com tudo documentado.', autor: 'Cliente da imobiliária' },
      { texto: 'Encontraram exatamente o que a gente procurava, dentro do orçamento.', autor: 'Cliente da imobiliária' },
    ],
  },
  salao: {
    rotuloSegmento: 'Salão de beleza',
    slogan: () => 'Você, na sua melhor versão',
    descricao: (nome, cidade) =>
      `O ${nome} é o espaço em ${cidade} para cuidar de você: profissionais experientes, produtos de qualidade e horário marcado sem atraso.`,
    servicos: [
      { nome: 'Corte e styling', descricao: 'Cortes femininos e masculinos com consultoria de visagismo.' },
      { nome: 'Coloração', descricao: 'Mechas, luzes e coloração completa com produtos que cuidam do fio.' },
      { nome: 'Tratamentos', descricao: 'Hidratação, reconstrução e cronograma capilar sob medida.' },
      { nome: 'Unhas e estética', descricao: 'Manicure, pedicure e design de sobrancelhas com agendamento fácil.' },
    ],
    depoimentos: [
      { texto: 'Saí do salão me sentindo outra pessoa. Equipe incrível.', autor: 'Cliente do salão' },
      { texto: 'Horário marcado que é respeitado de verdade. Recomendo!', autor: 'Cliente do salão' },
    ],
  },
  advocacia: {
    rotuloSegmento: 'Escritório de advocacia',
    slogan: () => 'Orientação jurídica clara e objetiva',
    descricao: (nome, cidade) =>
      `O ${nome} atende em ${cidade} com uma premissa simples: explicar o seu caso sem juridiquês e defender o seu interesse com estratégia.`,
    servicos: [
      { nome: 'Consulta orientativa', descricao: 'Análise do seu caso com parecer objetivo sobre riscos e caminhos.' },
      { nome: 'Direito trabalhista', descricao: 'Defesa de empregados e empresas em ações e acordos.' },
      { nome: 'Direito de família', descricao: 'Divórcio, guarda, pensão e inventário conduzidos com sensibilidade.' },
      { nome: 'Contratos', descricao: 'Elaboração e revisão de contratos para proteger o que é seu.' },
    ],
    depoimentos: [
      { texto: 'Me explicaram cada etapa do processo em linguagem simples.', autor: 'Cliente do escritório' },
      { texto: 'Atuação firme e sempre disponíveis para responder dúvidas.', autor: 'Cliente do escritório' },
    ],
  },
};

export const SEGMENTO_PADRAO = 'clinica';

/** 5511999999999 → "+55 (11) 99999-9999" (fallback: +dígitos). */
export function formatarTelefone(digitos: string): string {
  const so = digitos.replace(/\D/g, '');
  if (so.startsWith('55') && (so.length === 12 || so.length === 13)) {
    const ddd = so.slice(2, 4);
    const numero = so.slice(4);
    const quebra = numero.length - 4;
    return `+55 (${ddd}) ${numero.slice(0, quebra)}-${numero.slice(quebra)}`;
  }
  return `+${so}`;
}

export function montarDados(parcial: {
  nomeEmpresa: string;
  segmento?: string;
  cidade?: string;
  whatsapp?: string;
  dominio?: string;
  telefoneExibicao?: string;
  endereco?: string;
  horario?: string;
  anoFundacao?: number;
}): DadosDemo {
  const chave = (parcial.segmento ?? SEGMENTO_PADRAO).toLowerCase();
  const preset = PRESETS[chave] ?? PRESETS[SEGMENTO_PADRAO];
  const cidade = parcial.cidade ?? 'sua cidade';
  const whatsappLimpo = (parcial.whatsapp ?? '5500000000000').replace(/\D/g, '');
  return {
    nomeEmpresa: parcial.nomeEmpresa,
    slogan: preset.slogan(parcial.nomeEmpresa, cidade),
    descricao: preset.descricao(parcial.nomeEmpresa, cidade),
    segmento: preset.rotuloSegmento,
    cidade,
    whatsapp: whatsappLimpo,
    telefoneExibicao: parcial.telefoneExibicao ?? formatarTelefone(whatsappLimpo),
    endereco: parcial.endereco,
    horario: parcial.horario ?? 'Segunda a sábado, 9h às 19h',
    servicos: preset.servicos,
    depoimentos: preset.depoimentos,
    anoFundacao: parcial.anoFundacao,
    dominio: parcial.dominio ?? `${parcial.nomeEmpresa.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com.br`,
  };
}
