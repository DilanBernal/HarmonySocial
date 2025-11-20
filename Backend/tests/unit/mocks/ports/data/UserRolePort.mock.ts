import UserRolePort from "../../../../../src/domain/ports/data/seg/UserRolePort";
import Role from "../../../../../src/domain/models/seg/Role";
import { CorePermission } from "../../../../../src/domain/models/seg/Permission";

// Mock data para roles basados en el seed
const mockRoles: Role[] = [
  {
    id: 1,
    name: "common_user",
    description: "Usuario común con permisos básicos",
    created_at: new Date("2023-01-01"),
    updated_at: new Date("2023-01-01"),
  },
  {
    id: 2,
    name: "artist",
    description: "Artista con permisos de creación de contenido",
    created_at: new Date("2023-01-01"),
    updated_at: new Date("2023-01-01"),
  },
  {
    id: 3,
    name: "admin",
    description: "Administrador con todos los permisos",
    created_at: new Date("2023-01-01"),
    updated_at: new Date("2023-01-01"),
  },
];

// Mock data para relaciones usuario-rol
// Simulamos que tenemos algunos usuarios con roles asignados
const mockUserRoles = new Map<number, number[]>([
  [1, [1]], // Usuario 1 tiene rol common_user
  [2, [1, 2]], // Usuario 2 tiene roles common_user y artist
  [3, [1, 2, 3]], // Usuario 3 tiene todos los roles (admin completo)
]);

// Mock data para usuarios por rol
const mockRoleUsers = new Map<string, number[]>([
  ["common_user", [1, 2, 3]],
  ["artist", [2, 3]],
  ["admin", [3]],
]);

const createUserRolePortMock = (): jest.Mocked<UserRolePort> => {
  return {
    assignRoleToUser: jest.fn().mockImplementation(async (userId: number, roleId: number): Promise<boolean> => {
      // Verificar que el rol existe
      const roleExists = mockRoles.some(r => r.id === roleId);
      if (!roleExists) {
        return false;
      }

      // Obtener roles actuales del usuario
      const currentUserRoles = mockUserRoles.get(userId) || [];

      // Si ya tiene el rol, retornar true (ya asignado)
      if (currentUserRoles.includes(roleId)) {
        return true;
      }

      // Simular asignación del rol
      const updatedRoles = [...currentUserRoles, roleId];
      mockUserRoles.set(userId, updatedRoles);

      // Actualizar también el mapa de usuarios por rol
      const role = mockRoles.find(r => r.id === roleId);
      if (role) {
        const usersForRole = mockRoleUsers.get(role.name) || [];
        if (!usersForRole.includes(userId)) {
          mockRoleUsers.set(role.name, [...usersForRole, userId]);
        }
      }

      return true;
    }),

    removeRoleFromUser: jest.fn().mockImplementation(async (userId: number, roleId: number): Promise<boolean> => {
      const currentUserRoles = mockUserRoles.get(userId) || [];

      // Si no tiene el rol, retornar false
      if (!currentUserRoles.includes(roleId)) {
        return false;
      }

      // Remover el rol
      const updatedRoles = currentUserRoles.filter(r => r !== roleId);
      mockUserRoles.set(userId, updatedRoles);

      // Actualizar también el mapa de usuarios por rol
      const role = mockRoles.find(r => r.id === roleId);
      if (role) {
        const usersForRole = mockRoleUsers.get(role.name) || [];
        const updatedUsers = usersForRole.filter(u => u !== userId);
        mockRoleUsers.set(role.name, updatedUsers);
      }

      return true;
    }),

    listRolesForUser: jest.fn().mockImplementation(async (userId: number): Promise<Role[]> => {
      const userRoleIds = mockUserRoles.get(userId) || [];
      const userRoles = mockRoles.filter(role => userRoleIds.includes(role.id));

      // Retornar roles en el formato esperado por el adapter
      return userRoles.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description,
        created_at: role.created_at,
        updated_at: role.updated_at,
      }));
    }),

    listUsersForRole: jest.fn().mockImplementation(async (roleName: string): Promise<number[]> => {
      const users = mockRoleUsers.get(roleName) || [];
      return [...users]; // Retornar copia del array
    }),

    userHasRole: jest.fn().mockImplementation(async (userId: number, roleName: string): Promise<boolean> => {
      const userRoleIds = mockUserRoles.get(userId) || [];
      const role = mockRoles.find(r => r.name === roleName);

      if (!role) {
        return false;
      }

      return userRoleIds.includes(role.id);
    }),
  };
}

export default createUserRolePortMock;