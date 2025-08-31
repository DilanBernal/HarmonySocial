import { Request, Response, Router } from "express";
import UserAdapter from "../adapter/UserAdapter";
import UserService from "../../application/services/UserService";
import UserController from '../controller/UserController';
import AuthAdapter from "../adapter/AuthAdapter";
import EmailAdapter from "../adapter/EmailAdapter";

// import DataNotFoundError from "../shared/errors/DataNotFoundError";

//Express
const router = Router();
//Inicializacion de capas
const userAdapter = new UserAdapter();
const authAdapter = new AuthAdapter();
const emailAdapter = new EmailAdapter();
const userApp = new UserService(userAdapter, authAdapter, emailAdapter);
const userController = new UserController(userApp);

//Login
// router.post("/login", async (req: Request, res: Response) => {
//   await userController.login(req, res);
// });
router.get("/ping", async (request, response: Response) => {
  response.status(200).json({ message: "pong" });
});

//Definicion de rutas o endopoints
router.post("/user", async (request, response) => {
  try {
    await userController.registerUser(request, response);
  } catch (error: any) {
    console.error("Error en usuario: ", error);
    response
      .status(error.statusCode ?? 500)
      .json({ message: "Error en la creacion del usuario" });
  }
});

// router.get("/users", async (req, res) => {
//   try {
//     await userController.allUsers(req, res);
//   } catch (error: any) {
//     res.status(error.statusCode ?? 500)
//       .json({
//         message: "Error al traer los usuarios"
//       });
//   }
// });

// router.get("/users/id/:id", async (req, res) => {
//   try {
//     await userController.searchUserById(req, res);
//   } catch (error: any) {
//     const errorMessage = error.message ?? "Error al traer el usuario";
//     res.status(error.statusCode ?? 500)
//       .json({
//         message: errorMessage
//       });
//   }
// });

// router.get("/users/email/:email", async (req, res) => {
//   try {
//     await userController.searchUserByEmail(req, res);
//   } catch (error: any) {
//     const errorMessage = error.message ?? "Error al traer el usuario";
//     res.status(error.statusCode ?? 500)
//       .json({
//         message: errorMessage
//       });
//   }
// });

// router.put("/users/:id", async (req, res) => {
//   try {
//     await userController.updataUser(req, res);
//   } catch (error: any) {
//     const errorMessage: string = error.message ?? "Error al actualizar el usuario";
//     res.status(error.statusCode ?? 500)
//       .json({
//         message: errorMessage
//       });
//   }
// })

router.delete("/user/:id", async (req, res) => {
  try {
    await userController.logicalDeleteUser(req, res);
  } catch (error: any) {
    const errorMessage = error.message ?? "Error al eliminar el usuario";
    res.status(error.statusCode ?? 500)
      .json({
        message: errorMessage
      });
    console.error(errorMessage, error);
    res.status(400)
      .json({
        message: errorMessage
      })
  }
})
export default router;