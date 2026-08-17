// Tipos do analisador de sites — espelham as notas do vault:
// score e faixas em ../../03-score-de-qualidade.md, funil em ../../02-funil-de-vendas.md.

export type CriterioId =
  | 'site_nao_abre'
  | 'extremamente_lento'
  | 'nao_responsivo'
  | 'layout_ruim_celular'
  | 'design_antigo'
  | 'parece_abandonado'
  | 'https_problematico'
  | 'botoes_quebrados'
  | 'sem_cta';

export interface Criterio {
  id: CriterioId;
  descricao: string;
  pontos: number;
}

export interface Deteccao {
  criterio: CriterioId;
  pontos: number;
  evidencia: string;
}

export type Faixa = 'ignorar' | 'talvez' | 'prospectar' | 'prioridade_maxima';

export interface TokensDesign {
  paleta: string;
  tipografia: string;
  layout: string;
  tom: string;
}

export interface VarianteDesign {
  id: string;
  nome: string;
  descricao: string;
  links: string[];
  tokens: TokensDesign;
}

export interface VarianteAtribuida {
  variante: VarianteDesign;
  aguardandoLinks: boolean;
}

export interface Analise {
  url: string;
  urlFinal?: string;
  dominio: string;
  nomeEmpresa?: string;
  analisadoEm: string;
  tempoRespostaMs?: number;
  statusHttp?: number;
  deteccoes: Deteccao[];
  score: number;
  faixa: Faixa;
  usarIA: boolean;
  varianteDesign?: VarianteAtribuida;
  erro?: string;
}

export interface OpcoesAnalise {
  timeoutMs?: number;
  limiteLentoMs?: number;
  maxLinksVerificados?: number;
  userAgent?: string;
}
