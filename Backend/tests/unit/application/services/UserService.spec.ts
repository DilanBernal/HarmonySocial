import UserSearchParamsRequest from "../../../../src/application/dto/requests/User/UserSearchParamsRequest";
import PaginationRequest from "../../../../src/application/dto/utils/PaginationRequest";
import UserService from "../../../../src/application/services/UserService";
import AuthPort from "../../../../src/domain/ports/data/seg/AuthPort";
import RolePort from "../../../../src/domain/ports/data/seg/RolePort";
import UserPort from "../../../../src/domain/ports/data/seg/UserPort";
import UserRolePort from "../../../../src/domain/ports/data/seg/UserRolePort";
import EmailPort from "../../../../src/domain/ports/utils/EmailPort";
import LoggerPort from "../../../../src/domain/ports/utils/LoggerPort";
import TokenPort from "../../../../src/domain/ports/utils/TokenPort";
import createRolePortMock from "../../mocks/ports/data/RolePort.mock";
import createUserPortMock from "../../mocks/ports/data/UserPort.mock";
import createUserRolePortMock from "../../mocks/ports/data/UserRolePort.mock";
import createLoggerPort from "../../mocks/ports/extra/LoggerPort.mock";
import createEmailPortMock from "../../mocks/ports/utils/EmailPort.mock";
import { createMockTokenPort } from "../../mocks/ports/utils/TokenPort.mock";

describe("UserService", () => {
  let userService: UserService;


  const mockUserPort: jest.Mocked<UserPort> = createUserPortMock();

  const mockAuthPort: jest.Mocked<AuthPort> = {
    comparePasswords: jest.fn(),
    loginUser: jest.fn(),
    encryptPassword: jest.fn(),
    verifyPassword: jest.fn(),
  } as any;

  const mockEmailPort: jest.Mocked<EmailPort> = createEmailPortMock();

  const mockLoggerPort: jest.Mocked<LoggerPort> = createLoggerPort()

  const mockTokenPort: jest.Mocked<TokenPort> = createMockTokenPort();

  const mockUserRolePort: jest.Mocked<UserRolePort> = createUserRolePortMock();

  const mockRolePort: jest.Mocked<RolePort> = createRolePortMock();

  beforeEach(() => {
    jest.clearAllMocks();

    userService = new UserService(
      mockUserPort,
      mockAuthPort,
      mockEmailPort,
      mockLoggerPort,
      mockTokenPort,
      mockRolePort,
      mockUserRolePort,
    );
  });

  describe("paginacion", () => {
    it("Debe traer los usuarios correctamente", async () => {
      const req: PaginationRequest<UserSearchParamsRequest> = PaginationRequest.create({}, 15,)
      const response = await userService.searchUsers(req);

      expect(response.success).toBeTruthy();
      expect(response.data?.page_size).toBeGreaterThan(0);
      expect(response.data?.rows.length).toEqual(response.data?.page_size);
      expect(response.data).not.toBe(undefined);
    });
  });
});