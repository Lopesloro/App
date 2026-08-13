import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IlustracaoPeca } from '@/components/closet/ilustracao-peca';
import { BotaoSalvar } from '@/components/look/botao-salvar';
import { IlustracaoLook } from '@/components/look/ilustracao-look';
import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { useSessao } from '@/features/auth/sessao-store';
import { ROTULO_CATEGORIA } from '@/features/closet/tipos';
import { useLook } from '@/features/feed/use-look';
import { resumoPecas, tamanhosDoLook, type Peca } from '@/features/feed/tipos';
import { mensagemLimite } from '@/features/salvos/limites';
import { useSalvos } from '@/features/salvos/salvos-store';
import { usePaleta } from '@/theme/tema-store';
import { espaco, raio, PROPORCAO_FOTO, type Paleta } from '@/theme/tokens';

export default function DetalheLook() {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { look, carregando } = useLook(id);

  const plano = useSessao((estado) => estado.usuaria?.plano ?? 'gratis');
  const ids = useSalvos((estado) => estado.ids);
  const alternarSalvo = useSalvos((estado) => estado.alternar);
  const [avisoLimite, setAvisoLimite] = useState<string | null>(null);

  async function aoSalvar() {
    if (!look) return;
    const resultado = await alternarSalvo(look.id, plano);
    setAvisoLimite(resultado.ok ? null : mensagemLimite(plano));
  }

  if (carregando) {
    return (
      <SafeAreaView style={estilos.centro}>
        <ActivityIndicator color={paleta.primary} />
      </SafeAreaView>
    );
  }

  if (!look) {
    return (
      <SafeAreaView style={estilos.centro}>
        <Texto variante="corpo" tom="suave">
          Não encontramos este look.
        </Texto>
        <Botao titulo="Voltar" variante="texto" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        {look.fotoUrl ? (
          <Image
            source={look.fotoUrl}
            placeholder={{ blurhash: look.blurhash }}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
            style={estilos.foto}
            accessible={false}
          />
        ) : (
          <View style={estilos.foto}>
            <IlustracaoLook look={look} altura={360} />
          </View>
        )}

        <View style={estilos.corpo}>
          <Texto variante="display">{look.titulo}</Texto>
          <Texto variante="corpoPequeno" tom="suave">
            {resumoPecas(look)} · tamanhos {tamanhosDoLook(look)}
          </Texto>

          {look.geradoPorIa ? (
            <Texto variante="legenda" tom="suave">
              Imagem gerada por IA
            </Texto>
          ) : null}

          <Texto variante="titulo" style={estilos.secao}>
            Peças do look
          </Texto>

          {look.pecas.map((peca) => (
            <LinhaPeca key={peca.id} peca={peca} />
          ))}

          <View style={estilos.nota}>
            <Texto variante="legenda" tom="suave">
              Ainda não vendemos nada por aqui. Estas são sugestões de
              composição — use o que você já tem no closet.
            </Texto>
          </View>
        </View>
      </ScrollView>

      <View style={estilos.rodape}>
        {avisoLimite ? (
          <Pressable
            onPress={() => router.push('/paywall')}
            accessibilityRole="button"
            style={estilos.avisoLimite}
          >
            <Texto variante="corpoPequeno" tom="destaque">
              {avisoLimite}
            </Texto>
          </Pressable>
        ) : null}

        <View style={estilos.acoesRodape}>
          <BotaoSalvar
            salvo={ids.includes(look.id)}
            onPress={aoSalvar}
            testID={`salvar-${look.id}`}
          />
          <View style={estilos.botaoVoltar}>
            <Botao titulo="Voltar" variante="secundario" onPress={() => router.back()} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function LinhaPeca({ peca }: { peca: Peca }) {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);

  return (
    <View style={estilos.peca} testID={`peca-${peca.id}`}>
      <View style={estilos.miniaturaPeca}>
        <IlustracaoPeca categoria={peca.categoria} cor={peca.cor} tamanho={40} />
      </View>
      <View style={estilos.pecaInfo}>
        <Texto variante="corpo">{peca.nome}</Texto>
        <Texto variante="corpoPequeno" tom="suave">
          {ROTULO_CATEGORIA[peca.categoria]} · tamanho {peca.tamanho}
        </Texto>
      </View>
    </View>
  );
}

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: paleta.bg },
    centro: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: espaco.md,
      backgroundColor: paleta.bg,
    },
    conteudo: { paddingBottom: espaco.xl },
    foto: {
      width: '100%',
      aspectRatio: PROPORCAO_FOTO,
      backgroundColor: paleta.primarySoft,
    },
    corpo: { padding: espaco.xl, gap: espaco.xs },
    secao: { marginTop: espaco.lg, marginBottom: espaco.sm },
    peca: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: espaco.md,
      paddingVertical: espaco.md,
      borderBottomWidth: 1,
      borderBottomColor: paleta.border,
    },
    miniaturaPeca: {
      width: 52,
      height: 52,
      borderRadius: raio.botao,
      backgroundColor: paleta.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pecaInfo: { flex: 1, gap: 2 },
    nota: { marginTop: espaco.lg },
    rodape: {
      padding: espaco.lg,
      borderTopWidth: 1,
      borderTopColor: paleta.border,
      backgroundColor: paleta.surface,
      gap: espaco.md,
    },
    acoesRodape: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
    botaoVoltar: { flex: 1 },
    avisoLimite: {
      padding: espaco.md,
      backgroundColor: paleta.primarySoft,
      borderRadius: raio.card,
    },
  });
