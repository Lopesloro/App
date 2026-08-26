import { buscarRoupaPorId } from '@/features/roupas/busca';
import type { TipoRoupa } from '@/features/roupas/tipos';
import {
  afinidade,
  aprender,
  caimentoPreferido,
  confianca,
  estiloDominante,
  explicarAfinidade,
  INTERACOES_PARA_CONFIAR,
  migrarPerfil,
  perfilVazio,
  ranking,
  resumirPerfil,
  VERSAO_PERFIL,
  type PerfilEstilo,
} from '../perfil-estilo';

const peca = (id: string): TipoRoupa => {
  const roupa = buscarRoupaPorId(id);
  if (!roupa) throw new Error(`Peca de teste ausente do catalogo: ${id}`);
  return roupa;
};

/** Guarda uma lista de pecas em sequencia, como a usuaria faria. */
function guardarVarias(ids: string[], inicial: PerfilEstilo = perfilVazio()): PerfilEstilo {
  return ids.reduce((perfil, id) => aprender(perfil, peca(id), 'guardou'), inicial);
}

describe('perfil vazio', () => {
  it('nao tem opiniao sobre nada', () => {
    const perfil = perfilVazio();

    expect(Object.values(perfil.estilos).every((p) => p === 0)).toBe(true);
    expect(Object.values(perfil.caimentos).every((p) => p === 0)).toBe(true);
    expect(perfil.interacoes).toBe(0);
  });

  it('devolve afinidade neutra para qualquer peca', () => {
    const perfil = perfilVazio();

    for (const id of ['camisa-social', 'moletom-capuz', 'chapeu-palha']) {
      expect(afinidade(perfil, peca(id))).toBeCloseTo(0.5, 5);
    }
  });

  it('nao finge saber o estilo de quem acabou de instalar', () => {
    expect(estiloDominante(perfilVazio())).toBeNull();
    expect(explicarAfinidade(perfilVazio(), peca('camisa-social'))).toBeNull();
    expect(resumirPerfil(perfilVazio())).toContain('Ainda não sei');
  });
});

describe('aprender com o que a usuaria guarda', () => {
  it('guardar uma peca aumenta o peso dos estilos dela', () => {
    const depois = aprender(perfilVazio(), peca('camisa-social'), 'guardou');

    expect(depois.estilos.classico).toBeGreaterThan(0);
    expect(depois.estilos.minimalista).toBeGreaterThan(0);
    expect(depois.interacoes).toBe(1);
  });

  it('nao altera o perfil recebido — devolve um novo', () => {
    const antes = perfilVazio();
    const copia = JSON.parse(JSON.stringify(antes)) as PerfilEstilo;

    aprender(antes, peca('camisa-social'), 'guardou');

    expect(antes).toEqual(copia);
  });

  it('remover puxa o peso para baixo', () => {
    const guardou = aprender(perfilVazio(), peca('moletom-capuz'), 'guardou');
    const removeu = aprender(guardou, peca('moletom-capuz'), 'removeu');

    expect(removeu.estilos.streetwear).toBeLessThan(guardou.estilos.streetwear);
  });

  it('descartar pesa mais contra do que remover', () => {
    const base = guardarVarias(['moletom-capuz', 'calca-cargo']);

    const removeu = aprender(base, peca('tenis-chunky'), 'removeu');
    const descartou = aprender(base, peca('tenis-chunky'), 'descartou');

    expect(descartou.estilos.streetwear).toBeLessThan(removeu.estilos.streetwear);
  });

  it('peca com tres estilos nao ensina tres vezes mais que uma de um estilo', () => {
    // "Saida de praia" e so boho; "camisa de linho" e boho + minimalista +
    // classico. Um voto por peca, dividido entre as etiquetas.
    const umEstilo = aprender(perfilVazio(), peca('saida-de-praia'), 'guardou');
    const tresEstilos = aprender(perfilVazio(), peca('camisa-linho'), 'guardou');

    expect(tresEstilos.estilos.boho).toBeLessThan(umEstilo.estilos.boho);
  });

  it('o peso nunca escapa da faixa, por mais que se insista', () => {
    let perfil = perfilVazio();
    for (let i = 0; i < 500; i++) {
      perfil = aprender(perfil, peca('saida-de-praia'), 'guardou');
    }

    expect(perfil.estilos.boho).toBeLessThanOrEqual(1);
    expect(perfil.estilos.boho).toBeGreaterThan(0.9);
  });

  it('cada novo voto move menos que o anterior', () => {
    const um = aprender(perfilVazio(), peca('saida-de-praia'), 'guardou');
    const dois = aprender(um, peca('saida-de-praia'), 'guardou');
    const tres = aprender(dois, peca('saida-de-praia'), 'guardou');

    const primeiroSalto = um.estilos.boho - 0;
    const segundoSalto = dois.estilos.boho - um.estilos.boho;
    const terceiroSalto = tres.estilos.boho - dois.estilos.boho;

    expect(segundoSalto).toBeLessThan(primeiroSalto);
    expect(terceiroSalto).toBeLessThan(segundoSalto);
  });

  it('o gosto acompanha a mudanca: o estilo antigo encolhe', () => {
    const inverno = guardarVarias([
      'trico-gola-alta',
      'sobretudo',
      'bota-cano-curto',
      'vestido-trico',
    ]);
    const pesoClassicoNoInverno = inverno.estilos.classico;

    const verao = guardarVarias(
      ['saida-de-praia', 'chapeu-palha', 'bata-boho', 'kimono', 'rasteirinha'],
      inverno,
    );

    expect(verao.estilos.boho).toBeGreaterThan(0);
    expect(verao.estilos.classico).toBeLessThan(pesoClassicoNoInverno);
  });
});

