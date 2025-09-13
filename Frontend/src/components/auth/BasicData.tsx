import React from 'react';
import { TextInput, View, Text, Pressable, StyleSheet } from 'react-native';
import { StepValidation } from '../../core/types/StepValidation';
import { RegisterFormData } from '../../core/dtos/RegisterFormData';
import { s } from '../../screens/auth/RegisterScreen';

interface BasicDataStepProps {
  formData: RegisterFormData;
  stepValidation: StepValidation;
  onFieldChange: (field: keyof RegisterFormData, value: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
}

export const BasicDataStep: React.FC<BasicDataStepProps> = ({
  formData,
  stepValidation,
  onFieldChange,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}) => {
  const { errors } = stepValidation;

  return (
    <View>
      {/* Nombre completo */}
      <Text style={s.label}>Nombre completo</Text>
      <TextInput
        style={[s.input, errors.fullName ? s.inputError : null]}
        placeholder="Tu nombre completo"
        placeholderTextColor="#8A90A6"
        value={formData.fullName}
        onChangeText={text => onFieldChange('fullName', text)}
        returnKeyType="next"
        accessibilityLabel="Nombre completo"
        accessibilityHint="Ingresa tu nombre completo"
      />
      {errors.fullName && <Text style={s.error}>{errors.fullName}</Text>}

      {/* Username */}
      <Text style={s.label}>Nombre de usuario</Text>
      <TextInput
        style={[s.input, errors.username ? s.inputError : null]}
        placeholder="Tu nombre de usuario único"
        placeholderTextColor="#8A90A6"
        value={formData.username}
        onChangeText={text => onFieldChange('username', text)}
        autoCapitalize="none"
        returnKeyType="next"
        accessibilityLabel="Nombre de usuario"
        accessibilityHint="Ingresa un nombre de usuario único"
      />
      {errors.username && <Text style={s.error}>{errors.username}</Text>}

      {/* Email */}
      <Text style={s.label}>Correo electrónico</Text>
      <TextInput
        style={[s.input, errors.email ? s.inputError : null]}
        placeholder="tu@correo.com"
        placeholderTextColor="#8A90A6"
        autoCapitalize="none"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={text => onFieldChange('email', text)}
        returnKeyType="next"
        accessibilityLabel="Correo electrónico"
        accessibilityHint="Ingresa tu dirección de correo electrónico"
      />
      {errors.email && <Text style={s.error}>{errors.email}</Text>}

      {/* Contraseña */}
      <Text style={s.label}>Contraseña</Text>
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
          value={formData.password}
          onChangeText={text => onFieldChange('password', text)}
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
      {errors.password && <Text style={s.error}>{errors.password}</Text>}

      {/* Confirmar contraseña */}
      <Text style={s.label}>Confirmar contraseña</Text>
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
          value={formData.confirmPassword}
          onChangeText={text => onFieldChange('confirmPassword', text)}
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
      {errors.confirmPassword && (
        <Text style={s.error}>{errors.confirmPassword}</Text>
      )}

      {/* Información adicional sobre seguridad */}
      <View style={localStyles.infoBox}>
        <Text style={localStyles.infoTitle}>🔒 Requisitos de contraseña:</Text>
        <Text style={localStyles.infoText}>
          • Mínimo 8 caracteres{'\n'}• Al menos 1 mayúscula y 1 minúscula{'\n'}•
          Al menos 1 número{'\n'}• Al menos 1 carácter especial (!@#$%^&*)
        </Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  infoBox: {
    marginTop: 16,
    padding: 14,
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
