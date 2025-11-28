import RolePermissionPort from "../../../../../../src/domain/ports/data/seg/RolePermissionPort";
import { ApplicationResponse } from "../../../../../../src/application/shared/ApplicationReponse";
import { ApplicationError, ErrorCodes } from "../../../../../../src/application/shared/errors/ApplicationError";
import Permission, { CorePermission, DefaultRolePermissionMapping } from "../../../../../../src/domain/models/seg/Permission";

// Mock data for permissions based on seed structure
const mockPermissions: Permission[] = [
  {
    id: 1,
    name: CorePermission.USER_READ,
    description: "Can read user information",
    created_at: new Date("2023-01-01"),
    updated_at: new Date("2023-01-01"),
  },
  {
    id: 2,
    name: CorePermission.FILE_OWN_DELETE,
    description: "Can delete own files",
    created_at: new Date("2023-01-01"),
    updated_at: new Date("2023-01-01"),
  },
  {
    id: 3,
    name: CorePermission.FILE_OWN_UPDATE,
    description: "Can update own files",
    created_at: new Date("2023-01-01"),
    updated_at: new Date("2023-01-01"),
  },
  {
    id: 4,
    name: CorePermission.ARTIST_UPDATE,
    description: "Can update artist",
    created_at: new Date("2023-01-01"),
    updated_at: new Date("2023-01-01"),
  },
];

// Role to permissions mapping
const rolePermissionsMap = new Map<number, number[]>([
  [1, [1, 2, 3]], // common_user has basic permissions
  [2, [1, 2, 3, 4]], // artist has basic permissions + artist
  [3, [1, 2, 3, 4]], // admin has all permissions
]);

const createRolePermissionPortMock = (): jest.Mocked<RolePermissionPort> => {
  return {
    assign: jest.fn().mockImplementation(async (roleId: number, permissionId: number) => {
      // Verify permission exists
      const permissionExists = mockPermissions.some(p => p.id === permissionId);
      if (!permissionExists) {
        return ApplicationResponse.failure(
          new ApplicationError("Permission not found", ErrorCodes.VALUE_NOT_FOUND)
        );
      }

      // Get current permissions for role
      const currentPermissions = rolePermissionsMap.get(roleId) || [];
      
      // Check if already assigned
      if (currentPermissions.includes(permissionId)) {
        return ApplicationResponse.emptySuccess();
      }

      // Add permission
      rolePermissionsMap.set(roleId, [...currentPermissions, permissionId]);
      return ApplicationResponse.emptySuccess();
    }),

    unassign: jest.fn().mockImplementation(async (roleId: number, permissionId: number) => {
      const currentPermissions = rolePermissionsMap.get(roleId) || [];
      
      if (!currentPermissions.includes(permissionId)) {
        return ApplicationResponse.failure(
          new ApplicationError("Permission not assigned to role", ErrorCodes.VALUE_NOT_FOUND)
        );
      }

      // Remove permission
      const updatedPermissions = currentPermissions.filter(p => p !== permissionId);
      rolePermissionsMap.set(roleId, updatedPermissions);
      return ApplicationResponse.emptySuccess();
    }),

    getPermissionsByRole: jest.fn().mockImplementation(async (roleId: number) => {
      const permissionIds = rolePermissionsMap.get(roleId) || [];
      const permissions = mockPermissions.filter(p => permissionIds.includes(p.id));
      return ApplicationResponse.success(permissions);
    }),

    getPermissionsByRoleNames: jest.fn().mockImplementation(async (roleNames: string[]) => {
      const allPermissions: Permission[] = [];
      
      for (const roleName of roleNames) {
        const rolePermissionNames = DefaultRolePermissionMapping[roleName] || [];
        const permissions = mockPermissions.filter(p => 
          rolePermissionNames.includes(p.name as CorePermission)
        );
        
        // Add unique permissions
        for (const perm of permissions) {
          if (!allPermissions.some(p => p.id === perm.id)) {
            allPermissions.push(perm);
          }
        }
      }
      
      return ApplicationResponse.success(allPermissions);
    }),
  };
};

export default createRolePermissionPortMock;
