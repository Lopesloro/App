import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

import { NEON_FUTURO } from '@/theme/tokens';

/**
 * O HTML que envolve o app na web.
 *
 * Existe por um motivo so, e ele aparece em um piscar de olhos: entre o
 * navegador carregar a pagina e o React desenhar a primeira tela, quem manda
 * na cor e o documento. Sem isto, o intervalo e branco — um flash violento
 * antes de um app de fundo escuro, e a primeira impressao de quem chega.
 *
 * O mesmo vale para o arrasto alem do fim da pagina no celular, que revela o
 * fundo do documento por baixo do app.
 *
 * A cor e a do tema padrao, importada do token — nao repetida a mao.
 *
 * Este arquivo roda so na web, na hora de gerar o HTML. Nao existe no
 * aplicativo de celular.
 */
export default function Html({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content={NEON_FUTURO.bg} />

        {/*
          Sem isto o `ScrollView` do React Native Web rola o documento inteiro
          em vez de rolar dentro do proprio componente, e o layout de tela
          cheia quebra. Vem da propria expo-router.
        */}
        <ScrollViewStyleReset />

        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root {
                background-color: ${NEON_FUTURO.bg};
                /* Impede o "puxa e mostra branco" no iOS. */
                overscroll-behavior: none;
              }
              body { margin: 0; }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
