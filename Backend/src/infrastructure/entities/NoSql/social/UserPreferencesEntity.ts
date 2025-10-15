import { z } from "zod";
import UserTagEntity from "./UserTagEntity";

const UserPreferencesEntity = z.object({
  userId: z.number({ error: "El id del usuario no puede estar vacio" }).positive().readonly(),
  likedTags: z.array(UserTagEntity).optional(),
  dislikedTags: z.array(UserTagEntity).optional(),
})