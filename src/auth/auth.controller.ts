import { Router } from "express";
import { getAuthUser, login, signup } from "./auth.service";

const router = Router();

router.post("/auth/login", login);

router.post("/auth/signup", signup);

router.get("/auth/status", getAuthUser);

export default router;
