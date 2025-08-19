import React from 'react';
import {
  SafeAreaView, StatusBar, View, Text, TextInput, StyleSheet,
  Pressable, ScrollView, Linking, Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

const schema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('El email es obligatorio'),
});

export default function ResetPasswordScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b0c16' }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0c0f17', '#0c1222', '#0b0c16']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={s.card}>
            <Text style={s.title}>Restablecer contraseña</Text>
            <Text style={s.subtitle}>
              Ingresa tu email y te enviaremos un enlace para restablecerla.
            </Text>

            <Formik
              initialValues={{ email: '' }}
              validationSchema={schema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  // TODO: reemplaza por tu llamada real (axios/fetch)
                  // await fetch('https://tu-api.com/auth/password/forgot', { ... });
                  await new Promise(r => setTimeout(r, 700));

                  Alert.alert(
                    'Revisa tu correo',
                    `Si ${values.email} está registrado, te enviamos instrucciones.`
                  );
                  navigation.goBack(); // vuelve al Login
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, isValid }) => (
                <>
                  <Text style={s.label}>Email</Text>
                  <TextInput
                    style={[s.input, touched.email && errors.email ? s.inputError : null]}
                    placeholder="tu@correo.com"
                    placeholderTextColor="#8A90A6"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    returnKeyType="done"
                    onSubmitEditing={() => handleSubmit()}
                  />
                  {touched.email && !!errors.email && <Text style={s.error}>{errors.email}</Text>}

                  <LinearGradient colors={['#7C4DFF', '#4C63F2']} start={{x:0,y:0}} end={{x:1,y:1}} style={s.btnGrad}>
                    <Pressable
                      onPress={() => handleSubmit()}
                      disabled={!isValid || isSubmitting}
                      style={({ pressed }) => [s.btn, (!isValid || isSubmitting) && s.btnDisabled, pressed && s.btnPressed]}
                    >
                      <Text style={s.btnText}>Enviar enlace</Text>
                    </Pressable>
                  </LinearGradient>

                  <Pressable onPress={() => Linking.openURL('mailto:')} style={{ marginTop: 14 }}>
                    <Text style={s.link}>Abrir app de correo</Text>
                  </Pressable>

                  <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 6 }}>
                    <Text style={s.linkMuted}>Volver a iniciar sesión</Text>
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
    backgroundColor: '#1b1f27e6', borderColor: '#ffffff22', borderWidth: 1,
    borderRadius: 18, padding: 22,
  },
  title: { color: '#E6EAF2', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#A8B0C3', fontSize: 13, textAlign: 'center', marginTop: 4, marginBottom: 18 },

  label: { color: '#CDD3E1', fontSize: 13, marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: '#242A35', borderWidth: 1, borderColor: '#323A48', color: '#E6EAF2',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
  },
  inputError: { borderColor: '#EF4444' },
  error: { color: '#EF4444', marginTop: 6, fontSize: 12 },

  btnGrad: { borderRadius: 14, marginTop: 18 },
  btn: { borderRadius: 14, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnPressed: { opacity: 0.9 },
  btnText: { color: '#F2F4FF', fontWeight: '800' },

  link: { color: '#C9D0E3', textAlign: 'center', textDecorationLine: 'underline', fontWeight: '600' },
  linkMuted: { color: '#A8B0C3', textAlign: 'center', textDecorationLine: 'underline', fontWeight: '600' },
});
