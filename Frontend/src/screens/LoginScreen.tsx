import React, { useMemo, useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import * as Yup from 'yup';

// ---- Navegación ----
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App'; // export type en src/App.tsx
type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

/* eslint-disable react-native/no-inline-styles */
const LOGO = require('../assets/img/HarmonyImgNueva.png');

const validationSchema = Yup.object().shape({
  userOrEmail: Yup.string().required('El nombre de usuario es obligatorio'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 dígitos')
    .required('La contraseña es obligatoria'),
});


/** ==== Equalizer decorativo (solo UI) ==== */
function EqBars({
  bars = 12,
  color = '#6F9BFF',
  heightMin = 8,
  heightMax = 28,
}: {
  bars?: number;
  color?: string;
  heightMin?: number;
  heightMax?: number;
}) {
  const anims = useMemo(
    () => Array.from({ length: bars }, () => new Animated.Value(0)),
    [bars]
  );

  useEffect(() => {
    anims.forEach((v, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, {
            toValue: 1,
            duration: 800 + (i % 3) * 150,
            delay: i * 90,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false, // height no soporta native driver
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: 700 + ((i + 1) % 3) * 120,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
  }, [anims]);

  return (
    <View style={styles.eqRow} pointerEvents="none">
      {anims.map((v, i) => {
        const h = v.interpolate({
          inputRange: [0, 1],
          outputRange: [heightMin, heightMax + (i % 2) * 8],
        });
        return (
          <Animated.View
            key={i}
            style={[styles.eqBar, { height: h, opacity: 0.9, backgroundColor: color }]}
          />
        );
      })}
    </View>
  );
}

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const [showPassword, setShowPassword] = useState(false);
  const [focus, setFocus] = useState<'user' | 'pass' | null>(null);

  // Refs para UX
  const userRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0c0f17', '#0c1222', '#0b0c16']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bg}
      >
        {/* Vinilo decorativo */}
        <View style={styles.vinylWrap} pointerEvents="none">
          <View style={styles.vinylOuter} />
          <View style={styles.vinylRing} />
          <LinearGradient
            colors={['#5b69f266', '#6D28D944']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.vinylInner}
          />
          <View style={styles.vinylHole} />
        </View>

        {/* Equalizer detrás del card */}
        <View style={styles.eqBehind}>
          <EqBars />
        </View>

        <KeyboardAvoidingView
          style={styles.kb}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.card}>
              {/* Logo */}
              <View style={styles.logoWrap}>
                <Image source={LOGO} style={styles.logo} resizeMode="contain" />
              </View>

              <Text style={styles.title}>Harmony Social</Text>
              <Text style={styles.subtitle}>Tu mundo musical, comparte y descubre.</Text>

              <Formik
                initialValues={{ userOrEmail: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {

                    await new Promise((r) => setTimeout(r, 600));


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
                  isValid,
                  isSubmitting,
                }) => (
                  <>
                    {/* Usuario / Email */}
                    <Text style={styles.label}>Username o Email</Text>
                    <TextInput
                      ref={userRef}
                      placeholder="tu@correo.com"
                      placeholderTextColor="#8A90A6"
                      style={[
                        styles.input,
                        focus === 'user' ? styles.inputFocus : null,
                        touched.userOrEmail && errors.userOrEmail ? styles.inputError : null,
                      ]}
                      onChangeText={handleChange('userOrEmail')}
                      onBlur={() => {
                        handleBlur('userOrEmail');
                        setFocus(null);
                      }}
                      onFocus={() => setFocus('user')}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      textContentType="username"
                      value={values.userOrEmail}
                      returnKeyType="next"
                      onSubmitEditing={() => passRef.current?.focus()}
                    />
                    {touched.userOrEmail && !!errors.userOrEmail && (
                      <Text style={styles.errorText}>{errors.userOrEmail}</Text>
                    )}

                    {/* Password */}
                    <Text style={[styles.label, styles.mt14]}>Password</Text>
                    <View style={styles.inputAffixWrap}>
                      <TextInput
                        ref={passRef}
                        placeholder="••••••••"
                        placeholderTextColor="#8A90A6"
                        style={[
                          styles.input,
                          styles.inputWithAffix,
                          focus === 'pass' ? styles.inputFocus : null,
                          touched.password && errors.password ? styles.inputError : null,
                        ]}
                        value={values.password}
                        secureTextEntry={!showPassword}
                        onChangeText={handleChange('password')}
                        onBlur={() => {
                          handleBlur('password');
                          setFocus(null);
                        }}
                        onFocus={() => setFocus('pass')}
                        autoCapitalize="none"
                        textContentType="password"
                        returnKeyType="done"
                        onSubmitEditing={() => handleSubmit()}
                      />
                      <Pressable
                        style={styles.affix}
                        onPress={() => setShowPassword((v) => !v)}
                        android_ripple={{ color: '#ffffff22', borderless: true }}
                      >
                        <Text style={styles.affixText}>
                          {showPassword ? 'Ocultar' : 'Mostrar'}
                        </Text>
                      </Pressable>
                    </View>
                    {touched.password && !!errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}

                    {/* Botones */}
                    <View style={styles.buttonsRow}>
                      <LinearGradient
                        colors={['#7C4DFF', '#4C63F2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.btnGradient}
                      >
                        <Pressable
                          onPress={() => handleSubmit()}
                          disabled={!isValid || isSubmitting}
                          style={({ pressed }) => [
                            styles.btn,
                            (!isValid || isSubmitting) ? styles.btnDisabled : null,
                            pressed ? styles.btnPressed : null,
                          ]}
                        >
                          <Text style={styles.btnPrimaryText}>Iniciar sesión</Text>
                        </Pressable>
                      </LinearGradient>

                      <Pressable
                        onPress={() => navigation.navigate('Register')}
                        style={({ pressed }) => [styles.btn, styles.btnSecondary, pressed && styles.btnSecondaryPressed]}
                      >
                        <Text style={styles.btnSecondaryText}>Registrarse</Text>
                      </Pressable>

                    </View>

                    <Pressable onPress={() => navigation.navigate('ResetPassword')} style={styles.mt18}>
                      <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
                    </Pressable>
                  </>
                )}
              </Formik>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0b0c16' },
  bg: { flex: 1 },
  kb: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },

  /* Vinilo */
  vinylWrap: {
    position: 'absolute',
    right: -80,
    top: -40,
    width: 300,
    height: 300,
    opacity: 0.18,
  },
  vinylOuter: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#1b1f27',
  },
  vinylRing: {
    position: 'absolute',
    left: 18,
    top: 18,
    right: 18,
    bottom: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#5A6277',
  },
  vinylInner: {
    position: 'absolute',
    left: 48,
    top: 48,
    right: 48,
    bottom: 48,
    borderRadius: 999,
  },
  vinylHole: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 16,
    height: 16,
    marginLeft: -8,
    marginTop: -8,
    borderRadius: 999,
    backgroundColor: '#0b0c16',
  },

  /* Equalizer */
  eqBehind: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: '18%',
    alignItems: 'center',
    opacity: 0.7,
  },
  eqRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-end',
  },
  eqBar: {
    width: 6,
    borderRadius: 3,
  },

  /* Card */
  card: {
    backgroundColor: '#1b1f27e6',
    borderColor: '#ffffff22',
    borderWidth: 1,
    borderRadius: 18,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  logoWrap: { alignItems: 'center', marginBottom: 8 },
  logo: { width: 88, height: 88 },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E6EAF2',
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#A8B0C3',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },

  label: { color: '#CDD3E1', fontSize: 13, marginBottom: 6 },
  mt14: { marginTop: 14 },
  mt18: { marginTop: 18 },

  inputAffixWrap: { position: 'relative' },
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
  inputFocus: { borderColor: '#7C4DFF' },
  inputError: { borderColor: '#EF4444' },

  affix: {
    position: 'absolute',
    right: 10,
    top: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  affixText: { color: '#9AA3B2', fontWeight: '600' },
  errorText: { color: '#EF4444', marginTop: 6, fontSize: 12 },

  buttonsRow: { flexDirection: 'row', gap: 12, marginTop: 22 },
  btnGradient: { flex: 1, borderRadius: 14 },
  btn: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  btnPressed: { opacity: 0.9 },
  btnSecondary: { flex: 1, borderWidth: 1, borderColor: '#6366F1' },
  btnSecondaryPressed: { backgroundColor: '#2A2F3D' },
  btnPrimaryText: { color: '#F2F4FF', fontWeight: '800' },
  btnSecondaryText: { color: '#C7CBFF', fontWeight: '700' },

  link: {
    color: '#C9D0E3',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
