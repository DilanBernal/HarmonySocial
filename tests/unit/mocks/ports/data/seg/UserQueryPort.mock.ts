import { ApplicationResponse } from "../../../../../../src/application/shared/ApplicationReponse";
import {
  ApplicationError,
  ErrorCodes,
} from "../../../../../../src/application/shared/errors/ApplicationError";
import NotFoundResponse from "../../../../../../src/application/shared/responses/NotFoundResponse";
import UserBasicDataResponse from "../../../../../../src/application/dto/responses/seg/user/UserBasicDataResponse";
import PaginationRequest from "../../../../../../src/application/dto/utils/PaginationRequest";
import PaginationResponse from "../../../../../../src/application/dto/utils/PaginationResponse";
import UserSearchParamsRequest from "../../../../../../src/application/dto/requests/User/UserSearchParamsRequest";
import User, { UserStatus, UserInstrument } from "../../../../../../src/domain/models/seg/User";
import UserQueryPort from "../../../../../../src/domain/ports/data/seg/query/UserQueryPort";
import UserFilters from '../../../../../../src/domain/valueObjects/UserFilters';

// Mock data para las pruebas
const mockUser: User = new User(
  1,
  "Test User",
  "testuser@example.com",
  "testuser",
  "$2b$10$hashedPassword",
  "default.jpg",
  100,
  UserStatus.ACTIVE,
  UserInstrument.GUITAR,
  "mock-concurrency-stamp",
  "mock-security-stamp",
  new Date("2023-01-01"),
  new Date("2023-01-01"),
);

const mockUsers: User[] = [
  mockUser,
  {
    ...mockUser,
    id: 2,
    email: "user2@example.com",
    normalizedEmail: "USER2@EXAMPLE.COM",
    username: "user2",
    normalizedUsername: "USER2",
    fullName: "User Two",
  },
  {
    ...mockUser,
    id: 3,
    email: "user3@example.com",
    normalizedEmail: "USER3@EXAMPLE.COM",
    username: "user3",
    normalizedUsername: "USER3",
    fullName: "User Three",
  },
] as User[];


function applyFilters(filters: UserFilters): boolean {
  let response: boolean = false;

  if (filters.includeFilters) {
    if (filters.id) response = filters.id === 2;
    // For mock purposes, we simulate filtering logic without actual query builder
    if (filters.email) response = filters.email.toLowerCase() === "testuser@example.com";
    if (filters.username) response = filters.username.toLowerCase() === "testuser";
    if (filters.status) response = filters.status === UserStatus.ACTIVE;
  } else {
    // OR logic for exclude filters
    if (filters.id) response = filters.id === 1;
    if (filters.email) response = filters.email.toLowerCase() === "testuser@example.com";
    if (filters.username) response = filters.username.toLowerCase() === "testuser";
    if (filters.status) response = filters.status === UserStatus.ACTIVE;
  }
  return response;
}

function applyUserSearchParams(params: UserSearchParamsRequest): boolean {
  let response: boolean = false;

  return response;
}


