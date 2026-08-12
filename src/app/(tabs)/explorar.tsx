import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Texto } from '@/components/ui/texto';
import { espaco } from '@/theme/tokens';

/** Busca por ocasiao, estilo, faixa de preco e marca. Issue #23. */
export default function Explorar() {
  return (
    <SafeAreaView style={estilos.tela}>
      <Texto variante="display">Explorar</Texto>
      <View style={estilos.vazio}>
        <Texto variante="corpo" tom="suave">
          Busca e filtros chegam na issue #23.
        </Texto>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: espaco.xl },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
