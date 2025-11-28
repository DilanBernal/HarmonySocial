import { BasicFilters } from "./BasicFilters";

export default interface PostFilters extends BasicFilters {
  id?: number;
  userId?: number;
  songId?: number;
  title?: string;
}
