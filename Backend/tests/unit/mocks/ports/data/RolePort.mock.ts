import RolePort, { RoleCreateData, RoleUpdateData } from "../../../../../src/domain/ports/data/RolePort";
import Role from "../../../../../src/domain/models/Role";

// Mock data para roles basados en el seed y la estructura real
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

// Contador para simular auto-increment de IDs
let nextId = 4;

const createRolePortMock = (): jest.Mocked<RolePort> => {
  return {
    create: jest.fn().mockImplementation(async (data: RoleCreateData): Promise<number> => {
      // Verificar si ya existe un rol con ese nombre
      const existing = mockRoles.find(r => r.name.toLowerCase() === data.name.toLowerCase());
      if (existing) {
        throw new Error(`Role with name '${data.name}' already exists`);
      }

      // Crear nuevo rol
      const newRole: Role = {
        id: nextId++,
        name: data.name,
        description: data.description,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Agregarlo al mock data
      mockRoles.push(newRole);

      return newRole.id;
    }),

    update: jest.fn().mockImplementation(async (id: number, data: RoleUpdateData): Promise<boolean> => {
      const roleIndex = mockRoles.findIndex(r => r.id === id);

      if (roleIndex === -1) {
        return false; // Rol no encontrado
      }

      // Si se está actualizando el nombre, verificar que no exista otro rol con ese nombre
      if (data.name) {
        const existingWithName = mockRoles.find(r =>
          r.name.toLowerCase() === data.name!.toLowerCase() && r.id !== id
        );
        if (existingWithName) {
          throw new Error(`Role with name '${data.name}' already exists`);
        }
      }

      // Actualizar el rol
      const updatedRole = {
        ...mockRoles[roleIndex],
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        updated_at: new Date(),
      };

      mockRoles[roleIndex] = updatedRole;
      return true;
    }),

    delete: jest.fn().mockImplementation(async (id: number): Promise<boolean> => {
      const roleIndex = mockRoles.findIndex(r => r.id === id);

      if (roleIndex === -1) {
        return false; // Rol no encontrado
      }

      // Remover el rol del array
      mockRoles.splice(roleIndex, 1);
      return true;
    }),

    findById: jest.fn().mockImplementation(async (id: number): Promise<Role | null> => {
      const role = mockRoles.find(r => r.id === id);

      if (!role) {
        return null;
      }

      // Retornar copia del rol para evitar mutaciones
      return {
        id: role.id,
        name: role.name,
        description: role.description,
        created_at: role.created_at,
        updated_at: role.updated_at,
      };
    }),

    findByName: jest.fn().mockImplementation(async (name: string): Promise<Role | null> => {
      const role = mockRoles.find(r => r.name.toLowerCase() === name.toLowerCase());

      if (!role) {
        return null;
      }

      // Retornar copia del rol para evitar mutaciones
      return {
        id: role.id,
        name: role.name,
        description: role.description,
        created_at: role.created_at,
        updated_at: role.updated_at,
      };
    }),

    list: jest.fn().mockImplementation(async (): Promise<Role[]> => {
      // Retornar copia de todos los roles
      return mockRoles.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description,
        created_at: role.created_at,
        updated_at: role.updated_at,
      }));
    }),
  };
}

export default createRolePortMock;