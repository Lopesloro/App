import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IlustracaoPeca } from '@/components/closet/ilustracao-peca';
import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { useSessao } from '@/features/auth/sessao-store';
import {
  escolherDaGaleria,
  fotografarPeca,
  mensagemDeFalha,
} from '@/features/closet/captura';
import { GRUPOS, itensDoGrupo, ROTULO_GRUPO, type ItemCatalogo } from '@/features/closet/catalogo';
import { useCloset } from '@/features/closet/closet-store';
import {
  ROTULO_CATEGORIA,
  tamanhosDaCategoria,
  type Categoria,
  type CorPeca,
} from '@/features/closet/tipos';
import { usePaleta } from '@/theme/tema-store';
import { espaco, raio, type Paleta } from '@/theme/tokens';

type Rascunho = {
  nome: string;
  categoria: Categoria;
  cor: CorPeca;
  origem: { tipo: 'foto'; caminhoLocal: string } | { tipo: 'catalogo'; idCatalogo: string };
};

/**
 * Adicionar pecas ao closet, por dois caminhos:
 *  1. escolher de uma lista pronta (rapido, sem foto)
 *  2. fotografar a propria roupa
 *
 * O primeiro vem antes de proposito: fotografar 30 pecas antes de ver valor
 * e o motivo numero um de abandono nos concorrentes.
 */
