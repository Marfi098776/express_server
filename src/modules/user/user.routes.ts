import express, { Request, Response } from "express";
import { userController } from "./user.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/",logger, userController.createUser)

router.get("/",logger, auth(), userController.getUser)

router.get("/:id",logger, userController.getSingleUser)

router.put("/:id",logger, userController.editUser)

router.delete("/:id",logger, userController.deleteUser)

export const userRoutes = router;