// Tabela de pontuação e faixas de decisão — fonte: ../../03-score-de-qualidade.md.
// Qualquer mudança aqui precisa ser refletida na nota do vault (e vice-versa).

import type { Criterio, CriterioId, Deteccao, Faixa } from './tipos.ts';

export const CRITERIOS: Record<CriterioId, Criterio> = {
  site_nao_abre: { id: 'site_nao_abre', descricao: 'Site não abre', pontos: 30 },
  extremamente_lento: { id: 'extremamente_lento', descricao: 'Site extremamente lento', pontos: 20 },
  nao_responsivo: { id: 'nao_responsivo', descricao: 'Não é responsivo', pontos: 20 },
  layout_ruim_celular: { id: 'layout_ruim_celular', descricao: 'Layout ruim no celular', pontos: 20 },
  design_antigo: { id: 'design_antigo', descricao: 'Design antigo', pontos: 15 },
  parece_abandonado: { id: 'parece_abandonado', descricao: 'Site parece abandonado', pontos: 15 },
  https_problematico: { id: 'https_problematico', descricao: 'HTTPS problemático', pontos: 10 },
  botoes_quebrados: { id: 'botoes_quebrados', descricao: 'Botões quebrados', pontos: 10 },
  sem_cta: { id: 'sem_cta', descricao: 'Não possui CTA', pontos: 10 },
};

export const SCORE_MAXIMO = 100;

// Corte que libera análise por IA: início da faixa "prospectar".
// Abaixo disso, nenhum token é gasto (regra de custo da nota 11).
export const CORTE_IA = 61;

export function detectar(criterio: CriterioId, evidencia: string): Deteccao {
  return { criterio, pontos: CRITERIOS[criterio].pontos, evidencia };
}

export function calcularScore(deteccoes: Deteccao[]): number {
  const soma = deteccoes.reduce((total, d) => total + d.pontos, 0);
  return Math.min(SCORE_MAXIMO, soma);
}

export function faixaDoScore(score: number): Faixa {
  if (score <= 30) return 'ignorar';
  if (score <= 60) return 'talvez';
  if (score <= 80) return 'prospectar';
  return 'prioridade_maxima';
}

export const ROTULO_FAIXA: Record<Faixa, string> = {
  ignorar: 'Ignorar',
  talvez: 'Talvez',
  prospectar: 'Prospectar',
  prioridade_maxima: 'Prioridade máxima',
};
