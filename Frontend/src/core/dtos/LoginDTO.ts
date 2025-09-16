import User from '../models/User';

export default interface LoginDTO extends Pick<User, 'password'> {
  userOrEmail: string;
}
// export default LoginDTO;
