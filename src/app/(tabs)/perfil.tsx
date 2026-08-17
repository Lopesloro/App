import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { useSessao } from '@/features/auth/sessao-store';
import { useEstilo } from '@/features/estilo/estilo-store';
import {
  confianca,
  ranking,
  resumirPerfil,
  type PerfilEstilo,
} from '@/features/estilo/perfil-estilo';
import { ROTULO_ESTILO } from '@/features/estilo/vocabulario';
import { useGuardaRoupa } from '@/features/guarda-roupa/guarda-roupa-store';
import { MONETIZACAO_ATIVA } from '@/lib/flags';
import { usePaleta, useTema } from '@/theme/tema-store';
import { espaco, raio, type Paleta } from '@/theme/tokens';

export default function Perfil() {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);
  const router = useRouter();

  const usuaria = useSessao((estado) => estado.usuaria);
  const visitante = useSessao((estado) => estado.visitante);
  const sair = useSessao((estado) => estado.sair);
  const tema = useTema();

  const perfil = useEstilo((estado) => estado.perfil);
  const esquecerEstilo = useEstilo((estado) => estado.esquecer);
  const limparArmario = useGuardaRoupa((estado) => estado.limpar);

  async function encerrarSessao() {
    await sair();
    router.replace('/boas-vindas');
  }

  /**
   * Apagar o que o app aprendeu tem que apagar as duas coisas: o perfil E o
   * armario. Deixar o armario faria o algoritmo reaprender o mesmo perfil no
   * proximo toque, e a usuaria concluiria — com razao — que o botao mente.
   */
  async function recomecarEstilo() {
    await esquecerEstilo();
    await limparArmario();
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Texto variante="display">Perfil</Texto>
        <Texto variante="corpo" tom="suave">
          {usuaria?.nome ?? 'Sem conta'}
          {MONETIZACAO_ATIVA ? ` · plano ${usuaria?.plano ?? 'gratis'}` : ''}
        </Texto>
        {visitante ? (
          <Texto variante="legenda" tom="suave">
            Você está usando sem conta. Tudo o que marcar fica só neste
            aparelho — trocar de celular começa do zero.
          </Texto>
        ) : null}

        <ReguaDeEstilo perfil={perfil} />

        <View style={estilos.acoes}>
          <Botao
            titulo={`Visual: ${tema.nome}`}
            variante="secundario"
            onPress={() => router.push('/escolher-visual')}
          />
          {MONETIZACAO_ATIVA ? (
            <Botao
              titulo="Ver planos"
              variante="secundario"
              onPress={() => router.push('/paywall')}
            />
          ) : null}
          {perfil.interacoes > 0 ? (
            <Botao
              titulo="Recomeçar meu estilo"
              variante="texto"
              onPress={() => void recomecarEstilo()}
            />
          ) : null}
          {/* Sem conta, "Sair" nao descreve o que acontece: nao ha sessao a
              encerrar, e o toque apaga o guarda-roupa. O rotulo diz isso. */}
          <Botao
            titulo={visitante ? 'Apagar tudo deste aparelho' : 'Sair'}
            variante="texto"
            onPress={encerrarSessao}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Mostra o que o algoritmo aprendeu, em vez de esconder.
 *
 * Uma recomendacao que a usuaria nao entende e uma recomendacao em que ela
 * nao confia. Aqui ela ve os estilos com peso positivo, na ordem, e o botao
 * de apagar tudo fica a um toque — quem nao consegue desfazer nao escolheu
 * de verdade.
 */
function ReguaDeEstilo({ perfil }: { perfil: PerfilEstilo }) {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);

  const positivos = ranking(perfil.estilos).filter((item) => item.peso > 0.05);
  const certeza = Math.round(confianca(perfil) * 100);

  return (
    <View style={estilos.cartaoEstilo}>
      <Texto variante="titulo">Seu estilo</Texto>
      <Texto variante="corpoPequeno" tom="suave">
        {resumirPerfil(perfil)}
      </Texto>

      {positivos.length > 0 ? (
        <View style={estilos.barras}>
          {positivos.map((item) => (
            <View key={item.valor} style={estilos.linhaBarra}>
              <Texto variante="legenda" style={estilos.rotuloBarra}>
                {ROTULO_ESTILO[item.valor]}
              </Texto>
              <View style={estilos.trilho}>
                <View
                  style={[
                    estilos.preenchimento,
                    // A barra mostra o peso relativo, nao a certeza absoluta:
                    // e um "voce puxa mais para ca", nao um diagnostico.
                    { width: `${Math.round(Math.min(1, item.peso) * 100)}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <Texto variante="legenda" tom="suave" style={estilos.rodapeEstilo}>
        {perfil.interacoes === 0
          ? 'Nada aprendido ainda.'
          : `Baseado em ${perfil.interacoes} ${perfil.interacoes === 1 ? 'escolha sua' : 'escolhas suas'} · ${certeza}% de certeza`}
      </Texto>
      <Texto variante="legenda" tom="suave">
        Tudo isso é calculado no seu celular. Não enviamos seu estilo para
        lugar nenhum.
      </Texto>
    </View>
  );
}

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
    tela: { flex: 1 },
    conteudo: { padding: espaco.xl, gap: espaco.sm, flexGrow: 1 },
    acoes: { flex: 1, justifyContent: 'flex-end', gap: espaco.sm, marginTop: espaco.xl },
    cartaoEstilo: {
      marginTop: espaco.lg,
      padding: espaco.lg,
      backgroundColor: paleta.surface,
      borderRadius: raio.card,
      borderWidth: 1,
      borderColor: paleta.border,
      gap: espaco.xs,
    },
    barras: { marginTop: espaco.md, gap: espaco.sm },
    linhaBarra: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
    rotuloBarra: { width: 92 },
    trilho: {
      flex: 1,
      height: 8,
      borderRadius: 4,
      backgroundColor: paleta.primarySoft,
      overflow: 'hidden',
    },
    preenchimento: { height: 8, borderRadius: 4, backgroundColor: paleta.primary },
    rodapeEstilo: { marginTop: espaco.md },
  });
