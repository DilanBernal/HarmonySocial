import UserRoleService from "../../../../src/application/services/seg/userRole/UserRoleService";
import { ApplicationError, ErrorCodes } from "../../../../src/application/shared/errors/ApplicationError";

const mockUserRolePort = {
  assignRoleToUser: jest.fn(),
  removeRoleFromUser: jest.fn(),
  listRolesForUser: jest.fn(),
  listUsersForRole: jest.fn(),
};

const mockRolePort = {
  findById: jest.fn(),
};

const mockLogger = {
  error: jest.fn(),
};

describe("User Role Service Correct", () => {
  let service: UserRoleService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserRoleService(
      mockUserRolePort as any,
      mockRolePort as any,
      mockLogger as any,
    );
  });

  describe("assign", () => {
    it("should assign role to user when role exists", async () => {
      mockRolePort.findById.mockResolvedValue({ id: 1 });
      mockUserRolePort.assignRoleToUser.mockResolvedValue(undefined);

      const result = await service.assign(1, 1);

      expect(mockRolePort.findById).toHaveBeenCalledWith(1);
      expect(mockUserRolePort.assignRoleToUser).toHaveBeenCalledWith(1, 1);
      expect(result.success).toBe(true);
    });

    it("should fail if role does not exist", async () => {
      mockRolePort.findById.mockResolvedValue(null);

      const result = await service.assign(1, 2);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Role not found");
      expect(result.error?.code).toBe(ErrorCodes.VALUE_NOT_FOUND);
    });

    it("should handle unexpected errors", async () => {
      mockRolePort.findById.mockRejectedValue(new Error("DB error"));

      const result = await service.assign(1, 1);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Server error");
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe("remove", () => {
    it("should remove role from user", async () => {
      mockUserRolePort.removeRoleFromUser.mockResolvedValue(undefined);

      const result = await service.remove(1, 1);

      expect(mockUserRolePort.removeRoleFromUser).toHaveBeenCalledWith(1, 1);
      expect(result.success).toBe(true);
    });

    it("should handle errors in remove", async () => {
      mockUserRolePort.removeRoleFromUser.mockRejectedValue(new Error("Remove error"));

      const result = await service.remove(1, 1);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Server error");
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe("listRoles", () => {
    it("should list roles for user", async () => {
      const roles = [
        { id: 1, name: "admin", description: "desc", created_at: "now", updated_at: "now" },
      ];
      mockUserRolePort.listRolesForUser.mockResolvedValue(roles);

      const result = await service.listRoles(1);

      expect(mockUserRolePort.listRolesForUser).toHaveBeenCalledWith(1);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        { id: 1, name: "admin", description: "desc", created_at: "now", updated_at: "now" },
      ]);
    });

    it("should handle errors in listRoles", async () => {
      mockUserRolePort.listRolesForUser.mockRejectedValue(new Error("List error"));

      const result = await service.listRoles(1);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Server error");
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe("listUsers", () => {
    it("should list users for role", async () => {
      mockUserRolePort.listUsersForRole.mockResolvedValue([1, 2, 3]);

      const result = await service.listUsers("admin");

      expect(mockUserRolePort.listUsersForRole).toHaveBeenCalledWith("admin");
      expect(result.success).toBe(true);
      expect(result.data).toEqual([1, 2, 3]);
    });

    it("should handle errors in listUsers", async () => {
      mockUserRolePort.listUsersForRole.mockRejectedValue(new Error("List error"));

      const result = await service.listUsers("admin");

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Server error");
      expect(result.error?.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe("unexpected", () => {
    it("should return failure for ApplicationError", () => {
      const error = new ApplicationError("Custom", ErrorCodes.SERVER_ERROR);
      const result = (service as any).unexpected(error, "context");
      expect(result.success).toBe(false);
      expect(result.error).toBe(error);
    });

    it("should log and return failure for Error", () => {
      const error = new Error("Some error");
      const result = (service as any).unexpected(error, "context");
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Server error");
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it("should return failure for unknown error", () => {
      const result = (service as any).unexpected("unknown", "context");
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Server error");
    });
  });
});
