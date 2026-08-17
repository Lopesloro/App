// Pega os leads coletados na Apify e gera os dois arquivos de trabalho:
//   1. leads-sites.csv   → fila que o wpp-server consome
//   2. leads-sites.xlsx  → planilha para conferir/filtrar na mão
//
//   APIFY_TOKEN=xxx npm run planilha -- --dataset <id1> --dataset <id2>
//   npm run planilha -- --arquivo leads.json     (offline, sem token)
//
// Regra importante: nem todo "website" do Google Maps é site de verdade. Muita
// empresa cadastra Instagram, wa.me ou Linktree. Isso muda a abordagem, então
// cada lead é classificado por TIPO DE SITE em vez de ser descartado.

import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import ExcelJS from 'exceljs';
import { gerarCsvLeads, normalizarWhatsapp, type LeadExportado } from './integracao/wpp-server.ts';

export type TipoSite = 'site_proprio' | 'instagram' | 'whatsapp' | 'facebook' | 'agregador' | 'sem_site';

interface ItemApify {
  title?: string;
  phoneUnformatted?: string;
  website?: string;
  city?: string;
  categoryName?: string;
  totalScore?: number | null;
  reviewsCount?: number | null;
  address?: string;
}

export interface LeadPreparado {
  nome: string;
  telefone: string;
  site: string;
  tipoSite: TipoSite;
  dominio: string;
  categoria: string;
  cidade: string;
  nota: number | '';
  avaliacoes: number | '';
}

const PADROES_TIPO: { tipo: TipoSite; padrao: RegExp }[] = [
  { tipo: 'whatsapp', padrao: /(wa\.me|api\.whatsapp\.com|whatsapp:|contate\.me)/i },
  { tipo: 'instagram', padrao: /(instagram\.com|instagem\.ai|l\.instagram\.com)/i },
  { tipo: 'facebook', padrao: /facebook\.com/i },
  {
    tipo: 'agregador',
    padrao: /(linktr\.ee|keepo\.io|linktree|trinks\.com|fresha\.com|avec\.app|belasis\.app|canva\.com|sites\.google\.com|vercel\.app|netlify\.app|lovable\.app|brixly\.com|codental\.site|odo\.br)/i,
  },
];

export function classificarSite(url: string): TipoSite {
  const limpo = (url ?? '').trim();
  if (!limpo) return 'sem_site';
  for (const { tipo, padrao } of PADROES_TIPO) {
    if (padrao.test(limpo)) return tipo;
  }
  return 'site_proprio';
}

