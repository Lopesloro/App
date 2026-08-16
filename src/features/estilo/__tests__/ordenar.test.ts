import { buscarRoupaPorId, buscarRoupas } from '@/features/roupas/busca';
import { aprender, perfilVazio, type PerfilEstilo } from '../perfil-estilo';
import { AJUSTE_MAXIMO, ajusteDeEstilo, ordenarPorEstilo, PESO_TEXTO } from '../ordenar';

function perfilDe(ids: string[]): PerfilEstilo {
  return ids.reduce((perfil, id) => {
    const roupa = buscarRoupaPorId(id);
    if (!roupa) throw new Error(`Peca de teste ausente: ${id}`);
    return aprender(perfil, roupa, 'guardou');
  }, perfilVazio());
}

const PERFIL_CLASSICO = () =>
  perfilDe([
    'camisa-social',
    'calca-alfaiataria',
    'blazer-alfaiataria',
    'scarpin',
    'mocassim',
    'trench-coat',
    'relogio-classico',
    'lenco-seda',
  ]);

const PERFIL_ESPORTIVO = () =>
  perfilDe([
    'legging',
    'top-esportivo',
    'bermuda-ciclista',
    'corta-vento',
    'tenis-chunky',
    'chinelo-slide',
    'mochila-urbana',
    'moletom-capuz',
  ]);

describe('a busca manda mais que o palpite', () => {
  it('o ajuste de estilo nunca alcanca um degrau de relevancia de texto', () => {
    // E a garantia estrutural: se esta desigualdade quebrar, o perfil passa a
    // reordenar por cima do que a usuaria digitou.
    expect(AJUSTE_MAXIMO).toBeLessThan(PESO_TEXTO);
  });

  it('quem procura "camisa" recebe camisa, mesmo com perfil esportivo', () => {
    const resultado = ordenarPorEstilo(
      buscarRoupas({ texto: 'camisa' }),
      PERFIL_ESPORTIVO(),
    );

    expect(resultado[0].roupa.nome.toLowerCase()).toContain('camisa');
  });

  it('quem procura "bota" recebe bota, mesmo com perfil classico', () => {
    const resultado = ordenarPorEstilo(buscarRoupas({ texto: 'bota' }), PERFIL_CLASSICO());

    expect(resultado[0].roupa.categoria).toBe('calcado');
  });

  it('o ajuste respeita a faixa declarada', () => {
    const perfil = PERFIL_CLASSICO();

    for (const { roupa } of buscarRoupas()) {
      const ajuste = ajusteDeEstilo(perfil, roupa);
      expect(Math.abs(ajuste)).toBeLessThanOrEqual(AJUSTE_MAXIMO);
    }
  });
});

describe('o estilo desempata dentro do mesmo nivel de relevancia', () => {
  it('sem texto digitado, o gosto ordena o catalogo', () => {
    const classico = ordenarPorEstilo(buscarRoupas(), PERFIL_CLASSICO());
    const esportivo = ordenarPorEstilo(buscarRoupas(), PERFIL_ESPORTIVO());

    expect(classico[0].roupa.estilos).toContain('classico');
    expect(esportivo[0].roupa.estilos).toContain('esportivo');
    expect(classico[0].roupa.id).not.toBe(esportivo[0].roupa.id);
  });

  it('dentro de um filtro de categoria, a peca do estilo certo sobe', () => {
    const calcados = buscarRoupas({ categoria: 'calcado' });

    const paraClassica = ordenarPorEstilo(calcados, PERFIL_CLASSICO());
    const paraEsportiva = ordenarPorEstilo(calcados, PERFIL_ESPORTIVO());

    expect(paraClassica[0].roupa.estilos).toContain('classico');
    expect(paraEsportiva[0].roupa.estilos.some((e) => e === 'esportivo' || e === 'streetwear'))
      .toBe(true);
  });
});

describe('perfil vazio nao bagunca a ordem', () => {
  it('sem nada aprendido, o ajuste e zero para toda peca', () => {
    const perfil = perfilVazio();

    for (const { roupa } of buscarRoupas()) {
      expect(ajusteDeEstilo(perfil, roupa)).toBe(0);
    }
  });

  it('a ordem cai no alfabeto, e nao numa ordem aleatoria', () => {
    const primeira = ordenarPorEstilo(buscarRoupas(), perfilVazio());
    const segunda = ordenarPorEstilo(buscarRoupas(), perfilVazio());

    expect(primeira.map((r) => r.roupa.id)).toEqual(segunda.map((r) => r.roupa.id));
    expect(primeira[0].roupa.nome.localeCompare(primeira[1].roupa.nome, 'pt-BR'))
      .toBeLessThanOrEqual(0);
  });

  it('mantem a busca por texto funcionando normalmente', () => {
    const resultado = ordenarPorEstilo(buscarRoupas({ texto: 'kimono' }), perfilVazio());

    expect(resultado[0].roupa.id).toBe('kimono');
  });
});

describe('o que a tela recebe', () => {
  it('cada peca vem com afinidade entre 0 e 1', () => {
    const resultado = ordenarPorEstilo(buscarRoupas(), PERFIL_CLASSICO());

    for (const item of resultado) {
      expect(item.afinidade).toBeGreaterThanOrEqual(0);
      expect(item.afinidade).toBeLessThanOrEqual(1);
    }
  });

  it('a peca do topo traz motivo quando o app ja sabe algo', () => {
    const resultado = ordenarPorEstilo(buscarRoupas(), PERFIL_CLASSICO());

    expect(resultado[0].motivo).toBeTruthy();
  });

  it('nenhuma peca traz motivo quando o app ainda nao sabe nada', () => {
    const resultado = ordenarPorEstilo(buscarRoupas(), perfilVazio());

    expect(resultado.every((r) => r.motivo === null)).toBe(true);
  });

  it('nao perde nem duplica peca', () => {
    const entrada = buscarRoupas();
    const saida = ordenarPorEstilo(entrada, PERFIL_CLASSICO());

    expect(saida).toHaveLength(entrada.length);
    expect(new Set(saida.map((r) => r.roupa.id)).size).toBe(entrada.length);
  });

  it('lista vazia continua vazia', () => {
    expect(ordenarPorEstilo([], PERFIL_CLASSICO())).toEqual([]);
  });
});