const createUserQueryPortMock = (): jest.Mocked<UserQueryPort> => {
  return {
    getUserById: jest.fn().mockImplementation((id: number) => {
      const user = mockUsers.find((u) => u.id === id);
      if (user) {
        return Promise.resolve(ApplicationResponse.success(user));
      }
      return Promise.resolve(
        ApplicationResponse.failure(
          new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        ),
      );
    }),
    getUserByFilters: jest.fn().mockImplementation(),
    searchUsersByFilters: jest.fn().mockImplementation(),
    searchUsersByIds: jest.fn().mockImplementation(),
    existsUserById: jest.fn().mockImplementation(),
    existsUserByFilters: jest.fn().mockImplementation(),
    getActiveUserById: jest.fn().mockImplementation(),
    getActiveUserByFilters: jest.fn().mockImplementation(),
    searchActiveUserByFilters: jest.fn().mockImplementation((req: PaginationRequest<UserSearchParamsRequest>) => {
      const users = mockUsers.find((u) => true);
      return Promise.resolve(ApplicationResponse.success(users));
    }),
    searchActiveUsersByIds: jest.fn().mockImplementation(),
    existsActiveUserById: jest.fn().mockImplementation(),
    existsActiveUserByFilters: jest.fn().mockImplementation(),
    // getAllUsers: jest.fn().mockImplementation(() => {
    //   return Promise.resolve(ApplicationResponse.success(mockUsers));
    // }),

    // getUserById: jest.fn().mockImplementation((id: number) => {
    //   const user = mockUsers.find((u) => u.id === id);
    //   if (user) {
    //     return Promise.resolve(ApplicationResponse.success(user));
    //   }
    //   return Promise.resolve(
    //     ApplicationResponse.failure(
    //       new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND),
    //     ),
    //   );
    // }),

    // getUserByEmail: jest.fn().mockImplementation((email: string) => {
    //   const user = mockUsers.find((u) => u.email === email);
    //   if (user) {
    //     return Promise.resolve(ApplicationResponse.success(user));
    //   }
    //   return Promise.resolve(
    //     ApplicationResponse.failure(
    //       new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND),
    //     ),
    //   );
    // }),

    // getUserByLoginRequest: jest.fn().mockImplementation((userOrEmail: string) => {
    //   const query = userOrEmail.toLowerCase().trim();
    //   const user = mockUsers.find(
    //     (u) => u.email.toLowerCase() === query || u.username.toLowerCase() === query,
    //   );
    //   if (user) {
    //     return Promise.resolve(ApplicationResponse.success(user));
    //   }
    //   return Promise.resolve(
    //     ApplicationResponse.failure(
    //       new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND),
    //     ),
    //   );
    // }),

    // getUserByEmailOrUsername: jest.fn().mockImplementation((email: string, username: string) => {
    //   const user = mockUsers.find((u) => u.email === email || u.username === username);
    //   if (user) {
    //     return Promise.resolve(ApplicationResponse.success(user));
    //   }
    //   return Promise.resolve(
    //     ApplicationResponse.failure(
    //       new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND),
    //     ),
    //   );
    // }),

    // getUsersByIds: jest.fn().mockImplementation((ids: number[]) => {
    //   if (!ids.length) {
    //     return Promise.resolve(ApplicationResponse.success([]));
    //   }
    //   const users = mockUsers.filter((u) => ids.includes(u.id));
    //   return Promise.resolve(ApplicationResponse.success(users));
    // }),

    // getUserBasicDataById: jest.fn().mockImplementation((id: number) => {
    //   const user = mockUsers.find((u) => u.id === id);
    //   if (user) {
    //     const basicData: UserBasicDataResponse = {
    //       id: user.id,
    //       fullName: user.fullName,
    //       email: user.email,
    //       activeFrom: user.createdAt.getFullYear(),
    //       profileImage: user.profileImage,
    //       username: user.username,
    //       learningPoints: user.learningPoints,
    //       favoriteInstrument: user.favoriteInstrument,
    //     };
    //     return Promise.resolve(ApplicationResponse.success(basicData));
    //   }
    //   return Promise.resolve(new NotFoundResponse({ message: "El usuario no existe" }));
    // }),

    // getUserStampsAndUserInfoByUserOrEmail: jest.fn().mockImplementation((userOrEmail: string) => {
    //   const query = userOrEmail.toUpperCase();
    //   const user = mockUsers.find(
    //     (u) => u.normalizedEmail === query || u.normalizedUsername === query,
    //   );
    //   if (user) {
    //     const result: [string, string, number, string, string] = [
    //       user.concurrencyStamp,
    //       user.securityStamp,
    //       user.id,
    //       user.profileImage,
    //       user.password,
    //     ];
    //     return Promise.resolve(ApplicationResponse.success(result));
    //   }
    //   return Promise.resolve(new NotFoundResponse({ entity: "usuario" }));
    // }),

    // existsUserByLoginRequest: jest.fn().mockImplementation((userOrEmail: string) => {
    //   const query = userOrEmail.toLowerCase().trim();
    //   const exists = mockUsers.some(
    //     (u) => u.email.toLowerCase() === query || u.username.toLowerCase() === query,
    //   );
    //   return Promise.resolve(ApplicationResponse.success(exists));
    // }),

    // existsUserById: jest.fn().mockImplementation((id: number) => {
    //   const exists = mockUsers.some((u) => u.id === id);
    //   return Promise.resolve(ApplicationResponse.success(exists));
    // }),

    // existsUserByEmailOrUsername: jest.fn().mockImplementation((email: string, username: string) => {
    //   const exists = mockUsers.some((u) => u.email === email || u.username === username);
    //   return Promise.resolve(ApplicationResponse.success(exists));
    // }),

    // searchUsers: jest.fn().mockImplementation((req: PaginationRequest<UserSearchParamsRequest>) => {
    //   let filteredUsers = mockUsers.filter((u) => u.status === UserStatus.ACTIVE);

    //   // Aplicar filtros
    //   if (req.filters) {
    //     if (req.filters.email) {
    //       filteredUsers = filteredUsers.filter((u) =>
    //         u.normalizedEmail.startsWith((req.filters?.email ?? "").toUpperCase()),
    //       );
    //     }
    //     if (req.filters.username) {
    //       filteredUsers = filteredUsers.filter((u) =>
    //         u.normalizedUsername.startsWith((req.filters?.username ?? "").toUpperCase()),
    //       );
    //     }
    //     if (req.filters.full_name) {
    //       filteredUsers = filteredUsers.filter((u) =>
    //         u.fullName.toLowerCase().includes((req.filters?.full_name ?? "").toLowerCase()),
    //       );
    //     }
    //   }

    //   // Aplicar filtro general
    //   if (req.general_filter) {
    //     const generalQuery = req.general_filter.toLowerCase();
    //     filteredUsers = filteredUsers.filter(
    //       (u) =>
    //         u.email.toLowerCase().includes(generalQuery) ||
    //         u.username.toLowerCase().includes(generalQuery) ||
    //         (u.fullName?.toLowerCase() ?? "").includes(generalQuery),
    //     );
    //   }

    //   const pageSize = req.page_size || 5;
    //   const totalRows = filteredUsers.length;
    //   const paginatedUsers = filteredUsers.slice(0, pageSize);

    //   const response = PaginationResponse.create(paginatedUsers, paginatedUsers.length, totalRows);

    //   return Promise.resolve(ApplicationResponse.success(response));
    // }),

    // listUsers: jest.fn().mockImplementation((limit: number) => {
    //   const limitedUsers = mockUsers.slice(0, Math.min(limit, mockUsers.length));
    //   return Promise.resolve(ApplicationResponse.success(limitedUsers));
    // }),

  };
};
export default createUserQueryPortMock;
