import { create } from 'zustand';

import { CHAVES_LOCAIS, gravarJson, lerJson } from '@/lib/armazenamento-local';
import type { IdPlano } from '@/features/assinatura/planos';
import { pecaClosetSchema, type Categoria, type CorPeca, type PecaCloset } from './tipos';

/**
 * O closet da usuaria.
 *
 * FOTOS FICAM SO NO APARELHO. Guardamos o caminho local da imagem, nunca um
 * endereco publico, e nada e enviado para servidor — porque servidor ainda
 * nao existe. Quando existir, o envio passa pelas regras de
 * docs/06-seguranca.md: bucket privado, URL assinada curta, EXIF removido.
 */

/** Quantas pecas cada plano guarda (docs/04-assinaturas-precos.md). */
export const LIMITE_PECAS: Record<IdPlano, number> = {
  gratis: 20,
  medium: 200,
  premium: Infinity,
};

export type ResultadoAdicionar =
  | { ok: true; peca: PecaCloset }
  | { ok: false; motivo: 'limite-atingido' };

type NovaPeca = {
  nome: string;
  categoria: Categoria;
  cor: CorPeca;
  tamanho: string;
  origem: PecaCloset['origem'];
};

type EstadoCloset = {
  pecas: PecaCloset[];
  carregado: boolean;
  restaurar: () => Promise<void>;
  adicionar: (nova: NovaPeca, plano: IdPlano) => Promise<ResultadoAdicionar>;
  remover: (id: string) => Promise<void>;
  renomear: (id: string, nome: string) => Promise<void>;
  limpar: () => Promise<void>;
};

/** Id local previsivel e seguro para rota (sem depender de Math.random). */
function gerarId(existentes: PecaCloset[]): string {
  const maior = existentes.reduce((max, p) => {
    const n = Number.parseInt(p.id.replace('peca-', ''), 10);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return `peca-${String(maior + 1).padStart(4, '0')}`;
}

export const useCloset = create<EstadoCloset>((set, get) => ({
  pecas: [],
  carregado: false,

  restaurar: async () => {
    const bruto = await lerJson<unknown[]>(CHAVES_LOCAIS.pecasCloset, []);
    // Valida item a item: uma peca corrompida nao pode derrubar o closet
    // inteiro, entao descartamos so ela.
    const validas = Array.isArray(bruto)
      ? bruto.flatMap((item) => {
          const r = pecaClosetSchema.safeParse(item);
          return r.success ? [r.data] : [];
        })
      : [];
    set({ pecas: validas, carregado: true });
  },

  adicionar: async (nova, plano) => {
    const { pecas } = get();

    if (pecas.length >= LIMITE_PECAS[plano]) {
      return { ok: false, motivo: 'limite-atingido' };
    }

    const peca: PecaCloset = {
      id: gerarId(pecas),
      nome: nova.nome.trim().slice(0, 60),
      categoria: nova.categoria,
      cor: nova.cor,
      tamanho: nova.tamanho,
      origem: nova.origem,
      adicionadaEm: new Date().toISOString(),
    };

    const novas = [peca, ...pecas];
    set({ pecas: novas });
    await gravarJson(CHAVES_LOCAIS.pecasCloset, novas);
    return { ok: true, peca };
  },

  remover: async (id) => {
    const novas = get().pecas.filter((p) => p.id !== id);
    set({ pecas: novas });
    await gravarJson(CHAVES_LOCAIS.pecasCloset, novas);
  },

  renomear: async (id, nome) => {
    const novas = get().pecas.map((p) =>
      p.id === id ? { ...p, nome: nome.trim().slice(0, 60) || p.nome } : p,
    );
    set({ pecas: novas });
    await gravarJson(CHAVES_LOCAIS.pecasCloset, novas);
  },

  limpar: async () => {
    set({ pecas: [] });
    await gravarJson(CHAVES_LOCAIS.pecasCloset, []);
  },
}));
