import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { TicketEntity } from "../entities/ticket.entity";
import { db } from "../rdb/mongodb";
import { Collections } from "../util/constants";
import { CreateTicketInput } from "./dto/create-ticket.dto";

const tickets = db.collection<TicketEntity>(Collections.TICKET);

function getSac(length: 10): string {
  const characters = "1QAZ2WSX3EDC4RFV5TGB6YHN7UJM8IK9OLP0";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
function getIr(length: 15): string {
  const characters = "1QAZ2WSX3EDC4RFV5TGB6YHN7UJM8IK9OLP0";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const getTicket = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);
  const ticket = await tickets.find({ userId }).toArray();
  return res.json(ticket);
};

export const createTicket = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);
  const body = req.body as CreateTicketInput;
  const sac =  getSac(10);
  const ir =  getIr(15);
  const utsNo =  getIr(15);

  await tickets.insertOne({
    userId,
    noAdult: body.noAdult,
    noChild: body.noChild,
    ticketType: body.ticketType,
    class: body.class,
    trainType: body.trainType,
    bookingDate: new Date(),
    utsNo,
    mobileNumber: body.mobileNumber,
    via: body.via,
    sac,
    ir,
    bookingTime: new Date(),
    charge: body.charge,
  });

  return res.status(200).json({ message: "OK" });
};
