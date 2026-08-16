import { fireEvent, render, screen } from '@testing-library/react-native';

import { buscarRoupaPorId } from '@/features/roupas/busca';
import type { TipoRoupa } from '@/features/roupas/tipos';
import { CartaoRoupa } from '../cartao-roupa';

const CAMISA = buscarRoupaPorId('camisa-social') as TipoRoupa;

describe('cartao de roupa', () => {
  it('mostra o nome e a categoria da peca', () => {
    render(<CartaoRoupa roupa={CAMISA} guardada={false} onMarcar={jest.fn()} />);

    expect(screen.getByText('Camisa social')).toBeTruthy();
    expect(screen.getByText(/Parte de cima/)).toBeTruthy();
  });

  it('tocar no cartao marca a peca', () => {
    const aoMarcar = jest.fn();
    render(<CartaoRoupa roupa={CAMISA} guardada={false} onMarcar={aoMarcar} />);

    fireEvent.press(screen.getByTestId('roupa-camisa-social'));

    expect(aoMarcar).toHaveBeenCalledWith(CAMISA);
  });

  it('anuncia para o leitor de tela se a peca ja esta guardada', () => {
    const { rerender } = render(
      <CartaoRoupa roupa={CAMISA} guardada={false} onMarcar={jest.fn()} />,
    );

    // O estado nao pode viver so na cor: quem usa leitor de tela, ou nao
    // distingue bem as cores, precisa da informacao pelo mesmo caminho.
    expect(screen.getByTestId('roupa-camisa-social').props.accessibilityState)
      .toMatchObject({ checked: false });

    rerender(<CartaoRoupa roupa={CAMISA} guardada onMarcar={jest.fn()} />);

    expect(screen.getByTestId('roupa-camisa-social').props.accessibilityState)
      .toMatchObject({ checked: true });
  });

  it('a dica de toque muda conforme o estado', () => {
    const { rerender } = render(
      <CartaoRoupa roupa={CAMISA} guardada={false} onMarcar={jest.fn()} />,
    );

    expect(screen.getByTestId('roupa-camisa-social').props.accessibilityHint).toContain(
      'guardar',
    );

    rerender(<CartaoRoupa roupa={CAMISA} guardada onMarcar={jest.fn()} />);

    expect(screen.getByTestId('roupa-camisa-social').props.accessibilityHint).toContain(
      'tirar',
    );
  });

  it('mostra o motivo do algoritmo quando ha um', () => {
    render(
      <CartaoRoupa
        roupa={CAMISA}
        guardada={false}
        onMarcar={jest.fn()}
        motivo="Combina com o clássico que você vem escolhendo."
      />,
    );

    expect(screen.getByText(/Combina com o clássico/)).toBeTruthy();
  });

  it('nao deixa espaco vazio quando nao ha motivo', () => {
    render(<CartaoRoupa roupa={CAMISA} guardada={false} onMarcar={jest.fn()} motivo={null} />);

    expect(screen.queryByText(/Combina com/)).toBeNull();
  });
});
