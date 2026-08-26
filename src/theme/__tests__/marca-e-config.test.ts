import { FUNDO_DA_MARCA } from '../../../app.config';
import { TEMAS, TEMA_PADRAO } from '../temas';

/**
 * A configuracao nativa e o tema do app precisam concordar na mesma cor.
 *
 * `app.config.ts` roda no Node, antes de o bundle existir, entao nao consegue
 * importar `tokens.ts`. O valor fica repetido por necessidade — e este teste
 * e o que impede a repeticao de virar divergencia.
 *
 * Se divergirem, o sintoma e feio e dificil de rastrear: a splash pisca com
 * uma cor e o app abre com outra, num flash que so aparece no aparelho e
 * nunca no navegador.
 */
describe('splash e icone acompanham o tema padrao', () => {
  it('o fundo da marca e exatamente o fundo do tema padrao', () => {
    expect(FUNDO_DA_MARCA).toBe(TEMAS[TEMA_PADRAO].paleta.bg);
  });

  it('o tema padrao e escuro, como a configuracao nativa declara', () => {
    // app.config.ts fixa userInterfaceStyle: 'dark'. Se o padrao virar um
    // tema claro um dia, este teste lembra de trocar la tambem.
    expect(TEMAS[TEMA_PADRAO].escuro).toBe(true);
  });
});
