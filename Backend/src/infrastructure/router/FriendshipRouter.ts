import FriendshipAdapter from "../adapter/data/FrienshipAdapter";
import LoggerAdapter from "../adapter/utils/LoggerAdapter";
import FriendshipService from "../../application/services/FriendshipService";
import authenticateToken from "../middleware/authMiddleware";
import FriendshipController from "../controller/FriendshipController";
import { Router } from "express";

const friendshipRouter = Router();

const friendshipAdapter = new FriendshipAdapter();
const loggerAdapter = new LoggerAdapter();

const friendshipService = new FriendshipService(friendshipAdapter, loggerAdapter);

const friendshipController = new FriendshipController(friendshipService);

friendshipRouter.post("", authenticateToken, async (req, res) => {
  try {
    console.log(req.body);
    await friendshipController.newFriendship(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la amistad" });
  }
});

export default friendshipRouter;
