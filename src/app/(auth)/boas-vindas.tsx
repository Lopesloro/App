import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { useSessao } from '@/features/auth/sessao-store';
import { espaco } from '@/theme/tokens';

/**
 * Primeira tela.
 *
 * "Começar" entra direto no app, sem cadastro. Nao e atalho de
 * desenvolvimento: o app inteiro funciona no aparelho, entao pedir e-mail e
 * senha para entregar o que ja funciona sem eles seria coletar dado pessoal
 * a troco de nada — o oposto do que o projeto promete (docs/06-seguranca.md).
 *
 * A conta entra quando passar a servir para algo que so servidor faz:
 * levar o guarda-roupa para outro celular (issue #6).
 */
export default function BoasVindas() {
  const router = useRouter();
  const entrarSemConta = useSessao((estado) => estado.entrarSemConta);

  async function comecar() {
    await entrarSemConta();
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <View style={estilos.conteudo}>
        <Texto variante="displayGrande">Seu guarda-roupa,{'\n'}do seu jeito.</Texto>
        <Texto variante="corpo" tom="suave" style={estilos.subtitulo}>
          Procure as roupas que você tem, marque, e eu aprendo o seu estilo —
          tudo aqui no seu celular, sem enviar nada para lugar nenhum.
        </Texto>
      </View>

      <View style={estilos.acoes}>
        <Botao titulo="Começar" onPress={() => void comecar()} />
        <Botao
          titulo="Já tenho conta"
          variante="texto"
          onPress={() => router.push('/login')}
        />
        <Texto variante="legenda" tom="suave" style={estilos.aviso}>
          Sem cadastro e sem anúncios. O que você marcar fica só neste
          aparelho.
        </Texto>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: espaco.xl, justifyContent: 'space-between' },
  conteudo: { flex: 1, justifyContent: 'center' },
  subtitulo: { marginTop: espaco.md },
  acoes: { gap: espaco.sm },
  aviso: { textAlign: 'center', marginTop: espaco.sm },
});
