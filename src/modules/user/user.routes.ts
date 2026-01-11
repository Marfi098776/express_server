import express, { Request, Response } from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.post("/", userController.createUser)

router.get("/", userController.getUser)

router.get("/:id", userController.getSingleUser)

router.put("/:id", userController.editUser)

router.delete("/:id", userController.deleteUser)

export const userRoutes = router;