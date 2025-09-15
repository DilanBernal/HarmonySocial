import UserBasicDataResponse from "../../../application/dto/responses/UserBasicDataResponse";
import { ApplicationResponse } from "../../../application/shared/ApplicationReponse";
import User from "../../models/User";

export default interface UserPort {
  //Sección de creacion
  createUser(user: Omit<User, "id">): Promise<ApplicationResponse<number>>;
  //Sección de actualizacion
  updateUser(id: number, user: Partial<User>): Promise<ApplicationResponse>;
  deleteUser(id: number): Promise<ApplicationResponse>;
  //Sección de busqueda
  getAllUsers(): Promise<ApplicationResponse<Array<User>>>;
  getUserById(id: number): Promise<ApplicationResponse<User>>;
  getUserBasicDataById(id: number): Promise<ApplicationResponse<UserBasicDataResponse>>;
  getUserByEmail(email: string): Promise<ApplicationResponse<User>>;
  getUserByLoginRequest(userOrEmail: string): Promise<ApplicationResponse<User>>;
  getUserByEmailOrUsername(email: string, username: string): Promise<ApplicationResponse<User>>;
  getUserStampsAndUserInfoByUserOrEmail(
    userOrEmail: string,
  ): Promise<ApplicationResponse<[string, string, number, string]>>;
  //Seccion de validación
  existsUserById(id: number): Promise<ApplicationResponse<boolean>>;
  existsUserByLoginRequest(userOrEmail: string): Promise<ApplicationResponse<boolean>>;
  existsUserByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<ApplicationResponse<boolean>>;
}
