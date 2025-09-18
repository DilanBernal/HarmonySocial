import { Router } from "express";
import FollowController from "../controller/FollowController";

const router = Router();

router.post("/", FollowController.create);
router.get("/", FollowController.findAll);
router.get("/:id", FollowController.findById);
router.put("/:id", FollowController.update);
router.delete("/:id", FollowController.delete);
router.delete("/unfollow", FollowController.unfollow);
export default router;
