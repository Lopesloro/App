import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { PLANOS } from '@/features/assinatura/planos';
import { espaco, paleta, raio } from '@/theme/tokens';

/**
 * Tela de planos. O motor de compra (RevenueCat) entra na issue #30;
 * aqui fica a apresentacao, ja com os precos oficiais do projeto.
 */
export default function Paywall() {
  const router = useRouter();

  return (
    <SafeAreaView style={estilos.tela}>
      <Texto variante="display">Escolha seu plano</Texto>

      <View style={estilos.planos}>
        {PLANOS.map((plano) => (
          <View
            key={plano.id}
            style={[estilos.cartao, plano.destaque ? estilos.destaque : null]}
          >
            <Texto variante="titulo">{plano.nome}</Texto>
            <Texto variante="displayGrande" tom="destaque">
              {plano.precoFormatado}
            </Texto>
            <Texto variante="legenda" tom="suave">
              {plano.periodo}
            </Texto>
            {plano.beneficios.map((beneficio) => (
              <Texto key={beneficio} variante="corpoPequeno" tom="suave">
                • {beneficio}
              </Texto>
            ))}
          </View>
        ))}
      </View>

      <Botao titulo="Fechar" variante="texto" onPress={() => router.back()} />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: espaco.xl, gap: espaco.lg },
  planos: { flex: 1, gap: espaco.md },
  cartao: {
    backgroundColor: paleta.surface,
    borderRadius: raio.card,
    borderWidth: 1,
    borderColor: paleta.border,
    padding: espaco.lg,
    gap: espaco.xs,
  },
  destaque: { borderColor: paleta.primary, borderWidth: 2 },
});
