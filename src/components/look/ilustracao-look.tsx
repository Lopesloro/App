import { StyleSheet, View } from 'react-native';

import { IlustracaoPeca } from '@/components/closet/ilustracao-peca';
import { PARTE_DA_CATEGORIA } from '@/features/closet/tipos';
import type { Look } from '@/features/feed/tipos';
import { usePaleta } from '@/theme/tema-store';

type Props = {
  look: Look;
  altura?: number;
};

/**
 * Desenho do look montado, a partir das pecas que o compoem.
 *
 * Enquanto a curadoria nao publica foto (issue #22), e isto que a usuaria ve
 * no feed: a composicao real das pecas, no mesmo tracado do closet dela.
 * Fica coerente — o que ela ve na indicacao tem a mesma linguagem visual do
 * que ela cadastrou.
 *
 * As pecas sao dispostas por parte do corpo, de cima para baixo, para o
 * conjunto ler como um look e nao como uma lista de icones soltos.
 */
export function IlustracaoLook({ look, altura = 200 }: Props) {
  const paleta = usePaleta();

  const cima = look.pecas.filter((p) => PARTE_DA_CATEGORIA[p.categoria] === 'cima');
  const inteiro = look.pecas.filter(
    (p) => PARTE_DA_CATEGORIA[p.categoria] === 'corpo-inteiro',
  );
  const baixo = look.pecas.filter((p) => PARTE_DA_CATEGORIA[p.categoria] === 'baixo');
  const pes = look.pecas.filter((p) => PARTE_DA_CATEGORIA[p.categoria] === 'pes');
  const extras = look.pecas.filter(
    (p) => PARTE_DA_CATEGORIA[p.categoria] === 'complemento',
  );

  // Vestido e macacao ocupam o corpo todo: nesse caso nao ha "baixo".
  const tronco = inteiro.length > 0 ? inteiro : cima;
  const pernas = inteiro.length > 0 ? [] : baixo;

  const escalaTronco = altura * 0.42;
  const escalaPernas = altura * 0.38;
  const escalaPe = altura * 0.22;

  return (
    <View
      style={[estilos.area, { height: altura, backgroundColor: paleta.primarySoft }]}
      accessible={false}
    >
      <View style={estilos.corpo}>
        {tronco.map((p) => (
          <IlustracaoPeca
            key={p.id}
            categoria={p.categoria}
            cor={p.cor}
            tamanho={escalaTronco}
          />
        ))}
        {pernas.map((p) => (
          <IlustracaoPeca
            key={p.id}
            categoria={p.categoria}
            cor={p.cor}
            tamanho={escalaPernas}
          />
        ))}
      </View>

      <View style={estilos.rodape}>
        {pes.map((p) => (
          <IlustracaoPeca key={p.id} categoria={p.categoria} cor={p.cor} tamanho={escalaPe} />
        ))}
        {extras.map((p) => (
          <IlustracaoPeca key={p.id} categoria={p.categoria} cor={p.cor} tamanho={escalaPe} />
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  area: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  corpo: { alignItems: 'center', marginTop: -4 },
  rodape: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: -6 },
});
