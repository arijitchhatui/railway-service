import { Router } from "express";
import { auth } from "../auth/middleware";
import {
  createTicket,
  getSingleTicket,
  getTickets,
  getTimeline,
} from "./tickets.service";

const router = Router();

router.get("/tickets", auth, getTickets);

router.post("/tickets/create", auth, createTicket);

router.get("/tickets/:postId", auth, getSingleTicket);

router.get("/tickets/timeline", auth, getTimeline);

export default router;
