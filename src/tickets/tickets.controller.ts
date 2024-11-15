import { Router } from "express";
import { auth } from "../auth/middleware";
import { createTicket, getTicket } from "./tickets.service";

const router = Router();

router.get("/tickets", auth, getTicket);

router.post("/tickets/create", auth, createTicket);

export default router;