describe('afinidade', () => {
  it('quem guarda peca classica recebe nota alta em peca classica', () => {
    const perfil = guardarVarias([
      'camisa-social',
      'calca-alfaiataria',
      'blazer-alfaiataria',
      'scarpin',
    ]);

    expect(afinidade(perfil, peca('vestido-tubinho'))).toBeGreaterThan(0.5);
  });

  it('e nota baixa em peca do lado oposto', () => {
    const perfil = guardarVarias([
      'camisa-social',
      'calca-alfaiataria',
      'blazer-alfaiataria',
      'scarpin',
      'mocassim',
    ]);

    expect(afinidade(perfil, peca('bermuda-ciclista'))).toBeLessThan(
      afinidade(perfil, peca('vestido-tubinho')),
    );
  });

  it('fica sempre entre 0 e 1', () => {
    const perfil = guardarVarias(['moletom-capuz', 'calca-cargo', 'tenis-chunky']);

    for (const id of ['camisa-social', 'clutch', 'legging', 'chapeu-palha']) {
      const valor = afinidade(perfil, peca(id));
      expect(valor).toBeGreaterThanOrEqual(0);
      expect(valor).toBeLessThanOrEqual(1);
    }
  });
});

describe('confianca', () => {
  it('comeca em zero', () => {
    expect(confianca(perfilVazio())).toBe(0);
  });

  it('cresce com o uso e satura em 1', () => {
    const meio = guardarVarias(Array(4).fill('camisa-social'));
    const cheio = guardarVarias(Array(INTERACOES_PARA_CONFIAR + 10).fill('camisa-social'));

    expect(confianca(meio)).toBeGreaterThan(0);
    expect(confianca(meio)).toBeLessThan(1);
    expect(confianca(cheio)).toBe(1);
  });

  it('so afirma um estilo depois de evidencia suficiente', () => {
    const poucas = guardarVarias(['camisa-social', 'scarpin']);
    const bastantes = guardarVarias([
      'camisa-social',
      'scarpin',
      'calca-alfaiataria',
      'blazer-alfaiataria',
      'mocassim',
      'trench-coat',
      'relogio-classico',
      'lenco-seda',
    ]);

    expect(estiloDominante(poucas)).toBeNull();
    expect(estiloDominante(bastantes)?.valor).toBe('classico');
  });
});

