import { Alert } from 'react-native';
import { useState } from 'react';
import LoginDTO from '../core/dtos/LoginDTO';
import { useAppServices } from '../services/AppServices';

const useLoginViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { services, addSubscription } = useAppServices();

  const onSubmit = (user: LoginDTO) => {
    setIsLoading(true);
    setError(null);

    const subscription = services
      .loginComplete(user.userOrEmail, user.password)
      .subscribe({
        next: result => {
          console.log('Login successful:', result);
          setIsLoading(false);

          if (result.loginResponse.data.token) {
            console.log('Se logueo correctamente');
            // Aquí podrías navegar a la siguiente pantalla
            // navigation.navigate('Home');
          }
        },
        error: loginError => {
          console.error('Login error:', loginError);
          setError(loginError.message || 'Error en el login');
          setIsLoading(false);

          Alert.alert(
            'Error de Login',
            loginError.message || 'Ha ocurrido un error durante el login',
            [{ text: 'OK' }],
          );
        },
      });

    addSubscription(subscription);
  };

  return {
    onSubmit,
    isLoading,
    error,
  };
};

export default useLoginViewModel;
