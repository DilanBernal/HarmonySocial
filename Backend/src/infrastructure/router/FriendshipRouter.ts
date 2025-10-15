import FriendshipAdapter from "../adapter/data/social/FrienshipAdapter";
import UserAdapter from "../adapter/data/seg/UserAdapter";
import LoggerAdapter from "../adapter/utils/LoggerAdapter";
import FriendshipService from "../../application/services/FriendshipService";
import authenticateToken from "../middleware/authMiddleware";
import FriendshipController from "../controller/FriendshipController";
import { Router } from "express";
import EmailNodemailerAdapter from "../adapter/utils/EmailAdapter";

const friendshipRouter = Router();

const friendshipAdapter = new FriendshipAdapter();
const userAdapter = new UserAdapter();
const loggerAdapter = new LoggerAdapter();
const emailAdapter = new EmailNodemailerAdapter(loggerAdapter);

const friendshipService = new FriendshipService(
  friendshipAdapter,
  loggerAdapter,
  userAdapter,
  emailAdapter,
);

const friendshipController = new FriendshipController(friendshipService);

friendshipRouter.post("", authenticateToken, async (req, res) => {
  try {
    await friendshipController.newFriendship(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la amistad" });
  }
});

/**
 * Ruta para aceptar una solicitud de amistad pendiente
 * Requiere autenticación mediante token
 * Recibe el ID de la amistad como parámetro de ruta
 */
friendshipRouter.put("/accept", authenticateToken, async (req, res) => {
  try {
    await friendshipController.acceptFriendship(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al aceptar la solicitud de amistad" });
  }
});

/**
 * Ruta para rechazar una solicitud de amistad pendiente
 * Requiere autenticación mediante token
 * Recibe el ID de la amistad como parámetro de ruta
 */
friendshipRouter.put("/reject", authenticateToken, async (req, res) => {
  try {
    await friendshipController.rejectFriendship(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al rechazar la solicitud de amistad" });
  }
});

/**
 * Ruta para obtener todas las amistades de un usuario
 * Requiere autenticación mediante token
 * Recibe el ID del usuario como parámetro de ruta
 */
friendshipRouter.get("/user/:id", authenticateToken, async (req, res) => {
  try {
    await friendshipController.getUserFriendships(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las amistades del usuario" });
  }
});

friendshipRouter.get("/common", authenticateToken, async (req, res) => {
  try {
    await friendshipController.getCommonFriendships(req, res);
  } catch (error) { }
});

/**
 * Ruta para eliminar una amistad por ID
 * Requiere autenticación mediante token
 * Recibe el ID de la amistad como parámetro de ruta
 */
friendshipRouter.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await friendshipController.deleteFriendshipById(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la amistad" });
  }
});

/**
 * Ruta para eliminar una amistad por los IDs de los usuarios
 * Requiere autenticación mediante token
 * Espera un objeto con user_id y friend_id en el body
 */
friendshipRouter.delete("/users", authenticateToken, async (req, res) => {
  try {
    await friendshipController.deleteFriendship(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la amistad" });
  }
});

export default friendshipRouter;
