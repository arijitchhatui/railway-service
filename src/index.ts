import { config } from "dotenv";
config();

import cors from "cors";
import express from "express";
import morgan from "morgan";

import loginRouter from "./auth/auth.controller";
import ticketRouter from "./tickets/tickets.controller";


const app = express();

declare module "express" {
  interface Request {
    user?: { userId: string };
  }
}

app.use(express.json());
app.use(cors());
app.use(morgan("dev"))

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use(loginRouter, ticketRouter);


const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
