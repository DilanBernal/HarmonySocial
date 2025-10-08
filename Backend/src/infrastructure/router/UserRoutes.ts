import { Request, Response, Router } from "express";
import UserAdapter from "../adapter/data/UserAdapter";
import UserService from "../../application/services/UserService";
import AuthService from "../../application/services/AuthService";
import UserController from "../controller/UserController";
import RoleAdapter from "../adapter/data/RoleAdapter";
import UserRoleAdapter from "../adapter/data/UserRoleAdapter";
import AuthAdapter from "../adapter/data/AuthAdapter";
import EmailNodemailerAdapter from "../adapter/utils/EmailAdapter";
import LoggerAdapter from "../adapter/utils/LoggerAdapter";
import TokenAdapter from "../adapter/utils/TokenAdapter";
import { validateRequest } from "../middleware/validateRequest";
import loginSchema from "../validator/seg/user/LoginValidator";
import registerSchema from "../validator/seg/user/RegisterValidator";
import authenticateToken from "../middleware/authMiddleware";

const router = Router();

const userAdapter = new UserAdapter();
const authAdapter = new AuthAdapter();
const loggerAdapter = new LoggerAdapter();
const tokenAdapter = new TokenAdapter();
const emailAdapter = new EmailNodemailerAdapter(loggerAdapter);
const roleAdapter = new RoleAdapter();
const userRoleAdapter = new UserRoleAdapter();
const userApp = new UserService(
  userAdapter,
  authAdapter,
  emailAdapter,
  loggerAdapter,
  tokenAdapter,
  roleAdapter,
  userRoleAdapter,
);
const authService = new AuthService(
  userAdapter,
  authAdapter,
  emailAdapter,
  loggerAdapter,
  tokenAdapter,
  userRoleAdapter,
);
const userController = new UserController(userApp, authService, loggerAdapter);

router.post("/login", validateRequest(loginSchema), async (req: Request, res: Response) => {
  try {
    await userController.loginUser(req, res);
  } catch (error: any) {
    console.error("Error en login: ", error);
    res.status(500).json({ message: "Error en el login del usuario" });
  }
});

router.post("/register", validateRequest(registerSchema), async (request, response) => {
  try {
    await userController.registerUser(request, response);
  } catch (error: any) {
    console.error("Error en usuario: ", error);
    response.status(500).json({ message: "Error en la creacion del usuario" });
  }
});

router.get("/all", authenticateToken, async (req, res) => {
  try {
    await userController.getAllUsers(req, res);
  } catch (error: any) {
    const errorMessage = error.message ?? "Error al traer los usuarios";
    res.status(error.statusCode ?? 500).json({
      message: errorMessage,
    });
    console.error(errorMessage, error);
  }
});

router.get("/id/:id", authenticateToken, async (req, res) => {
  try {
    await userController.getUserById(req, res);
  } catch (error: any) {
    const errorMessage = error.message ?? "Error al traer el usuario";
    res.status(error.statusCode ?? 500).json({
      message: errorMessage,
    });
    console.error(errorMessage, error);
  }
});

router.get("/email/:email", authenticateToken, async (req, res) => {
  try {
    await userController.getUserByEmail(req, res);
  } catch (error: any) {
    const errorMessage = error.message ?? "Error al traer el usuario";
    res.status(error.statusCode ?? 500).json({
      message: errorMessage,
    });
    console.error(errorMessage, error);
  }
});

router.get("/basic-info", async (req, res) => {
  try {
    await userController.getBasicUserData(req, res);
  } catch (error: any) {
    loggerAdapter.debug(
      "Es en la parte despues de que el error no sea instancia ni de NotFoundResponse ni de ApplicationResponse",
      [error, typeof error],
    );
    console.log(error);

    loggerAdapter.error("Ocurrio un error al traer la info del usuario", [error, error.title]);
    const errorMessage = error.message ?? "Error al traer el usuario";
    res.status(error.statusCode ?? 500).json({
      message: errorMessage,
    });
    console.error(errorMessage, error);
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    await userController.updateUser(req, res);
  } catch (error: any) {
    const errorMessage: string = error.message ?? "Error al actualizar el usuario";
    res.status(error.statusCode ?? 500).json({
      message: errorMessage,
    });
    console.error(errorMessage, error);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await userController.logicalDeleteUser(req, res);
  } catch (error: any) {
    const errorMessage = error.message ?? "Error al eliminar el usuario";
    res.status(error.statusCode ?? 500).json({
      message: errorMessage,
    });
    console.error(errorMessage, error);
    res.status(400).json({
      message: errorMessage,
    });
  }
});

// Ruta para recuperar contraseña
router.post("/forgot-password", async (req, res) => {
  try {
    await userController.forgotPassword(req, res);
  } catch (error: any) {
    const errorMessage = error.message ?? "Error al procesar la recuperación de contraseña";
    res.status(error.statusCode ?? 500).json({
      message: errorMessage,
    });
    console.error(errorMessage, error);
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    await userController.resetPassword(req, res);
  } catch (error: any) {
    const errorMessage = error.message ?? "Error al restablecer la contraseña";
    res.status(error.statusCode ?? 500).json({
      message: errorMessage,
    });
    console.error(errorMessage, error);
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    await userController.verifyEmail(req, res);
  } catch (error: any) {
    const errorMessage = error.message ?? "Error al verificar el email";
    res.status(error.statusCode ?? 500).json({
      message: errorMessage,
    });
    console.error(errorMessage, error);
  }
});

router.get("/paginated", async (req, res) => {
  try {
    await userController.searchPaginatedUsers(req, res);
  } catch (e: any) {
    return res.status(500).json({ message: e?.message ?? "Error interno" });
  }
});

router.get("/list", async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "100")) || 100, 1), 1000);
    const r = await userApp.listUsers(limit);
    if (!r.success) {
      return res.status(500).json({ message: r.error?.message ?? "Error listando usuarios" });
    }
    return res.json({ rows: r.data ?? [] });
  } catch (e: any) {
    return res.status(500).json({ message: e?.message ?? "Error interno" });
  }
});

router.get("/", async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "100")) || 100, 1), 1000);
    const r = await userApp.listUsers(limit);
    if (!r.success) {
      return res.status(500).json({ message: r.error?.message ?? "Error listando usuarios" });
    }
    return res.json({ rows: r.data ?? [] });
  } catch (e: any) {
    return res.status(500).json({ message: e?.message ?? "Error interno" });
  }
});

export default router;
