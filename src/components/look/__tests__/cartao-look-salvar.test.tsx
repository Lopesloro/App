import { render, screen, fireEvent } from '@testing-library/react-native';

import { CartaoLook } from '../cartao-look';
import { LOOKS_EXEMPLO } from '@/features/feed/dados-exemplo';

const look = LOOKS_EXEMPLO[0];

describe('coracao de salvar no cartao', () => {
  it('nao aparece quando a tela nao oferece salvar', () => {
    render(<CartaoLook look={look} />);
    expect(screen.queryByTestId(`salvar-cartao-${look.id}`)).not.toBeOnTheScreen();
  });

  it('aparece quando a tela oferece salvar', () => {
    render(<CartaoLook look={look} aoSalvar={jest.fn()} />);
    expect(screen.getByTestId(`salvar-cartao-${look.id}`)).toBeOnTheScreen();
  });

  it('mostra coracao vazio quando nao esta salvo', () => {
    render(<CartaoLook look={look} aoSalvar={jest.fn()} salvo={false} />);
    expect(screen.getByText('♡')).toBeOnTheScreen();
  });

  it('mostra coracao cheio quando esta salvo', () => {
    render(<CartaoLook look={look} aoSalvar={jest.fn()} salvo />);
    expect(screen.getByText('♥')).toBeOnTheScreen();
  });

  it('avisa qual look salvar', () => {
    const aoSalvar = jest.fn();
    render(<CartaoLook look={look} aoSalvar={aoSalvar} />);

    fireEvent.press(screen.getByTestId(`salvar-cartao-${look.id}`));

    expect(aoSalvar).toHaveBeenCalledWith(look);
  });

  it('salvar nao dispara o toque de abrir o look', () => {
    const aoAbrir = jest.fn();
    const aoSalvar = jest.fn();
    render(<CartaoLook look={look} onPress={aoAbrir} aoSalvar={aoSalvar} />);

    fireEvent.press(screen.getByTestId(`salvar-cartao-${look.id}`));

    expect(aoSalvar).toHaveBeenCalledTimes(1);
    expect(aoAbrir).not.toHaveBeenCalled();
  });

  it('anuncia a acao certa para o leitor de tela', () => {
    const { rerender } = render(<CartaoLook look={look} aoSalvar={jest.fn()} />);
    expect(screen.getByLabelText('Salvar look')).toBeOnTheScreen();

    rerender(<CartaoLook look={look} aoSalvar={jest.fn()} salvo />);
    expect(screen.getByLabelText('Remover dos salvos')).toBeOnTheScreen();
  });
});
