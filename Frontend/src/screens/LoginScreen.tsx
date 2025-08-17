import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  userOrEmail: Yup.string().required('El nombre de usuario es obligatorio'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener almenos 6 digitos')
    .required('La contraseña es obligatora'),
});

const LoginScreen = () => {
  return (
    <Formik
      initialValues={{ userOrEmail: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={values => {
        console.log('Login:', values);
      }}
    >
      {({ handleChange, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <View style={styles.inputsContainer}>
            <Text style={styles.label}>Username o Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('userOrEmail')}
              value={values.userOrEmail}
            />
            {touched.userOrEmail && errors.userOrEmail && (
              <Text style={styles.errorText}>{errors.userOrEmail}</Text>
            )}
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={values.password}
              secureTextEntry
              onChangeText={handleChange('password')}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableHighlight
              style={[styles.loginButton, styles.buttons]}
              underlayColor="#46546dff"
              activeOpacity={0.6}
              onPressOut={handleSubmit as any}
            >
              <View>
                <Text style={styles.loginButtonContentText}>
                  Iniciar sesion
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.registerButton, styles.buttons]}
              underlayColor="#666666ff"
              activeOpacity={0.6}
            >
              <View>
                <Text style={styles.registerButtonContentText}>
                  Registrarse
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginVertical: 'auto',
    marginHorizontal: 30,
  },
  inputsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  buttonsContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  input: {
    backgroundColor: '#4F5F5F',
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    color: 'white',
    borderColor: '#ffffff',
    paddingStart: 10
  },
  label: {
    textAlign: 'center',
    color: '#ffffff',
    marginVertical: 5,
  },
  errorText: {
    color: '#ff2d2dff',
    marginVertical: 6,
  },
  buttons: {
    width: '45%',
    borderRadius: 18,
    paddingVertical: 10,
  },
  loginButton: {
    backgroundColor: '#566073',
    color: 'white',
  },
  loginButtonContentText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#CEDEE0',
  },
  registerButton: {
    backgroundColor: '#E8DEF8',
  },
  registerButtonContentText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
