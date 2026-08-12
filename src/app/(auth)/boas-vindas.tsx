import { StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { espaco } from '@/theme/tokens';

export default function BoasVindas() {
  const router = useRouter();

  return (
    <SafeAreaView style={estilos.tela}>
      <View style={estilos.conteudo}>
        <Texto variante="displayGrande">Seu look de hoje,{'\n'}resolvido.</Texto>
        <Texto variante="corpo" tom="suave" style={estilos.subtitulo}>
          Indicações com foto, feitas para o seu estilo — e suas fotos ficam
          privadas de verdade.
        </Texto>
      </View>

      <View style={estilos.acoes}>
        <Botao titulo="Começar" onPress={() => router.push('/login')} />
        <Botao
          titulo="Já tenho conta"
          variante="texto"
          onPress={() => router.push('/login')}
        />
        <Link href="/login" style={estilos.link}>
          <Texto variante="legenda" tom="suave">
            Ao continuar, você aceita nossos termos e a política de privacidade.
          </Texto>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: espaco.xl, justifyContent: 'space-between' },
  conteudo: { flex: 1, justifyContent: 'center' },
  subtitulo: { marginTop: espaco.md },
  acoes: { gap: espaco.sm },
  link: { textAlign: 'center', marginTop: espaco.sm },
});
