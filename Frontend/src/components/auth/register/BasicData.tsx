import React from 'react';
import { TextInput, View, Text, Pressable, StyleSheet } from 'react-native';
import { StepValidation } from '../../../core/types/StepValidation';
import { RegisterFormData } from '../../../core/dtos/RegisterFormData';
import { s } from '../../../screens/auth/RegisterScreen';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormGetFieldState,
} from 'react-hook-form';
import { completeValidationSchemas } from '../../../viewmodels/types/stepValidationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';

type BasicDataStepProps = {
  control: Control<any>;
  errors: FieldErrors<FieldValues>;
  showPassword: boolean;
  getFieldState: UseFormGetFieldState<RegisterFormData>;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
};

export const BasicDataStep: React.FC<BasicDataStepProps> = ({
  control,
  errors,
  getFieldState,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}: BasicDataStepProps) => {
  console.log(getFieldState('fullName'));
  return (
    <View>
      {/* Nombre completo */}
      <Text style={s.label}>Nombre completo</Text>
      <Controller
        control={control}
        name="fullName"
        render={({ field, fieldState }) => (
          <View>
            <TextInput
              style={[s.input, fieldState.error ? s.inputError : null]}
              placeholder="Tu nombre completo"
              placeholderTextColor="#8A90A6"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              returnKeyType="emergency-call"
              accessibilityLabel="Nombre completo"
              accessibilityHint="Ingresa tu nombre completo"
            />
            {fieldState.error && (
              <Text style={s.error}>{fieldState.error.message}</Text>
            )}
          </View>
        )}
      />

      {/* Username */}
      <Text style={s.label}>Nombre de usuario</Text>
      <Controller
        name="username"
        control={control}
        render={({ field, fieldState }) => (
          <View>
            <TextInput
              style={[s.input, errors.username ? s.inputError : null]}
              placeholder="Tu nombre de usuario único"
              placeholderTextColor="#8A90A6"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              autoCapitalize="none"
              returnKeyType="next"
              accessibilityLabel="Nombre de usuario"
              accessibilityHint="Ingresa un nombre de usuario único"
            />
            {fieldState.error && (
              <Text style={s.error}>{fieldState.error.message}</Text>
            )}
          </View>
        )}
      />

      {/* Email */}
      <Text style={s.label}>Correo electrónico</Text>
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <View>
            <TextInput
              style={[s.input, errors.email ? s.inputError : null]}
              placeholder="tu@correo.com"
              placeholderTextColor="#8A90A6"
              autoCapitalize="none"
              keyboardType="email-address"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              returnKeyType="next"
              accessibilityLabel="Correo electrónico"
              accessibilityHint="Ingresa tu dirección de correo electrónico"
            />
            {fieldState.error && (
              <Text style={s.error}>{fieldState.error.message}</Text>
            )}
          </View>
        )}
      />

      {/* Contraseña */}
      <Text style={s.label}>Contraseña</Text>
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <View>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[
                  s.input,
                  s.inputWithAffix,
                  errors.password ? s.inputError : null,
                ]}
                placeholder="••••••••"
                placeholderTextColor="#8A90A6"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                returnKeyType="next"
                accessibilityLabel="Contraseña"
                accessibilityHint="Ingresa una contraseña segura"
              />
              <Pressable
                style={s.affix}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
              >
                <Text style={s.affixText}>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </Pressable>
            </View>
            {fieldState.error && (
              <Text style={s.error}>{fieldState.error.message}</Text>
            )}
          </View>
        )}
      />

      {/* Confirmar contraseña */}
      <Text style={s.label}>Confirmar contraseña</Text>
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <View>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[
                  s.input,
                  s.inputWithAffix,
                  errors.confirmPassword ? s.inputError : null,
                ]}
                placeholder="••••••••"
                placeholderTextColor="#8A90A6"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                returnKeyType="done"
                accessibilityLabel="Confirmar contraseña"
                accessibilityHint="Confirma tu contraseña"
              />
              <Pressable
                style={s.affix}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                accessibilityRole="button"
                accessibilityLabel={
                  showConfirmPassword
                    ? 'Ocultar confirmación'
                    : 'Mostrar confirmación'
                }
              >
                <Text style={s.affixText}>
                  {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </Pressable>
            </View>
            {fieldState.error && (
              <Text style={s.error}>{fieldState.error.message}</Text>
            )}
          </View>
        )}
      />

      {/* Información adicional sobre seguridad */}
      <View style={localStyles.infoBox}>
        <Text style={localStyles.infoTitle}>🔒 Requisitos de contraseña:</Text>
        <Text style={localStyles.infoText}>
          • Mínimo 8 caracteres{'\n'}• Al menos 1 mayúscula y 1 minúscula
          {'\n'}• Al menos 1 número{'\n'}• Al menos 1 carácter especial
          (!@#$%^&*)
        </Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  infoBox: {
    marginTop: 16,
    padding: 14,
    width: 'auto',
    backgroundColor: 'rgba(124, 77, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.1)',
  },

  infoTitle: {
    color: '#CDD3E1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },

  infoText: {
    color: '#A8B0C3',
    fontSize: 12,
    lineHeight: 16,
  },
});
