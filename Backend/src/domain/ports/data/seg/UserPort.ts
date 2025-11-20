// import PaginationRequest from "../../../../application/dto/utils/PaginationRequest";
// import UserBasicDataResponse from "../../../../application/dto/responses/seg/user/UserBasicDataResponse";
// import { ApplicationResponse } from "../../../../application/shared/ApplicationReponse";
// import User from "../../../models/seg/User";
// import PaginationResponse from "../../../../application/dto/utils/PaginationResponse";

// export default interface UserPort {
//   //Sección de creacion
//   createUser(user: Omit<User, "id" | "updated_at">): Promise<ApplicationResponse<number>>;
//   //Sección de actualizacion
//   updateUser(id: number, user: Partial<User>): Promise<ApplicationResponse>;
//   deleteUser(id: number): Promise<ApplicationResponse>;
//   //Sección de busqueda
//   getAllUsers(): Promise<ApplicationResponse<Array<User>>>;
//   getUserById(id: number): Promise<ApplicationResponse<User>>;
//   getUserBasicDataById(id: number): Promise<ApplicationResponse<UserBasicDataResponse>>;
//   getUserByEmail(email: string): Promise<ApplicationResponse<User>>;
//   getUserByLoginRequest(userOrEmail: string): Promise<ApplicationResponse<User>>;
//   getUserByEmailOrUsername(email: string, username: string): Promise<ApplicationResponse<User>>;
//   getUserStampsAndUserInfoByUserOrEmail(
//     userOrEmail: string,
//   ): Promise<ApplicationResponse<[string, string, number, string, string]>>;
//   existsUserByLoginRequest(userOrEmail: string): Promise<ApplicationResponse<boolean>>;
//   searchUsers(req: PaginationRequest<any>): Promise<ApplicationResponse<PaginationResponse<User>>>;
//   listUsers(limit: number): Promise<ApplicationResponse<User[]>>;
//   // Batch fetch
//   getUsersByIds(ids: number[]): Promise<ApplicationResponse<Array<User>>>;
//   //Seccion de validación
//   existsUserById(id: number): Promise<ApplicationResponse<boolean>>;
//   existsUserByEmailOrUsername(
//     email: string,
//     username: string,
//   ): Promise<ApplicationResponse<boolean>>;
// }
