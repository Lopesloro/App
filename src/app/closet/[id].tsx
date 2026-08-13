import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IlustracaoPeca } from '@/components/closet/ilustracao-peca';
import { TelaPrivada } from '@/components/seguranca/tela-privada';
import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { buscarItemCatalogo } from '@/features/closet/catalogo';
import { useCloset } from '@/features/closet/closet-store';
import { ROTULO_CATEGORIA, ROTULO_COR, tamanhosDaCategoria } from '@/features/closet/tipos';
import { usePaleta } from '@/theme/tema-store';
import { espaco, raio, type Paleta } from '@/theme/tokens';

/** Detalhe da peca do closet: ver, trocar tamanho e remover. */
export default function DetalhePeca() {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const pecas = useCloset((estado) => estado.pecas);
  const remover = useCloset((estado) => estado.remover);
  const renomear = useCloset((estado) => estado.renomear);

  const peca = pecas.find((p) => p.id === id) ?? null;
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false);

  if (!peca) {
    return (
      <SafeAreaView style={estilos.centro}>
        <Texto variante="corpo" tom="suave">
          Esta peça não está mais no seu closet.
        </Texto>
        <Botao titulo="Voltar" variante="texto" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const item = peca.origem.tipo === 'catalogo' ? buscarItemCatalogo(peca.origem.idCatalogo) : null;
  const tamanhos = tamanhosDaCategoria(peca.categoria);

  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'left', 'right']}>
      {/* Exibe foto pessoal: bloqueia captura de tela no Android. */}
      <TelaPrivada chave={`peca-${peca.id}`} />

      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.previa}>
          {peca.origem.tipo === 'foto' ? (
            <Image
              source={peca.origem.caminhoLocal}
              contentFit="cover"
              style={estilos.foto}
              accessible={false}
            />
          ) : (
            <IlustracaoPeca
              categoria={item?.categoria ?? peca.categoria}
              cor={item?.cor ?? peca.cor}
              tamanho={140}
            />
          )}
        </View>

        <Texto variante="display">{peca.nome}</Texto>
        <Texto variante="corpoPequeno" tom="suave">
          {ROTULO_CATEGORIA[peca.categoria]} · {ROTULO_COR[peca.cor]}
        </Texto>

        {peca.origem.tipo === 'foto' ? (
          <View style={estilos.aviso}>
            <Texto variante="legenda" tom="suave">
              Esta foto está guardada só neste aparelho. Não enviamos para
              nenhum servidor.
            </Texto>
          </View>
        ) : null}

        <Texto variante="titulo" style={estilos.rotulo}>
          Tamanho
        </Texto>
        <View style={estilos.opcoes}>
          {tamanhos.map((t) => (
            <Pressable
              key={t}
              onPress={() => void renomear(peca.id, peca.nome)}
              accessibilityRole="button"
              accessibilityState={{ selected: peca.tamanho === t }}
              style={[estilos.opcao, peca.tamanho === t ? estilos.opcaoAtiva : null]}
            >
              <Texto variante="corpoPequeno" tom={peca.tamanho === t ? 'destaque' : 'suave'}>
                {t}
              </Texto>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={estilos.rodape}>
        {confirmandoRemocao ? (
          <>
            <Texto variante="corpoPequeno" tom="erro">
              Remover esta peça do seu closet?
            </Texto>
            <View style={estilos.linhaBotoes}>
              <View style={estilos.metade}>
                <Botao
                  titulo="Cancelar"
                  variante="secundario"
                  onPress={() => setConfirmandoRemocao(false)}
                />
              </View>
              <View style={estilos.metade}>
                <Botao
                  titulo="Remover"
                  onPress={async () => {
                    await remover(peca.id);
                    router.back();
                  }}
                />
              </View>
            </View>
          </>
        ) : (
          <View style={estilos.linhaBotoes}>
            <View style={estilos.metade}>
              <Botao
                titulo="Remover"
                variante="texto"
                onPress={() => setConfirmandoRemocao(true)}
              />
            </View>
            <View style={estilos.metade}>
              <Botao titulo="Voltar" variante="secundario" onPress={() => router.back()} />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
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
    conteudo: { padding: espaco.xl, gap: espaco.xs, paddingBottom: espaco.xxl },
    previa: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: raio.card,
      backgroundColor: paleta.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      marginBottom: espaco.lg,
    },
    foto: { width: '100%', height: '100%' },
    aviso: {
      marginTop: espaco.md,
      padding: espaco.md,
      backgroundColor: paleta.primarySoft,
      borderRadius: raio.card,
    },
    rotulo: { marginTop: espaco.lg, marginBottom: espaco.sm },
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
      gap: espaco.md,
    },
    linhaBotoes: { flexDirection: 'row', gap: espaco.md },
    metade: { flex: 1 },
  });
