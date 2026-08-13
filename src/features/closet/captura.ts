import * as ImagePicker from 'expo-image-picker';

/**
 * Captura da foto da peca — camera ou galeria.
 *
 * REGRAS DE PRIVACIDADE (docs/06-seguranca.md) aplicadas aqui:
 *  - `exif: false` — a foto NAO carrega latitude, longitude, modelo do
 *    aparelho nem data. Foto de roupa tirada em casa levaria o endereco da
 *    usuaria junto, e isso nunca deve sair do aparelho;
 *  - recorte quadrado e compressao antes de qualquer coisa, para nao guardar
 *    imagem gigante no aparelho;
 *  - a imagem fica APENAS no armazenamento local do app. Nada e enviado.
 */

export type ResultadoCaptura =
  | { ok: true; caminhoLocal: string; largura: number; altura: number }
  | { ok: false; motivo: 'cancelado' | 'permissao-negada' | 'erro' };

const OPCOES: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
  exif: false,
};

export async function fotografarPeca(): Promise<ResultadoCaptura> {
  try {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) return { ok: false, motivo: 'permissao-negada' };

    const r = await ImagePicker.launchCameraAsync(OPCOES);
    return interpretar(r);
  } catch {
    return { ok: false, motivo: 'erro' };
  }
}

export async function escolherDaGaleria(): Promise<ResultadoCaptura> {
  try {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) return { ok: false, motivo: 'permissao-negada' };

    const r = await ImagePicker.launchImageLibraryAsync(OPCOES);
    return interpretar(r);
  } catch {
    return { ok: false, motivo: 'erro' };
  }
}

function interpretar(r: ImagePicker.ImagePickerResult): ResultadoCaptura {
  if (r.canceled) return { ok: false, motivo: 'cancelado' };

  const foto = r.assets?.[0];
  if (!foto?.uri) return { ok: false, motivo: 'erro' };

  return {
    ok: true,
    caminhoLocal: foto.uri,
    largura: foto.width ?? 0,
    altura: foto.height ?? 0,
  };
}

/** Mensagem em pt-BR para cada motivo de falha. */
export function mensagemDeFalha(motivo: Exclude<ResultadoCaptura, { ok: true }>['motivo']): string {
  if (motivo === 'permissao-negada') {
    return 'Precisamos da sua permissão para acessar a câmera ou as fotos. Você pode liberar nas configurações do aparelho.';
  }
  if (motivo === 'cancelado') return '';
  return 'Não conseguimos abrir a foto. Tente de novo.';
}