export function extrairDominio(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export const ROTULO_TIPO: Record<TipoSite, string> = {
  site_proprio: 'Site próprio',
  instagram: 'Só Instagram',
  whatsapp: 'Só WhatsApp',
  facebook: 'Só Facebook',
  agregador: 'Agregador/construtor',
  sem_site: 'Sem site',
};

export function prepararLeads(itens: ItemApify[]): LeadPreparado[] {
  const vistos = new Set<string>();
  const leads: LeadPreparado[] = [];

  for (const item of itens) {
    const telefone = normalizarWhatsapp(item.phoneUnformatted ?? '');
    if (!telefone) continue; // sem telefone não há prospecção
    if (vistos.has(telefone)) continue; // mesma empresa em dois termos de busca
    vistos.add(telefone);

    const site = (item.website ?? '').trim();
    leads.push({
      nome: (item.title ?? '').trim(),
      telefone,
      site,
      tipoSite: classificarSite(site),
      dominio: extrairDominio(site),
      categoria: (item.categoryName ?? '').trim(),
      cidade: (item.city ?? '').trim(),
      nota: typeof item.totalScore === 'number' ? item.totalScore : '',
      avaliacoes: typeof item.reviewsCount === 'number' ? item.reviewsCount : '',
    });
  }

  // Site próprio primeiro (é o nosso público principal), depois mais avaliados:
  // empresa boa com site ruim é a melhor aposta (nota 09, ângulo 12).
  const peso: Record<TipoSite, number> = {
    site_proprio: 0,
    agregador: 1,
    instagram: 2,
    facebook: 3,
    whatsapp: 4,
    sem_site: 5,
  };
  return leads.sort(
    (a, b) => peso[a.tipoSite] - peso[b.tipoSite] || Number(b.avaliacoes || 0) - Number(a.avaliacoes || 0),
  );
}

async function baixarDataset(datasetId: string, token: string): Promise<ItemApify[]> {
  const url =
    `https://api.apify.com/v2/datasets/${datasetId}/items` +
    `?clean=true&fields=title,phoneUnformatted,website,city,categoryName,totalScore,reviewsCount,address`;
  const resposta = await fetch(url, {
    headers: { authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(60_000),
  });
  if (!resposta.ok) throw new Error(`dataset ${datasetId}: HTTP ${resposta.status}`);
  return (await resposta.json()) as ItemApify[];
}

export async function gerarPlanilha(leads: LeadPreparado[], caminho: string): Promise<void> {
  const livro = new ExcelJS.Workbook();
  livro.creator = 'Automação de prospecção';
  livro.created = new Date();

  const aba = livro.addWorksheet('Leads', { views: [{ state: 'frozen', ySplit: 1 }] });
  aba.columns = [
    { header: '#', key: 'n', width: 5 },
    { header: 'Empresa', key: 'nome', width: 46 },
    { header: 'Telefone', key: 'telefone', width: 16 },
    { header: 'Categoria', key: 'categoria', width: 24 },
    { header: 'Cidade', key: 'cidade', width: 16 },
    { header: 'Tipo de site', key: 'tipo', width: 20 },
    { header: 'Site', key: 'site', width: 46 },
    { header: 'Nota', key: 'nota', width: 8 },
    { header: 'Avaliações', key: 'avaliacoes', width: 12 },
    { header: 'Score do site', key: 'score', width: 13 },
    { header: 'Status', key: 'status', width: 14 },
  ];

  leads.forEach((lead, i) =>
    aba.addRow({
      n: i + 1,
      nome: lead.nome,
      telefone: lead.telefone,
      categoria: lead.categoria,
      cidade: lead.cidade,
      tipo: ROTULO_TIPO[lead.tipoSite],
      site: lead.site,
      nota: lead.nota,
      avaliacoes: lead.avaliacoes,
      score: '', // preenchido depois de rodar `npm run lote`
      status: 'Pendente',
    }),
  );

  const cabecalho = aba.getRow(1);
  cabecalho.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  cabecalho.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E5F' } };
  cabecalho.alignment = { vertical: 'middle' };
  cabecalho.height = 22;
  aba.autoFilter = { from: 'A1', to: `K${leads.length + 1}` };

  // Destaque para o público principal: quem tem site próprio.
  for (let linha = 2; linha <= leads.length + 1; linha++) {
    if (leads[linha - 2].tipoSite === 'site_proprio') {
      aba.getCell(`F${linha}`).font = { bold: true, color: { argb: 'FF1F6F3F' } };
    }
  }

  // Aba de resumo: quantos leads por tipo e por cidade.
  const resumo = livro.addWorksheet('Resumo');
  resumo.columns = [
    { header: 'Indicador', key: 'k', width: 32 },
    { header: 'Quantidade', key: 'v', width: 14 },
  ];
  resumo.getRow(1).font = { bold: true };
  resumo.addRow({ k: 'Total de leads', v: leads.length });
  for (const tipo of Object.keys(ROTULO_TIPO) as TipoSite[]) {
    const total = leads.filter((l) => l.tipoSite === tipo).length;
    if (total > 0) resumo.addRow({ k: ROTULO_TIPO[tipo], v: total });
  }
  resumo.addRow({});
  const cidades = [...new Set(leads.map((l) => l.cidade).filter(Boolean))];
  for (const cidade of cidades) {
    resumo.addRow({ k: `Cidade: ${cidade}`, v: leads.filter((l) => l.cidade === cidade).length });
  }

  await livro.xlsx.writeFile(caminho);
}

if (process.argv[1]?.endsWith('preparar-planilha.ts')) {
  const args = process.argv.slice(2);
  const datasets = args.flatMap((a, i) => (a === '--dataset' ? [args[i + 1]] : []));
  const arquivo = args[args.indexOf('--arquivo') + 1];
  const saida = 'saida';
  mkdirSync(saida, { recursive: true });

  let itens: ItemApify[] = [];
  if (arquivo && args.includes('--arquivo')) {
    itens = JSON.parse(readFileSync(arquivo, 'utf8')) as ItemApify[];
  } else if (datasets.length > 0) {
    const token = process.env.APIFY_TOKEN;
    if (!token) {
      console.error('APIFY_TOKEN não definido. Pegue em https://console.apify.com/settings/integrations');
      process.exit(2);
    }
    for (const id of datasets) {
      const parte = await baixarDataset(id, token);
      console.log(`dataset ${id}: ${parte.length} itens`);
      itens.push(...parte);
    }
  } else {
    console.error('Uso: npm run planilha -- --dataset <id> [--dataset <id>]   |   --arquivo leads.json');
    process.exit(2);
  }

  const leads = prepararLeads(itens);
  const csv = gerarCsvLeads(
    leads.map<LeadExportado>((l) => ({
      nome: l.nome,
      whatsapp: l.telefone,
      categoria: l.categoria,
      cidade: l.cidade,
      pais: 'BR',
      nota: l.nota,
      avaliacoes: l.avaliacoes,
      site: l.site,
    })),
  );

  writeFileSync(join(saida, 'leads-sites.csv'), csv, 'utf8');
  await gerarPlanilha(leads, join(saida, 'leads-sites.xlsx'));

  const porTipo = new Map<TipoSite, number>();
  for (const l of leads) porTipo.set(l.tipoSite, (porTipo.get(l.tipoSite) ?? 0) + 1);
  console.log(`\n${leads.length} leads únicos (de ${itens.length} coletados)`);
  for (const [tipo, total] of porTipo) console.log(`  ${ROTULO_TIPO[tipo]}: ${total}`);
  console.log(`\n→ ${join(saida, 'leads-sites.csv')}  (fila do wpp-server)`);
  console.log(`→ ${join(saida, 'leads-sites.xlsx')} (planilha)`);
}
