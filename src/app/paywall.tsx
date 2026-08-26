import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { PLANOS } from '@/features/assinatura/planos';
import { MONETIZACAO_ATIVA } from '@/lib/flags';
import { usePaleta } from '@/theme/tema-store';
import { espaco, raio, type Paleta } from '@/theme/tokens';

/**
 * Tela de planos. O motor de compra (RevenueCat) entra na issue #30;
 * aqui fica a apresentacao, ja com os precos oficiais do projeto.
 *
 * Nao ha caminho ate aqui enquanto `MONETIZACAO_ATIVA` for `false` — nenhum
 * botao aponta para esta rota. A guarda abaixo cobre o que a navegacao nao
 * cobre: link externo (`montalooks://paywall`) e rota digitada. Mostrar
 * preco de algo que nao esta a venda seria promessa falsa.
 */
export default function Paywall() {
  const paleta = usePaleta();
  const estilos = useMemo(() => criarEstilos(paleta), [paleta]);
  const router = useRouter();

  if (!MONETIZACAO_ATIVA) {
    return <Redirect href="/(tabs)" />;
  }

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

const criarEstilos = (paleta: Paleta) =>
  StyleSheet.create({
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
