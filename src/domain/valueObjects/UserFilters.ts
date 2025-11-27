import { UserStatus } from "../models/seg/User";
import { BasicFilters } from "./BasicFilters";

export default interface UserFilters extends BasicFilters {
  id?: number;
  username?: string;
  email?: string;
  status?: UserStatus;
}
