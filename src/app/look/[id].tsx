import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BotaoSalvar } from '@/components/look/botao-salvar';
import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { formatarPreco } from '@/features/assinatura/planos';
import { useSessao } from '@/features/auth/sessao-store';
import { AVISO_COMISSAO, montarUrlCompra } from '@/features/feed/afiliado';
import { useLook } from '@/features/feed/use-look';
import { precoTotalLook, type Peca, type Look } from '@/features/feed/tipos';
import { mensagemLimite } from '@/features/salvos/limites';
import { useSalvos } from '@/features/salvos/salvos-store';
import { espaco, paleta, raio, PROPORCAO_FOTO } from '@/theme/tokens';

export default function DetalheLook() {
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
    if (!resultado.ok) {
      setAvisoLimite(mensagemLimite(plano));
    }
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

  const total = precoTotalLook(look);
  const disponiveis = look.pecas.filter((p) => p.urlLoja !== null).length;

  return (
    <SafeAreaView style={estilos.tela} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Image
          source={look.fotoUrl}
          placeholder={{ blurhash: look.blurhash }}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          style={estilos.foto}
          accessible={false}
        />

        <View style={estilos.corpo}>
          <Texto variante="display">{look.titulo}</Texto>
          <Texto variante="corpoPequeno" tom="suave">
            {look.pecas.length === 1 ? '1 peça' : `${look.pecas.length} peças`} · total{' '}
            {formatarPreco(total)}
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
            <LinhaPeca key={peca.id} peca={peca} look={look} />
          ))}

          {disponiveis > 0 ? (
            <Texto variante="legenda" tom="suave" style={estilos.aviso}>
              {AVISO_COMISSAO}
            </Texto>
          ) : null}
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

function LinhaPeca({ peca, look }: { peca: Peca; look: Look }) {
  const url = montarUrlCompra(peca, look, { origemInterna: 'detalhe-look' });

  async function abrirLoja() {
    if (!url) return;
    // Navegador dentro do app: a usuaria nao perde o contexto do look.
    await WebBrowser.openBrowserAsync(url);
  }

  return (
    <View style={estilos.peca} testID={`peca-${peca.id}`}>
      <View style={estilos.pecaInfo}>
        <Texto variante="corpo">{peca.nome}</Texto>
        <Texto variante="corpoPequeno" tom="suave">
          {peca.marca} · {formatarPreco(peca.precoCentavos)}
        </Texto>
      </View>

      {url ? (
        <Pressable
          onPress={abrirLoja}
          accessibilityRole="link"
          accessibilityLabel={`Ver ${peca.nome} da ${peca.marca} na loja`}
          testID={`comprar-${peca.id}`}
          style={estilos.botaoLoja}
        >
          <Texto variante="corpoPequeno" tom="destaque">
            Ver na loja
          </Texto>
        </Pressable>
      ) : (
        <Texto variante="legenda" tom="suave">
          Indisponível
        </Texto>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: paleta.bg },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.md,
    backgroundColor: paleta.bg,
  },
  conteudo: { paddingBottom: espaco.xl },
  foto: { width: '100%', aspectRatio: PROPORCAO_FOTO, backgroundColor: paleta.primarySoft },
  corpo: { padding: espaco.xl, gap: espaco.xs },
  secao: { marginTop: espaco.lg, marginBottom: espaco.sm },
  peca: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaco.md,
    paddingVertical: espaco.md,
    borderBottomWidth: 1,
    borderBottomColor: paleta.border,
  },
  pecaInfo: { flex: 1, gap: 2 },
  botaoLoja: {
    paddingHorizontal: espaco.lg,
    paddingVertical: espaco.sm,
    borderRadius: raio.chip,
    borderWidth: 1,
    borderColor: paleta.primary,
    minHeight: 44,
    justifyContent: 'center',
  },
  aviso: { marginTop: espaco.lg },
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
