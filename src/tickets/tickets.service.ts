import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { TicketsEntity } from "../entities/tickets.entity";
import { db } from "../rdb/mongodb";
import { Collections } from "../util/constants";
import { CreateTicketInput } from "./dto/create-ticket.dto";

const tickets = db.collection<TicketsEntity>(Collections.TICKET);

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

export const getTickets = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);
  const ticket = await tickets.find({ userId }).toArray();
  return res.json(ticket);
};

export const createTicket = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);
  const body = req.body as CreateTicketInput;
  const bookingTime = new Date();
  const bookingDate = new Date(bookingTime.getTime() + 24 * 60 * 60 * 1000);
  const utsNo = getIr(15);
  const sac = getSac(10);
  const ir = getIr(15);

  await tickets.insertOne({
    ir,
    sac,
    utsNo,
    userId,
    via: body.via,
    noChild: body.noChild,
    noAdult: body.noAdult,
    bookingTime: bookingTime,
    bookingDate: bookingDate,
    des_class: body.des_class,
    trainType: body.trainType,
    ticketType: body.ticketType,
    sourceStation: body.sourceStation,
    destinationStation: body.destinationStation,
  });

  return res.status(200).json({ message: "OK" });
};

export const getSingleTicket = async (req: Request, res: Response) => {
  const ticketId = new ObjectId(req.params.ticketId);
  const [result] = await tickets
    .aggregate([
      {
        $match: { _id: ticketId },
      },
      {
        $lookup: {
          from: Collections.USER_PROFILES,
          localField: "userId",
          foreignField: "userId",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ])
    .toArray();
  return res.json(result);
};

export const getTimeline = async (req: Request, res: Response) => {
  const result = await tickets
    .aggregate([
      {
        $lookup: {
          from: Collections.USER_PROFILES,
          localField: "userId",
          foreignField: "userId",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ])
    .toArray();
  return res.json(result);
};
