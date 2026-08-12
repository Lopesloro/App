import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TelaPrivada } from '@/components/seguranca/tela-privada';
import { Texto } from '@/components/ui/texto';
import { espaco, paleta, raio } from '@/theme/tokens';

/**
 * Meu closet — exibe fotos pessoais da usuaria.
 *
 * Por isso a tela e privada desde ja: bloqueia screenshot no Android antes
 * mesmo de existir conteudo, para o controle nao ser esquecido quando as
 * fotos chegarem (issue #11). Ver docs/06-seguranca.md.
 */
export default function Closet() {
  return (
    <SafeAreaView style={estilos.tela}>
      <TelaPrivada chave="closet" />

      <Texto variante="display">Meu closet</Texto>

      <View style={estilos.aviso}>
        <Texto variante="corpoPequeno">
          Suas fotos sao privadas. Ficam criptografadas, nunca em endereco
          publico, e voce pode apagar tudo quando quiser.
        </Texto>
      </View>

      <View style={estilos.vazio}>
        <Texto variante="corpo" tom="suave">
          Adicionar pecas por foto chega na issue #11.
        </Texto>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: espaco.xl },
  aviso: {
    marginTop: espaco.lg,
    padding: espaco.lg,
    backgroundColor: paleta.primarySoft,
    borderRadius: raio.card,
  },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