describe('explicar para a usuaria', () => {
  const perfilClassico = () =>
    guardarVarias([
      'camisa-social',
      'calca-alfaiataria',
      'blazer-alfaiataria',
      'scarpin',
      'mocassim',
      'trench-coat',
      'relogio-classico',
      'lenco-seda',
    ]);

  it('diz o motivo em portugues, sem jargao', () => {
    const motivo = explicarAfinidade(perfilClassico(), peca('vestido-tubinho'));

    expect(motivo).toBeTruthy();
    expect(motivo).toMatch(/clássico|caimento|trabalho/i);
    expect(motivo).not.toMatch(/peso|score|vetor|afinidade/i);
  });

  it('nao inventa motivo para peca que nao combina', () => {
    // Perfil de moletom: streetwear/esportivo, caimento oversized, casual e
    // academia. A clutch nao encosta em nenhum desses — classica, justa, de
    // festa. Sem motivo verdadeiro, o app fica calado.
    const perfil = guardarVarias(Array(10).fill('moletom-capuz'));
    const motivo = explicarAfinidade(perfil, peca('clutch'));

    expect(motivo).toBeNull();
  });

  it('o resumo muda conforme o app aprende', () => {
    expect(resumirPerfil(perfilVazio())).toContain('Ainda não sei');
    expect(resumirPerfil(guardarVarias(['camisa-social']))).toContain('começando');
    expect(resumirPerfil(perfilClassico())).toContain('clássico');
  });

  it('o caimento preferido aparece quando ha um', () => {
    const perfil = guardarVarias([
      'calca-wide-leg',
      'camisa-linho',
      'kimono',
      'bata-boho',
      'saida-de-praia',
      'calca-pantalona-linho',
      'cardiga',
      'trench-coat',
    ]);

    expect(caimentoPreferido(perfil)?.valor).toBe('solto');
  });
});

describe('ranking de pesos', () => {
  it('vem do maior para o menor', () => {
    // Todas streetwear, cada uma com um segundo estilo diferente: so o
    // streetwear se repete, entao so ele acumula.
    const perfil = guardarVarias([
      'saia-jeans',
      'jaqueta-jeans',
      'bolsa-baguete',
      'mochila-urbana',
    ]);
    const ordenado = ranking(perfil.estilos);

    expect(ordenado[0].valor).toBe('streetwear');
    for (let i = 1; i < ordenado.length; i++) {
      expect(ordenado[i - 1].peso).toBeGreaterThanOrEqual(ordenado[i].peso);
    }
  });
});

describe('ler o perfil guardado no aparelho', () => {
  it('perfil valido volta inteiro', () => {
    const original = guardarVarias(['camisa-social', 'scarpin']);
    const lido = migrarPerfil(JSON.parse(JSON.stringify(original)));

    expect(lido.estilos.classico).toBeCloseTo(original.estilos.classico, 10);
    expect(lido.interacoes).toBe(original.interacoes);
  });

  it('arquivo de outra versao comeca do zero em vez de adivinhar', () => {
    const antigo = { ...guardarVarias(['camisa-social']), versao: VERSAO_PERFIL + 1 };

    expect(migrarPerfil(antigo).interacoes).toBe(0);
  });

  it('lixo no lugar do perfil nao derruba o app', () => {
    for (const bruto of [null, undefined, 42, 'texto', [], { versao: 'x' }]) {
      expect(migrarPerfil(bruto).interacoes).toBe(0);
    }
  });

  it('termo novo no vocabulario entra em zero, sem invalidar o resto', () => {
    const original = guardarVarias(['camisa-social']);
    const semUmEstilo = JSON.parse(JSON.stringify(original)) as PerfilEstilo;
    delete (semUmEstilo.estilos as Record<string, number>).streetwear;

    const lido = migrarPerfil(semUmEstilo);

    expect(lido.estilos.streetwear).toBe(0);
    expect(lido.estilos.classico).toBeCloseTo(original.estilos.classico, 10);
  });

  it('peso adulterado para fora da faixa e cortado', () => {
    const adulterado = {
      ...perfilVazio(),
      estilos: { ...perfilVazio().estilos, boho: 999, classico: -999 },
    };
    const lido = migrarPerfil(adulterado);

    expect(lido.estilos.boho).toBe(1);
    expect(lido.estilos.classico).toBe(-1);
  });

  it('chave desconhecida no arquivo e ignorada', () => {
    const comLixo = {
      ...perfilVazio(),
      estilos: { ...perfilVazio().estilos, estiloInventado: 0.9 },
    };

    expect(migrarPerfil(comLixo).estilos).not.toHaveProperty('estiloInventado');
  });

  it('contador de interacoes negativo vira zero', () => {
    expect(migrarPerfil({ ...perfilVazio(), interacoes: -5 }).interacoes).toBe(0);
  });
});
