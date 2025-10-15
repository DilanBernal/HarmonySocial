import { ApplicationResponse } from "../../../../../src/application/shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../../../../../src/application/shared/errors/ApplicationError";
import NotFoundResponse from "../../../../../src/application/shared/responses/NotFoundResponse";
import UserBasicDataResponse from "../../../../../src/application/dto/responses/seg/user/UserBasicDataResponse";
import PaginationRequest from "../../../../../src/application/dto/utils/PaginationRequest";
import PaginationResponse from "../../../../../src/application/dto/utils/PaginationResponse";
import UserSearchParamsRequest from "../../../../../src/application/dto/requests/User/UserSearchParamsRequest";
import UserPort from "../../../../../src/domain/ports/data/seg/UserPort";
import User, { UserStatus, UserInstrument } from "../../../../../src/domain/models/seg/User";

// Mock data para las pruebas
const mockUser: User = {
  id: 1,
  full_name: "Test User",
  email: "testuser@example.com",
  normalized_email: "TESTUSER@EXAMPLE.COM",
  username: "testuser",
  normalized_username: "TESTUSER",
  password: "$2b$10$hashedPassword",
  profile_image: "default.jpg",
  learning_points: 100,
  status: UserStatus.ACTIVE,
  favorite_instrument: UserInstrument.GUITAR,
  concurrency_stamp: "mock-concurrency-stamp",
  security_stamp: "mock-security-stamp",
  created_at: new Date("2023-01-01"),
  updated_at: new Date("2023-01-01"),
};

const mockUsers: User[] = [
  mockUser,
  {
    ...mockUser,
    id: 2,
    email: "user2@example.com",
    normalized_email: "USER2@EXAMPLE.COM",
    username: "user2",
    normalized_username: "USER2",
    full_name: "User Two",
  },
  {
    ...mockUser,
    id: 3,
    email: "user3@example.com",
    normalized_email: "USER3@EXAMPLE.COM",
    username: "user3",
    normalized_username: "USER3",
    full_name: "User Three",
  },
];

