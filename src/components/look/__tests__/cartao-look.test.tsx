import { render, screen, fireEvent } from '@testing-library/react-native';

import { CartaoLook, descreverPecas } from '../cartao-look';
import { LOOKS_EXEMPLO } from '@/features/feed/dados-exemplo';
import type { Look } from '@/features/feed/tipos';

const lookSemIa: Look = { ...LOOKS_EXEMPLO[0], geradoPorIa: false };
const lookComIa: Look = { ...LOOKS_EXEMPLO[2], geradoPorIa: true };

describe('CartaoLook', () => {
  it('mostra titulo, quantidade de pecas e tamanhos', () => {
    render(<CartaoLook look={lookSemIa} />);

    expect(screen.getByText(lookSemIa.titulo)).toBeOnTheScreen();
    // Nao mostra preco: nada e vendido no app.
    expect(screen.getByText('3 peças · M · 40 · 37')).toBeOnTheScreen();
  });

  it('nao mostra preco em lugar nenhum do cartao', () => {
    render(<CartaoLook look={lookSemIa} />);
    expect(screen.queryByText(/R\$/)).not.toBeOnTheScreen();
  });

  it('avisa quando a imagem foi gerada por IA', () => {
    render(<CartaoLook look={lookComIa} />);
    expect(screen.getByText('Imagem gerada por IA')).toBeOnTheScreen();
  });

  it('nao mostra o aviso de IA em foto real', () => {
    render(<CartaoLook look={lookSemIa} />);
    expect(screen.queryByText('Imagem gerada por IA')).not.toBeOnTheScreen();
  });

  it('descreve o look inteiro para o leitor de tela', () => {
    render(<CartaoLook look={lookSemIa} />);
    expect(
      screen.getByLabelText(`${lookSemIa.titulo}. 3 peças, tamanhos M · 40 · 37.`),
    ).toBeOnTheScreen();
  });

  it('avisa qual look foi tocado', () => {
    const aoTocar = jest.fn();
    render(<CartaoLook look={lookSemIa} onPress={aoTocar} />);

    fireEvent.press(screen.getByTestId(`cartao-look-${lookSemIa.id}`));

    expect(aoTocar).toHaveBeenCalledWith(lookSemIa);
  });

  it('nao quebra sem handler de toque', () => {
    render(<CartaoLook look={lookSemIa} />);
    expect(() =>
      fireEvent.press(screen.getByTestId(`cartao-look-${lookSemIa.id}`)),
    ).not.toThrow();
  });

  it('usa o singular quando o look tem uma peca so', () => {
    const umaPeca: Look = { ...lookSemIa, pecas: [lookSemIa.pecas[0]] };
    render(<CartaoLook look={umaPeca} />);
    expect(screen.getByText('1 peça · M')).toBeOnTheScreen();
  });

  it('pluraliza corretamente em qualquer quantidade', () => {
    expect(descreverPecas(0)).toBe('0 peças');
    expect(descreverPecas(1)).toBe('1 peça');
    expect(descreverPecas(2)).toBe('2 peças');
  });
});
