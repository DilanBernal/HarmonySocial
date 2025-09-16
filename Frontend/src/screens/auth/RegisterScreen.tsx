import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { RootStackParamList } from '../../App';
import { MultiStep, Step } from 'react-native-multistep';
import { BasicDataStep } from '../../components/auth/register/BasicData';
import { FavoriteInstrumentStep } from '../../components/auth/register/FavoriteInstrument';
import { ProfileImageStep } from '../../components/auth/register/ProfileImageStep';
import { useRegisterViewModel } from '../../viewmodels/useRegisterViewModel';
// import { MultiStep, MultiStepRef, Step } from '@brijen/react-native-multistep';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();

  // Estados locales para UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ViewModel
  const {
    control,
    handleSubmit,
    errors,
    reset,
    getFieldState,
    getValues,
    setValue,
    onSubmit: submitFromVM,
  } = useRegisterViewModel();

  // Manejar envío del formulario
  const finalSubmitHandler = handleSubmit(
    async () => {
      console.log('Sending from view the register request');
      await submitFromVM(null);
      Alert.alert(
        '¡Registro exitoso! 🎉',
        'Bienvenido a Harmony Social. Tu cuenta ha sido creada exitosamente.',
        [
          {
            text: 'Continuar',
            onPress: () => {
              navigation.reset({
                routes: [{ name: 'Login' }],
              });
            },
          },
        ],
      );
      reset();
    },
    (error: any) => {
      console.error('ocurrio un error', error);
    },
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />
      <LinearGradient
        colors={['#0c0f17', '#0c1222', '#0b0c16']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Título principal */}
            <Text style={styles.title}>Crea tu cuenta</Text>
            <Text style={styles.subtitle}>Únete a Harmony Social 🎧</Text>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <MultiStep
                tintColor="rgba(128, 82, 255, 1)"
                nextButtonText="Siguiente"
                buttonContainerStyle={styles.btn}
                submitButtonText="Registrarse"
                prevButtonText="Anterior"
                onFinalStepSubmit={finalSubmitHandler}
                progressCircleTrackColor="#1f1f71ff"
                progressCircleSize={57}
                globalNextStepTitleStyle={{ display: 'none' }}
                nextButtonStyle={styles.btnNext}
                progressCircleLabelStyle={styles.btnText}
              >
                <Step
                  title="Datos Personales"
                  stepContainerStyle={{
                    width: '82%',
                    justifyContent: 'center',
                    display: 'flex',
                  }}
                >
                  <BasicDataStep
                    control={control}
                    errors={errors}
                    getFieldState={getFieldState}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                  />
                </Step>
                <Step
                  title="Instrumento Favorito"
                  stepContainerStyle={{
                    width: '82%',
                    justifyContent: 'center',
                    display: 'flex',
                  }}
                >
                  <View>
                    {/* <Text>Hola</Text> */}
                    <FavoriteInstrumentStep
                      errors={errors}
                      setValue={setValue}
                      control={control}
                    />
                  </View>
                </Step>
                <Step
                  title="Imagen de perfil"
                  stepContainerStyle={{
                    width: '82%',
                    justifyContent: 'center',
                    display: 'flex',
                  }}
                >
                  {/* <Text>hola</Text> */}
                  <ProfileImageStep
                    control={control}
                    getState={getFieldState}
                    favoriteInstrument={getValues('favoriteInstrument')}
                    onImageSelect={setValue}
                    fullName={''}
                  />
                </Step>
              </MultiStep>

              <Pressable
                onPress={() => navigation.goBack()}
                style={styles.linkContainer}
                accessibilityRole="button"
                accessibilityLabel="Volver al inicio de sesión"
              >
                <Text style={styles.link}>
                  ¿Ya tienes cuenta? Inicia sesión
                </Text>
              </Pressable>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

export const s = StyleSheet.create({
  // Estilos compartidos para componentes hijos
  label: {
    color: '#CDD3E1',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#242A35',
    borderWidth: 1,
    borderColor: '#323A48',
    color: '#E6EAF2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputWithAffix: { paddingRight: 76 },
  inputError: { borderColor: '#EF4444' },
  error: {
    color: '#EF4444',
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  affix: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingHorizontal: 15,
    paddingVertical: 15.5,
    borderRadius: 100,
    backgroundColor: '#39277d3c',
  },
  affixText: {
    color: '#9AA3B2',
    fontWeight: '600',
    fontSize: 12,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0c16',
  },

  gradient: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#1b1f27e6',
    borderColor: '#ffffff22',
    borderWidth: 1,
    borderRadius: 18,
    padding: 22,
    minHeight: 600,
  },

  header: {
    marginBottom: 16,
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.2)',
  },

  backButtonText: {
    color: '#7C4DFF',
    fontSize: 14,
    fontWeight: '600',
  },

  title: {
    color: '#E6EAF2',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },

  subtitle: {
    color: '#A8B0C3',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },

  stepContent: {
    marginVertical: 20,
    minHeight: 300,
  },

  btnGrad: {
    borderRadius: 14,
    marginTop: 24,
  },

  btn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnNext: {
    backgroundColor: '#ff00eeff',
  },

  btnDisabled: {
    opacity: 0.5,
  },

  btnPressed: {
    opacity: 0.8,
  },

  btnText: {
    color: '#F2F4FF',
    fontWeight: '700',
    fontSize: 16,
  },

  linkContainer: {
    marginTop: 16,
    paddingVertical: 8,
  },

  link: {
    color: '#C9D0E3',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '600',
    fontSize: 14,
  },
});