const createUserPortMock = (): jest.Mocked<UserPort> => {
  return {
    createUser: jest.fn().mockImplementation((user: Omit<User, "id">) => {
      // Simular éxito en la creación
      if (user.email && user.username && user.full_name) {
        return Promise.resolve(ApplicationResponse.success(Date.now()));
      }
      // Simular error de duplicado
      if (user.email === mockUser.email) {
        return Promise.resolve(ApplicationResponse.failure(
          new ApplicationError("Email ya existe", ErrorCodes.DATABASE_ERROR)
        ));
      }
      return Promise.resolve(ApplicationResponse.success(Date.now()));
    }),

    updateUser: jest.fn().mockImplementation((id: number, user: Partial<User>) => {
      const existingUser = mockUsers.find(u => u.id === id);
      if (existingUser) {
        return Promise.resolve(ApplicationResponse.emptySuccess());
      }
      return Promise.resolve(ApplicationResponse.failure(
        new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND)
      ));
    }),

    deleteUser: jest.fn().mockImplementation((id: number) => {
      const existingUser = mockUsers.find(u => u.id === id);
      if (existingUser) {
        return Promise.resolve(ApplicationResponse.emptySuccess());
      }
      return Promise.resolve(ApplicationResponse.failure(
        new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND)
      ));
    }),

    getAllUsers: jest.fn().mockImplementation(() => {
      return Promise.resolve(ApplicationResponse.success(mockUsers));
    }),

    getUserById: jest.fn().mockImplementation((id: number) => {
      const user = mockUsers.find(u => u.id === id);
      if (user) {
        return Promise.resolve(ApplicationResponse.success(user));
      }
      return Promise.resolve(ApplicationResponse.failure(
        new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND)
      ));
    }),

    getUserByEmail: jest.fn().mockImplementation((email: string) => {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        return Promise.resolve(ApplicationResponse.success(user));
      }
      return Promise.resolve(ApplicationResponse.failure(
        new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND)
      ));
    }),

    getUserByLoginRequest: jest.fn().mockImplementation((userOrEmail: string) => {
      const query = userOrEmail.toLowerCase().trim();
      const user = mockUsers.find(u =>
        u.email.toLowerCase() === query ||
        u.username.toLowerCase() === query
      );
      if (user) {
        return Promise.resolve(ApplicationResponse.success(user));
      }
      return Promise.resolve(ApplicationResponse.failure(
        new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND)
      ));
    }),

    getUserByEmailOrUsername: jest.fn().mockImplementation((email: string, username: string) => {
      const user = mockUsers.find(u => u.email === email || u.username === username);
      if (user) {
        return Promise.resolve(ApplicationResponse.success(user));
      }
      return Promise.resolve(ApplicationResponse.failure(
        new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND)
      ));
    }),

    getUsersByIds: jest.fn().mockImplementation((ids: number[]) => {
      if (!ids.length) {
        return Promise.resolve(ApplicationResponse.success([]));
      }
      const users = mockUsers.filter(u => ids.includes(u.id));
      return Promise.resolve(ApplicationResponse.success(users));
    }),

    getUserBasicDataById: jest.fn().mockImplementation((id: number) => {
      const user = mockUsers.find(u => u.id === id);
      if (user) {
        const basicData: UserBasicDataResponse = {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          activeFrom: user.created_at.getFullYear(),
          profileImage: user.profile_image,
          username: user.username,
          learningPoints: user.learning_points,
          favoriteInstrument: user.favorite_instrument,
        };
        return Promise.resolve(ApplicationResponse.success(basicData));
      }
      return Promise.resolve(new NotFoundResponse({ message: "El usuario no existe" }));
    }),

    getUserStampsAndUserInfoByUserOrEmail: jest.fn().mockImplementation((userOrEmail: string) => {
      const query = userOrEmail.toUpperCase();
      const user = mockUsers.find(u =>
        u.normalized_email === query ||
        u.normalized_username === query
      );
      if (user) {
        const result: [string, string, number, string, string] = [
          user.concurrency_stamp,
          user.security_stamp,
          user.id,
          user.profile_image,
          user.password,
        ];
        return Promise.resolve(ApplicationResponse.success(result));
      }
      return Promise.resolve(new NotFoundResponse({ entity: "usuario" }));
    }),

    existsUserByLoginRequest: jest.fn().mockImplementation((userOrEmail: string) => {
      const query = userOrEmail.toLowerCase().trim();
      const exists = mockUsers.some(u =>
        u.email.toLowerCase() === query ||
        u.username.toLowerCase() === query
      );
      return Promise.resolve(ApplicationResponse.success(exists));
    }),

    existsUserById: jest.fn().mockImplementation((id: number) => {
      const exists = mockUsers.some(u => u.id === id);
      return Promise.resolve(ApplicationResponse.success(exists));
    }),

    existsUserByEmailOrUsername: jest.fn().mockImplementation((email: string, username: string) => {
      const exists = mockUsers.some(u => u.email === email || u.username === username);
      return Promise.resolve(ApplicationResponse.success(exists));
    }),

    searchUsers: jest.fn().mockImplementation((req: PaginationRequest<UserSearchParamsRequest>) => {
      let filteredUsers = mockUsers.filter(u => u.status === UserStatus.ACTIVE);

      // Aplicar filtros
      if (req.filters) {
        if (req.filters.email) {
          filteredUsers = filteredUsers.filter(u =>
            u.normalized_email.startsWith((req.filters?.email ?? '').toUpperCase())
          );
        }
        if (req.filters.username) {
          filteredUsers = filteredUsers.filter(u =>
            u.normalized_username.startsWith((req.filters?.username ?? '').toUpperCase())
          );
        }
        if (req.filters.full_name) {
          filteredUsers = filteredUsers.filter(u =>
            u.full_name.toLowerCase().includes((req.filters?.full_name ?? '').toLowerCase())
          );
        }
      }

      // Aplicar filtro general
      if (req.general_filter) {
        const generalQuery = req.general_filter.toLowerCase();
        filteredUsers = filteredUsers.filter(u =>
          u.email.toLowerCase().includes(generalQuery) ||
          u.username.toLowerCase().includes(generalQuery) ||
          u.full_name.toLowerCase().includes(generalQuery)
        );
      }

      const pageSize = req.page_size || 5;
      const totalRows = filteredUsers.length;
      const paginatedUsers = filteredUsers.slice(0, pageSize);

      const response = PaginationResponse.create(
        paginatedUsers,
        paginatedUsers.length,
        totalRows
      );

      return Promise.resolve(ApplicationResponse.success(response));
    }),

    listUsers: jest.fn().mockImplementation((limit: number) => {
      const limitedUsers = mockUsers.slice(0, Math.min(limit, mockUsers.length));
      return Promise.resolve(ApplicationResponse.success(limitedUsers));
    }),
  }
}

export default createUserPortMock;