import { Router } from "express";
import * as userController from "../controllers/user.js";

const router = Router();

router.post("/", userController.createUser);
router.get("/:id", userController.getUser);

export default router;
