import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao } from '@/components/ui/botao';
import { Texto } from '@/components/ui/texto';
import { credenciaisSchema, forcaSenha } from '@/features/auth/schemas';
import { espaco, paleta, raio, tipografia } from '@/theme/tokens';

/**
 * Tela de login/cadastro.
 *
 * Neste scaffold a validacao ja e a definitiva (schemas zod compartilhados),
 * mas a chamada de rede fica pendente ate a API de auth existir — issues #6 e #7.
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  const forca = senha.length > 0 ? forcaSenha(senha) : null;

  function validar() {
    const resultado = credenciaisSchema.safeParse({ email, senha });
    if (!resultado.success) {
      // Mensagem generica de campo, sem revelar se o e-mail existe na base
      // (criterio de seguranca das issues #6 e #8).
      setErro(resultado.error.issues[0]?.message ?? 'Confira os dados.');
      return;
    }
    setErro(null);
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <Texto variante="display">Entrar</Texto>

      <View style={estilos.campos}>
        <View>
          <Texto variante="legenda" tom="suave">
            E-mail
          </Texto>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={estilos.input}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            inputMode="email"
            accessibilityLabel="E-mail"
            placeholder="voce@exemplo.com"
            placeholderTextColor={paleta.inkSoft}
          />
        </View>

        <View>
          <Texto variante="legenda" tom="suave">
            Senha
          </Texto>
          <TextInput
            value={senha}
            onChangeText={setSenha}
            style={estilos.input}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="current-password"
            accessibilityLabel="Senha"
            placeholder="Pelo menos 8 caracteres"
            placeholderTextColor={paleta.inkSoft}
          />
          {forca ? (
            <Texto variante="legenda" tom={forca === 'fraca' ? 'erro' : 'suave'}>
              Força da senha: {forca}
            </Texto>
          ) : null}
        </View>

        {erro ? (
          <Texto variante="corpoPequeno" tom="erro" accessibilityRole="alert">
            {erro}
          </Texto>
        ) : null}
      </View>

      <Botao titulo="Continuar" onPress={validar} />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: espaco.xl, gap: espaco.xl },
  campos: { flex: 1, gap: espaco.lg, marginTop: espaco.xl },
  input: {
    borderWidth: 1,
    borderColor: paleta.border,
    backgroundColor: paleta.surface,
    borderRadius: raio.botao,
    paddingHorizontal: espaco.lg,
    minHeight: 52,
    color: paleta.ink,
    fontSize: tipografia.corpo.fontSize,
    marginTop: espaco.xs,
  },
});
