import { ApplicationResponse } from "../../../../../src/application/shared/ApplicationReponse";
import {
  ApplicationError,
  ErrorCodes,
} from "../../../../../src/application/shared/errors/ApplicationError";
import NotFoundResponse from "../../../../../src/application/shared/responses/NotFoundResponse";
import UserBasicDataResponse from "../../../../../src/application/dto/responses/seg/user/UserBasicDataResponse";
import PaginationRequest from "../../../../../src/application/dto/utils/PaginationRequest";
import PaginationResponse from "../../../../../src/application/dto/utils/PaginationResponse";
import UserSearchParamsRequest from "../../../../../src/application/dto/requests/User/UserSearchParamsRequest";
import User, { UserStatus, UserInstrument } from "../../../../../src/domain/models/seg/User";
import UserQueryPort from "../../../../../src/domain/ports/data/seg/query/UserQueryPort";
import UserCommandPort from "../../../../../src/domain/ports/data/seg/command/UserCommandPort";

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

const createUserCommandPortMock = (): jest.Mocked<UserCommandPort> => {
  return {
    createUser: jest.fn().mockImplementation((user: Omit<User, "id">) => {
      // Simular éxito en la creación
      if (user.email && user.username && user.fullName) {
        return Promise.resolve(ApplicationResponse.success(Date.now()));
      }
      // Simular error de duplicado
      if (user.email === mockUser.email) {
        return Promise.resolve(
          ApplicationResponse.failure(
            new ApplicationError("Email ya existe", ErrorCodes.DATABASE_ERROR),
          ),
        );
      }
      return Promise.resolve(ApplicationResponse.success(Date.now()));
    }),

    updateUser: jest.fn().mockImplementation((id: number, user: Partial<User>) => {
      const existingUser = mockUsers.find((u) => u.id === id);
      if (existingUser) {
        return Promise.resolve(ApplicationResponse.emptySuccess());
      }
      return Promise.resolve(
        ApplicationResponse.failure(
          new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        ),
      );
    }),

    deleteUser: jest.fn().mockImplementation((id: number) => {
      const existingUser = mockUsers.find((u) => u.id === id);
      if (existingUser) {
        return Promise.resolve(ApplicationResponse.emptySuccess());
      }
      return Promise.resolve(
        ApplicationResponse.failure(
          new ApplicationError("Usuario no encontrado", ErrorCodes.VALUE_NOT_FOUND),
        ),
      );
    }),
  };
};

export default createUserCommandPortMock;