export default function AdicionarPecas() {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);
  const router = useRouter();

  const plano = useSessao((estado) => estado.usuaria?.plano ?? 'gratis');
  const adicionar = useCloset((estado) => estado.adicionar);

  const [rascunho, setRascunho] = useState<Rascunho | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [adicionadas, setAdicionadas] = useState<string[]>([]);

  async function capturar(fonte: 'camera' | 'galeria') {
    const r = fonte === 'camera' ? await fotografarPeca() : await escolherDaGaleria();

    if (!r.ok) {
      const msg = mensagemDeFalha(r.motivo);
      if (msg) setAviso(msg);
      return;
    }

    setAviso(null);
    setRascunho({
      nome: '',
      categoria: 'blusa',
      cor: 'preto',
      origem: { tipo: 'foto', caminhoLocal: r.caminhoLocal },
    });
  }

  async function adicionarDoCatalogo(item: ItemCatalogo) {
    const tamanhoPadrao = tamanhosDaCategoria(item.categoria)[0];
    const r = await adicionar(
      {
        nome: item.nome,
        categoria: item.categoria,
        cor: item.cor,
        tamanho: tamanhoPadrao,
        origem: { tipo: 'catalogo', idCatalogo: item.id },
      },
      plano,
    );

    if (!r.ok) {
      setAviso('Você chegou ao limite de peças do seu plano. Assine para guardar mais.');
      return;
    }
    setAdicionadas((atuais) => [...atuais, item.id]);
  }

  if (rascunho) {
    return (
      <DetalharPeca
        rascunho={rascunho}
        onCancelar={() => setRascunho(null)}
        onPronto={() => {
          setRascunho(null);
          router.back();
        }}
      />
    );
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Texto variante="display">Adicionar peças</Texto>

        {aviso ? (
          <View style={estilos.aviso}>
            <Texto variante="corpoPequeno" tom="destaque">
              {aviso}
            </Texto>
          </View>
        ) : null}

        <View style={estilos.secaoFoto}>
          <Texto variante="titulo">Fotografar o que você já tem</Texto>
          <Texto variante="corpoPequeno" tom="suave">
            Coloque a peça sobre uma superfície lisa e clara. A foto fica só
            neste aparelho — não enviamos para lugar nenhum.
          </Texto>
          <View style={estilos.botoesFoto}>
            <View style={estilos.metade}>
              <Botao titulo="Escanear peça" onPress={() => capturar('camera')} />
            </View>
            <View style={estilos.metade}>
              <Botao
                titulo="Da galeria"
                variante="secundario"
                onPress={() => capturar('galeria')}
              />
            </View>
          </View>
        </View>

        <View style={estilos.divisor} />

        <Texto variante="titulo">Ou escolha peças parecidas com as suas</Texto>
        <Texto variante="corpoPequeno" tom="suave">
          Toque para adicionar. Dá para ajustar tamanho e nome depois.
        </Texto>

        {GRUPOS.map((grupo) => (
          <View key={grupo} style={estilos.grupo}>
            <Texto variante="corpoPequeno" tom="destaque" style={estilos.tituloGrupo}>
              {ROTULO_GRUPO[grupo]}
            </Texto>
            <View style={estilos.gradeCatalogo}>
              {itensDoGrupo(grupo).map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => adicionarDoCatalogo(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Adicionar ${item.nome}`}
                  accessibilityState={{ selected: adicionadas.includes(item.id) }}
                  testID={`catalogo-${item.id}`}
                  style={[
                    estilos.itemCatalogo,
                    adicionadas.includes(item.id) ? estilos.itemAdicionado : null,
                  ]}
                >
                  <IlustracaoPeca categoria={item.categoria} cor={item.cor} tamanho={56} />
                  <Texto variante="legenda" numberOfLines={2} style={estilos.nomeItem}>
                    {item.nome}
                  </Texto>
                  {adicionadas.includes(item.id) ? (
                    <Texto variante="legenda" tom="destaque">
                      Adicionada
                    </Texto>
                  ) : null}
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={estilos.rodape}>
        <Botao
          titulo={adicionadas.length > 0 ? `Pronto (${adicionadas.length})` : 'Voltar'}
          onPress={() => router.back()}
        />
      </View>
    </SafeAreaView>
  );
}

/** Passo de detalhe da peca fotografada: categoria, cor e tamanho. */
function DetalharPeca({
  rascunho,
  onCancelar,
  onPronto,
}: {
  rascunho: Rascunho;
  onCancelar: () => void;
  onPronto: () => void;
}) {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);

  const plano = useSessao((estado) => estado.usuaria?.plano ?? 'gratis');
  const adicionar = useCloset((estado) => estado.adicionar);

  const [categoria, setCategoria] = useState<Categoria>(rascunho.categoria);
  const [tamanho, setTamanho] = useState<string>(tamanhosDaCategoria(rascunho.categoria)[0]);
  const [erro, setErro] = useState<string | null>(null);

  const tamanhos = tamanhosDaCategoria(categoria);

  async function salvar() {
    const r = await adicionar(
      {
        nome: ROTULO_CATEGORIA[categoria],
        categoria,
        cor: rascunho.cor,
        tamanho: tamanhos.includes(tamanho) ? tamanho : tamanhos[0],
        origem: rascunho.origem,
      },
      plano,
    );

    if (!r.ok) {
      setErro('Você chegou ao limite de peças do seu plano. Assine para guardar mais.');
      return;
    }
    onPronto();
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Texto variante="display">Sobre a peça</Texto>

        {rascunho.origem.tipo === 'foto' ? (
          <Image
            source={rascunho.origem.caminhoLocal}
            contentFit="cover"
            style={estilos.previaFoto}
            accessible={false}
          />
        ) : null}

        <Texto variante="titulo" style={estilos.rotuloCampo}>
          O que é?
        </Texto>
        <View style={estilos.opcoes}>
          {(Object.keys(ROTULO_CATEGORIA) as Categoria[]).map((c) => (
            <Pressable
              key={c}
              onPress={() => {
                setCategoria(c);
                setTamanho(tamanhosDaCategoria(c)[0]);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: categoria === c }}
              style={[estilos.opcao, categoria === c ? estilos.opcaoAtiva : null]}
            >
              <Texto variante="corpoPequeno" tom={categoria === c ? 'destaque' : 'suave'}>
                {ROTULO_CATEGORIA[c]}
              </Texto>
            </Pressable>
          ))}
        </View>

        <Texto variante="titulo" style={estilos.rotuloCampo}>
          Tamanho
        </Texto>
        <View style={estilos.opcoes}>
          {tamanhos.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTamanho(t)}
              accessibilityRole="button"
              accessibilityState={{ selected: tamanho === t }}
              testID={`tamanho-${t}`}
              style={[estilos.opcao, tamanho === t ? estilos.opcaoAtiva : null]}
            >
              <Texto variante="corpoPequeno" tom={tamanho === t ? 'destaque' : 'suave'}>
                {t}
              </Texto>
            </Pressable>
          ))}
        </View>

        {erro ? (
          <Texto variante="corpoPequeno" tom="erro" accessibilityRole="alert">
            {erro}
          </Texto>
        ) : null}
      </ScrollView>

      <View style={estilos.rodapeDuplo}>
        <View style={estilos.metade}>
          <Botao titulo="Cancelar" variante="secundario" onPress={onCancelar} />
        </View>
        <View style={estilos.metade}>
          <Botao titulo="Salvar peça" onPress={salvar} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: paleta.bg },
    conteudo: { padding: espaco.xl, gap: espaco.sm, paddingBottom: espaco.xxl },
    aviso: {
      padding: espaco.md,
      backgroundColor: paleta.primarySoft,
      borderRadius: raio.card,
    },
    secaoFoto: { gap: espaco.sm, marginTop: espaco.md },
    botoesFoto: { flexDirection: 'row', gap: espaco.md, marginTop: espaco.sm },
    metade: { flex: 1 },
    divisor: {
      height: 1,
      backgroundColor: paleta.border,
      marginVertical: espaco.xl,
    },
    grupo: { marginTop: espaco.lg, gap: espaco.sm },
    tituloGrupo: { textTransform: 'uppercase', letterSpacing: 0.6 },
    gradeCatalogo: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
    itemCatalogo: {
      width: 96,
      alignItems: 'center',
      padding: espaco.sm,
      borderRadius: raio.card,
      borderWidth: 1,
      borderColor: paleta.border,
      backgroundColor: paleta.surface,
      gap: 2,
    },
    itemAdicionado: { borderColor: paleta.primary, backgroundColor: paleta.primarySoft },
    nomeItem: { textAlign: 'center' },
    previaFoto: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: raio.card,
      backgroundColor: paleta.primarySoft,
      marginVertical: espaco.md,
    },
    rotuloCampo: { marginTop: espaco.lg },
    opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
    opcao: {
      paddingHorizontal: espaco.lg,
      paddingVertical: espaco.sm,
      borderRadius: raio.chip,
      borderWidth: 1,
      borderColor: paleta.border,
      backgroundColor: paleta.surface,
      minHeight: 44,
      justifyContent: 'center',
    },
    opcaoAtiva: { borderColor: paleta.primary, backgroundColor: paleta.primarySoft },
    rodape: {
      padding: espaco.lg,
      borderTopWidth: 1,
      borderTopColor: paleta.border,
      backgroundColor: paleta.surface,
    },
    rodapeDuplo: {
      flexDirection: 'row',
      gap: espaco.md,
      padding: espaco.lg,
      borderTopWidth: 1,
      borderTopColor: paleta.border,
      backgroundColor: paleta.surface,
    },
  });
