import { Router } from "express";
import { auth } from "../auth/middleware";
import {
  createTicket,
  deleteTicket,
  getSingleTicket,
  getTickets,
  getTimeline,
} from "./tickets.service";

const router = Router();

router.get("/tickets", auth, getTickets);

router.post("/tickets/create", auth, createTicket);

router.get("/tickets/timeline", auth, getTimeline);

router.get("/tickets/:ticketId", auth, getSingleTicket);

router.delete("/tickets/:id/delete", auth, deleteTicket);


export default router;
