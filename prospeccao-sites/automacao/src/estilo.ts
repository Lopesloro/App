// Atribuição de variante de design por lead.
// Determinística: o mesmo domínio recebe sempre a mesma variante (hash FNV-1a),
// e a distribuição em lote evita duas demos seguidas com a mesma base.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { VarianteAtribuida, VarianteDesign } from './tipos.ts';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ARQUIVO_REFERENCIAS = join(AQUI, '..', 'referencias', 'referencias-design.json');

let cache: VarianteDesign[] | undefined;

export function carregarVariantes(caminho: string = ARQUIVO_REFERENCIAS): VarianteDesign[] {
  if (!cache) {
    const dados = JSON.parse(readFileSync(caminho, 'utf8')) as { variantes: VarianteDesign[] };
    if (!Array.isArray(dados.variantes) || dados.variantes.length === 0) {
      throw new Error(`Nenhuma variante de design em ${caminho}`);
    }
    cache = dados.variantes;
  }
  return cache;
}

export function hashFnv1a(texto: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    hash ^= texto.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash;
}

export function escolherVariante(dominio: string, variantes: VarianteDesign[]): VarianteDesign {
  return variantes[hashFnv1a(dominio.toLowerCase()) % variantes.length];
}

export function atribuirVariante(dominio: string): VarianteAtribuida {
  const variante = escolherVariante(dominio, carregarVariantes());
  return { variante, aguardandoLinks: variante.links.length === 0 };
}

// Distribuição para lote: parte do hash de cada domínio, mas quando a variante
// já foi usada mais que as outras, avança para a menos usada — assim um lote
// pequeno não concentra tudo na mesma base.
export function distribuirVariantes(dominios: string[], variantes?: VarianteDesign[]): Map<string, VarianteDesign> {
  const lista = variantes ?? carregarVariantes();
  const uso = new Map<string, number>(lista.map((v) => [v.id, 0]));
  const resultado = new Map<string, VarianteDesign>();
  for (const dominio of dominios) {
    const inicio = hashFnv1a(dominio.toLowerCase()) % lista.length;
    const menorUso = Math.min(...uso.values());
    let escolhida = lista[inicio];
    if ((uso.get(escolhida.id) ?? 0) > menorUso) {
      for (let passo = 1; passo < lista.length; passo++) {
        const candidata = lista[(inicio + passo) % lista.length];
        if ((uso.get(candidata.id) ?? 0) === menorUso) {
          escolhida = candidata;
          break;
        }
      }
    }
    uso.set(escolhida.id, (uso.get(escolhida.id) ?? 0) + 1);
    resultado.set(dominio, escolhida);
  }
  return resultado;
}
