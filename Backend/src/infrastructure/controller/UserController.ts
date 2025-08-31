import UserService from "../../application/services/UserService";
import { Request, Response } from "express";
import User from "../../domain/models/User";
import { EntityNotFoundError } from "typeorm";

export default class UserController {
  private userService: UserService;

  constructor(app: UserService) {
    this.userService = app;
  }

  async registerUser(req: Request, res: Response) {
    const { full_name, email, username, password, profile_image, favorite_instrument } = req.body;
    try {
      const user: Omit<User, "id" | "status" | 'created_at' | 'updated_at'> = {
        full_name: full_name.trim(),
        email: email.trim(),
        username: username.trim(),
        password: password.trim(),
        profile_image: profile_image.trim(),
        learning_points: 0,
        favorite_instrument: favorite_instrument,
        is_artist: false,
      }

      const userId = await this.userService.registerUser(user);
      console.log(userId);
      return res.status(201)
        .status(201)
        .json({
          userId: userId.toString()
        })
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async logicalDeleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      if (await this.userService.deleteUser(Number(id))) {
        res.status(204).json({ message: "Se elimino correctamente al usuario" });
      } else {
        res.status(500).json({ messag: "No se pudo eliminar correctamente al usuario" });
      }
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        res.status(404).json({ message: "No se encontro al usuario" })
      }
      else {
        throw error;
      }
    }
  }
}