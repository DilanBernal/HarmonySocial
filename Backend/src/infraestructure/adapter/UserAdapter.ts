import { Repository } from "typeorm";
import UserPort from "../../domain/ports/data/UserPort";
import UserEntity from "../entities/UserEntity";
import { AppDataSource } from "../config/con_database";
import User, { UserInstrument } from "../../domain/models/User";


export default class UserAdapter implements UserPort {

  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
  }


  private toDomain(user: UserEntity): User {
    const userDomain: User = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      password: user.password,
      status: user.status,
      username: user.username,
      profile_image: user.profile_image,
      learning_points: user.learning_points,
      favorite_instrument: user.favorite_instrument,
      is_artist: user.is_artist,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
    return userDomain;
  }
  private toEntity(user: Omit<User, "id">): UserEntity {
    const userEntity: UserEntity = new UserEntity();
    userEntity.full_name = user.full_name;
    userEntity.email = user.email;
    userEntity.password = user.password;
    userEntity.status = user.status;
    userEntity.created_at = user.created_at;
    userEntity.updated_at = user.updated_at;
    userEntity.username = user.username;
    userEntity.profile_image = user.profile_image;
    userEntity.learning_points = user.learning_points;
    userEntity.favorite_instrument = user.favorite_instrument;
    userEntity.is_artist = user.is_artist;
    return userEntity;
  }

  async createUser(user: Omit<User, "id">): Promise<number> {
    try {
      const newUser = this.toEntity(user);
      console.log(user);
      const savedUser = await this.userRepository.save(newUser);
      return savedUser.id;
    } catch (error) {
      console.error(error);
      throw new Error("No se pudo crear el usaurio");
    }
  }
  updateUser(id: number, user: Partial<User>): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  deleteUser(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getAllUsers(): Promise<Array<User>> {
    throw new Error("Method not implemented.");
  }
  getUserById(id: number): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { email: email } });
      return user ? this.toDomain(user) : null;
    } catch (error) {
      console.error(error);
      throw new Error("No se pudo crear el ususario");
    }
  }
}