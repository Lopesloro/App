import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Texto } from '@/components/ui/texto';
import { espaco } from '@/theme/tokens';

/** Feed de indicacoes — pilar 1 do produto. Implementacao na issue #21. */
export default function Feed() {
  return (
    <SafeAreaView style={estilos.tela}>
      <Texto variante="display">Seus looks</Texto>
      <View style={estilos.vazio}>
        <Texto variante="corpo" tom="suave">
          O feed de indicacoes com foto chega na issue #21.
        </Texto>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: espaco.xl },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
