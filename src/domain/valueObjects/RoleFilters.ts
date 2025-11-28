import { BasicFilters } from "./BasicFilters";

export default interface RoleFilters extends BasicFilters {
  id?: number;
  name?: string;
}
