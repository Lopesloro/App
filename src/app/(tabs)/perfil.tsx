import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { useSessao } from '@/features/auth/sessao-store';
import { espaco } from '@/theme/tokens';

export default function Perfil() {
  const router = useRouter();
  const usuaria = useSessao((estado) => estado.usuaria);
  const sair = useSessao((estado) => estado.sair);

  async function encerrarSessao() {
    await sair();
    router.replace('/boas-vindas');
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <Texto variante="display">Perfil</Texto>
      <Texto variante="corpo" tom="suave">
        {usuaria?.nome ?? 'Visitante'} · plano {usuaria?.plano ?? 'gratis'}
      </Texto>

      <View style={estilos.acoes}>
        <Botao
          titulo="Ver planos"
          variante="secundario"
          onPress={() => router.push('/paywall')}
        />
        <Botao titulo="Sair" variante="texto" onPress={encerrarSessao} />
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: espaco.xl, gap: espaco.sm },
  acoes: { flex: 1, justifyContent: 'flex-end', gap: espaco.sm },
});
