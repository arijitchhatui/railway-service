import { Router } from "express";
import { auth } from "../auth/middleware";
import { getUserByIdOrUsername } from "./users.service";

const router = Router();

router.get("/users/:usernameOrId" ,auth, getUserByIdOrUsername)

export default router;
