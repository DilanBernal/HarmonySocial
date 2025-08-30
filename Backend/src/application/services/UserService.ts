import User, { UserInstrument, UserStatus } from "../../domain/models/User";
import AuthPort from "../../domain/ports/data/AuthPort";
import UserPort from "../../domain/ports/data/UserPort";
import EmailPort from "../../domain/ports/extras/EmailPort";
import RegisterRequest from "../dto/requests/RegisterRequest";

export default class UserService {
  private userPort: UserPort;
  private authPort: AuthPort;
  private emailPort: EmailPort;
  private usernameRegex: RegExp = /^[a-zA-Z0-9_*\-#$!|°.+]{2,50}$/;
  private fullNameRegex: RegExp = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)?$/;
  private passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])(.){8,}$/;
  private emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private profileImage: RegExp = /^(https?|ftp|http):\/\/[^\s/$.?#].[^\s]*$/

  constructor(userPort: UserPort, authPort: AuthPort, emailPort: EmailPort) {
    this.userPort = userPort;
    this.authPort = authPort;
    this.emailPort = emailPort;
  }

  async registerUser(user: RegisterRequest): Promise<number> {
    if (!user) {
      throw new Error;
    }
    try {
      const existingUser = await this.userPort.getUserByEmail(user.email);
      Object.freeze(existingUser);
      Object.freeze(user);

      if (existingUser) {
        throw new Error("El usuario ya existe");
      }

      let errors: Array<[string, string]> = [];
      if (!this.usernameRegex.test(user.username)) {
        errors.push(["username", "El username no esta en el formato correcto"]);
      }
      console.log(user.full_name)
      if (!this.fullNameRegex.test(user.full_name)) {
        errors.push(["full name", "El nombre no esta en el formato correcto"]);
      }
      if (!this.passwordRegex.test(user.password)) {
        errors.push(["password", "La contraseña no esta en el formato correcto"]);
      }
      if (!this.emailRegex.test(user.email)) {
        errors.push(["email", "El email no esta en el formato correcto"]);
      }
      if (!this.profileImage.test(user.profile_image)) {
        errors.push(["image", "La imagen de usuaruio no esta en el fomrato correcto"]);
      }

      if (errors.length > 0) {
        throw new Error(JSON.stringify(errors));
      }

      const hashPassword = await this.authPort.encryptPassword(user.password);

      const userDomain: Omit<User, "id"> = {
        status: UserStatus.ACTIVE,
        created_at: new Date(Date.now()),
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        password: hashPassword,
        profile_image: user.profile_image,
        learning_points: 0,
        favorite_instrument: user.favorite_instrument,
        is_artist: user.is_artist
      }
      return await this.userPort.createUser(userDomain);
    } catch (error) {
      throw error;
    }
  }
}