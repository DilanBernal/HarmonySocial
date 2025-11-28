import { BasicFilters } from "./BasicFilters";

export default interface PermissionFilters extends BasicFilters {
  id?: number;
  name?: string;
}
