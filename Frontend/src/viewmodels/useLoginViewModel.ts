import { Alert } from 'react-native';
import LoginDTO from '../core/dtos/LoginDTO';
import LoginResponse from '../core/dtos/LoginResponse';
import { AuthUserService } from '../core/services/user/auth/AuthUserService';

const useLoginViewModel = () => {
  const authService: AuthUserService = new AuthUserService();

  const onSubmit = async (user: LoginDTO) => {
    await authService
      .login(user)
      .then((value: LoginResponse) => {
        if (value.data.token) {
          console.log('Se logueo correctamente');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
};
