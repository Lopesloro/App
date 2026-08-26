import AsyncStorage from '@react-native-async-storage/async-storage';

import { CHAVES_LOCAIS } from '@/lib/armazenamento-local';
import { CHAVES, ler, limparCredenciais } from '@/lib/armazenamento-seguro';
import { queryClient } from '@/lib/query-client';
import { useSalvos } from '@/features/salvos/salvos-store';
import { podeUsarOApp, useSessao } from '../sessao-store';
import type { Sessao } from '../schemas';

const SESSAO: Sessao = {
  tokenAcesso: 'token-de-acesso',
  tokenRefresh: 'token-de-refresh',
  usuaria: {
    id: '6f1c2a5e-2f77-4a1e-9d3b-0f9a7c4e1b22',
    nome: 'Ana',
    email: 'ana@exemplo.com',
    plano: 'gratis',
    concluiuQuizEstilo: false,
  },
};

beforeEach(async () => {
  await AsyncStorage.clear();
  // O cofre falso do jest-setup vive no modulo e sobrevive entre os testes.
  await limparCredenciais();
  queryClient.clear();
  useSessao.setState({
    usuaria: null,
    autenticada: false,
    visitante: false,
    carregando: false,
  });
  useSalvos.setState({ ids: [], carregado: true });
});

describe('entrar', () => {
  it('guarda os tokens no cofre, nunca no estado em memoria', async () => {
    await useSessao.getState().entrar(SESSAO);

    expect(await ler(CHAVES.tokenAcesso)).toBe('token-de-acesso');
    expect(await ler(CHAVES.tokenRefresh)).toBe('token-de-refresh');

    // O estado do store nao pode conter token: ele aparece em devtools e em
    // relatorio de crash (docs/06-seguranca.md).
    expect(JSON.stringify(useSessao.getState())).not.toContain('token-de-acesso');
    expect(JSON.stringify(useSessao.getState())).not.toContain('token-de-refresh');
  });

  it('marca a usuaria como autenticada', async () => {
    await useSessao.getState().entrar(SESSAO);

    expect(useSessao.getState().autenticada).toBe(true);
    expect(useSessao.getState().usuaria?.nome).toBe('Ana');
  });
});

describe('entrar sem conta', () => {
  it('abre o app sem token e sem cofre', async () => {
    await useSessao.getState().entrarSemConta();

    expect(useSessao.getState().visitante).toBe(true);
    expect(useSessao.getState().autenticada).toBe(false);
    expect(await ler(CHAVES.tokenAcesso)).toBeNull();
  });

  it('a porta do app abre com conta OU sem conta', () => {
    expect(podeUsarOApp({ autenticada: false, visitante: false })).toBe(false);
    expect(podeUsarOApp({ autenticada: false, visitante: true })).toBe(true);
    expect(podeUsarOApp({ autenticada: true, visitante: false })).toBe(true);
  });

  it('continua sem conta na proxima abertura do app', async () => {
    await useSessao.getState().entrarSemConta();

    // Simula fechar e abrir: memoria zerada, dados no aparelho.
    useSessao.setState({ visitante: false, autenticada: false, carregando: true });
    await useSessao.getState().restaurar();

    expect(useSessao.getState().visitante).toBe(true);
    expect(useSessao.getState().carregando).toBe(false);
  });

  it('sem cofre disponivel, quem entrou sem conta nao e expulso', async () => {
    // E o caso do navegador: `ler` nao encontra cofre nenhum. Antes disso
    // ser tratado, a pessoa voltava para a tela de boas-vindas a cada
    // abertura, sem entender por que.
    await useSessao.getState().entrarSemConta();

    const cofre = jest.requireMock<{ getItemAsync: jest.Mock }>('expo-secure-store');
    cofre.getItemAsync.mockRejectedValueOnce(
      new Error('sem cofre nesta plataforma'),
    );

    useSessao.setState({ visitante: false, carregando: true });
    await useSessao.getState().restaurar();

    expect(useSessao.getState().visitante).toBe(true);
  });

  it('apagar tudo devolve o app ao estado de quem nunca entrou', async () => {
    await useSessao.getState().entrarSemConta();
    await useSessao.getState().sair();

    expect(useSessao.getState().visitante).toBe(false);
    expect(podeUsarOApp(useSessao.getState())).toBe(false);
  });
});

describe('sair nao deixa rastro da conta anterior', () => {
  async function usarOAppEsair() {
    await useSessao.getState().entrar(SESSAO);
    await useSalvos.getState().alternar('look-001', 'gratis');
    queryClient.setQueryData(['looks-salvos', 'look-001'], ['algo em cache']);

    await useSessao.getState().sair();
  }

  it('apaga as credenciais do cofre', async () => {
    await usarOAppEsair();

    expect(await ler(CHAVES.tokenAcesso)).toBeNull();
    expect(await ler(CHAVES.tokenRefresh)).toBeNull();
    expect(await ler(CHAVES.idUsuaria)).toBeNull();
  });

  it('apaga os dados locais do aparelho', async () => {
    await usarOAppEsair();

    expect(await AsyncStorage.getItem(CHAVES_LOCAIS.looksSalvos)).toBeNull();
  });

  it('esquece os looks salvos que estavam em memoria', async () => {
    await usarOAppEsair();

    // Se so o arquivo fosse apagado, a lista continuaria na tela ate o app
    // ser fechado — e a proxima pessoa veria a colecao de quem saiu.
    expect(useSalvos.getState().ids).toEqual([]);
    expect(useSalvos.getState().carregado).toBe(false);
  });

  it('esvazia o cache de respostas da conta anterior', async () => {
    await usarOAppEsair();

    expect(queryClient.getQueryData(['looks-salvos', 'look-001'])).toBeUndefined();
  });

  it('deixa o app em estado de visitante', async () => {
    await usarOAppEsair();

    expect(useSessao.getState().autenticada).toBe(false);
    expect(useSessao.getState().usuaria).toBeNull();
  });
});

describe('restaurar ao abrir o app', () => {
  it('reconhece a sessao guardada no cofre', async () => {
    await useSessao.getState().entrar(SESSAO);
    useSessao.setState({ usuaria: null, autenticada: false, carregando: true });

    await useSessao.getState().restaurar();

    expect(useSessao.getState().autenticada).toBe(true);
    expect(useSessao.getState().carregando).toBe(false);
  });

  it('sem cofre preenchido, abre como visitante', async () => {
    await useSessao.getState().restaurar();

    expect(useSessao.getState().autenticada).toBe(false);
    expect(useSessao.getState().carregando).toBe(false);
  });
});
