import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

// ✅ Validación
const schema = Yup.object({
  name: Yup.string()
    .min(2, 'Mínimo 2 caracteres')
    .required('El nombre es obligatorio'),
  email: Yup.string()
    .email('Email inválido')
    .required('El email es obligatorio'),
  password: Yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('La contraseña es obligatoria'),
  confirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});

type Nav = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  // refs para saltar entre inputs con Enter
  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const confRef = useRef<TextInput>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b0c16' }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0c0f17', '#0c1222', '#0b0c16']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={s.card}>
            <Text style={s.title}>Crea tu cuenta</Text>
            <Text style={s.subtitle}>Únete a Harmony Social 🎧</Text>

            <Formik
              initialValues={{ name: '', email: '', password: '', confirm: '' }}
              validationSchema={schema}
              onSubmit={async (vals, { setSubmitting }) => {
                try {
                  // TODO: aquí llamas a tu API real (fetch/axios)
                  await new Promise(r => setTimeout(r, 700));
                  // Si todo ok, entra a la app (Main = tus tabs)
                  navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
                isValid,
              }) => (
                <>
                  {/* Nombre */}
                  <Text style={s.label}>Nombre</Text>
                  <TextInput
                    style={[
                      s.input,
                      touched.name && errors.name ? s.inputError : null,
                    ]}
                    placeholder="Tu nombre"
                    placeholderTextColor="#8A90A6"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                  />
                  {touched.name && !!errors.name && (
                    <Text style={s.error}>{errors.name}</Text>
                  )}

                  {/* Email */}
                  <Text style={s.label}>Email</Text>
                  <TextInput
                    ref={emailRef}
                    style={[
                      s.input,
                      touched.email && errors.email ? s.inputError : null,
                    ]}
                    placeholder="tu@correo.com"
                    placeholderTextColor="#8A90A6"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    returnKeyType="next"
                    onSubmitEditing={() => passRef.current?.focus()}
                  />
                  {touched.email && !!errors.email && (
                    <Text style={s.error}>{errors.email}</Text>
                  )}

                  {/* Password */}
                  <Text style={s.label}>Contraseña</Text>
                  <View style={{ position: 'relative' }}>
                    <TextInput
                      ref={passRef}
                      style={[
                        s.input,
                        s.inputWithAffix,
                        touched.password && errors.password
                          ? s.inputError
                          : null,
                      ]}
                      placeholder="••••••••"
                      placeholderTextColor="#8A90A6"
                      secureTextEntry={!showPass}
                      autoCapitalize="none"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      returnKeyType="next"
                      onSubmitEditing={() => confRef.current?.focus()}
                    />
                    <Pressable
                      style={s.affix}
                      onPress={() => setShowPass(v => !v)}
                    >
                      <Text style={s.affixText}>
                        {showPass ? 'Ocultar' : 'Mostrar'}
                      </Text>
                    </Pressable>
                  </View>
                  {touched.password && !!errors.password && (
                    <Text style={s.error}>{errors.password}</Text>
                  )}

                  {/* Confirmación */}
                  <Text style={s.label}>Confirmar contraseña</Text>
                  <View style={{ position: 'relative' }}>
                    <TextInput
                      ref={confRef}
                      style={[
                        s.input,
                        s.inputWithAffix,
                        touched.confirm && errors.confirm ? s.inputError : null,
                      ]}
                      placeholder="••••••••"
                      placeholderTextColor="#8A90A6"
                      secureTextEntry={!showConf}
                      autoCapitalize="none"
                      value={values.confirm}
                      onChangeText={handleChange('confirm')}
                      onBlur={handleBlur('confirm')}
                      returnKeyType="done"
                      onSubmitEditing={() => handleSubmit()}
                    />
                    <Pressable
                      style={s.affix}
                      onPress={() => setShowConf(v => !v)}
                    >
                      <Text style={s.affixText}>
                        {showConf ? 'Ocultar' : 'Mostrar'}
                      </Text>
                    </Pressable>
                  </View>
                  {touched.confirm && !!errors.confirm && (
                    <Text style={s.error}>{errors.confirm}</Text>
                  )}

                  {/* Botón crear cuenta */}
                  <LinearGradient
                    colors={['#7C4DFF', '#4C63F2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={s.btnGrad}
                  >
                    <Pressable
                      onPress={() => handleSubmit()}
                      disabled={!isValid || isSubmitting}
                      style={({ pressed }) => [
                        s.btn,
                        (!isValid || isSubmitting) && s.btnDisabled,
                        pressed && s.btnPressed,
                      ]}
                    >
                      <Text style={s.btnText}>Crear cuenta</Text>
                    </Pressable>
                  </LinearGradient>

                  {/* Ya tengo cuenta */}
                  <Pressable
                    onPress={() => navigation.goBack()}
                    style={{ marginTop: 14 }}
                  >
                    <Text style={s.link}>¿Ya tienes cuenta? Inicia sesión</Text>
                  </Pressable>
                </>
              )}
            </Formik>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#1b1f27e6',
    borderColor: '#ffffff22',
    borderWidth: 1,
    borderRadius: 18,
    padding: 22,
  },
  title: {
    color: '#E6EAF2',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#A8B0C3',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },

  label: { color: '#CDD3E1', fontSize: 13, marginTop: 10, marginBottom: 6 },
  input: {
    backgroundColor: '#242A35',
    borderWidth: 1,
    borderColor: '#323A48',
    color: '#E6EAF2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputWithAffix: { paddingRight: 76 },
  inputError: { borderColor: '#EF4444' },
  error: { color: '#EF4444', marginTop: 6, fontSize: 12 },

  affix: {
    position: 'absolute',
    right: 10,
    top: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  affixText: { color: '#9AA3B2', fontWeight: '600' },

  btnGrad: { borderRadius: 14, marginTop: 18 },
  btn: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  btnPressed: { opacity: 0.9 },
  btnText: { color: '#F2F4FF', fontWeight: '800' },

  link: {
    color: '#C9D0E3',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
