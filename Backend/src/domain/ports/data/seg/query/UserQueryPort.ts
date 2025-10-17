// import User from "../../../../models/seg/User";

// export default interface UserPort {
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
