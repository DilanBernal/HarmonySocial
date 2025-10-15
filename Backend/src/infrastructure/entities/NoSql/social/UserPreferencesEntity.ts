import { z } from "zod";
import UserTagEntity from "./UserTagEntity";

export const UserPreferencesSchema = z.object({
  userId: z.number({ error: "El id del usuario no puede estar vacio" }).positive().readonly(),
  likedTags: z.array(UserTagEntity).optional(),
  dislikedTags: z.array(UserTagEntity).optional(),
});

type UserPreferencesEntity = z.infer<typeof UserPreferencesSchema>;

export default UserPreferencesEntity;
