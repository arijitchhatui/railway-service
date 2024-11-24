import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { TicketsEntity } from "../entities/tickets.entity";
import { db } from "../rdb/mongodb";
import { Collections } from "../util/constants";
import { CreateTicketInput } from "./dto/create-ticket.dto";

const tickets = db.collection<TicketsEntity>(Collections.TICKET);

const handleTranslate = async (text: string, language: string) => {
  const accessToken = process.env.GOOGLE_TRANSLATION_API_KEY;
  const url = process.env.GOOGLE_TRANSLATION_URL;
  const res = await fetch(
    `${url}?q=${encodeURIComponent(
      text
    )}&target=${language}&key=${accessToken}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error.message);
  }
  return data.data.translations[0].translatedText;
};

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
function getUtsNo(length: 9): string {
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
  const utsNo = getUtsNo(9);
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

  const ticket = await tickets.findOne({ _id: ticketId });
  if (!ticket) {
    return res.json({ message: "There is no such ticket!" });
  }
  return res.status(200).json(result)

  // const sourceStationHindi = await handleTranslate(result.sourceStation, "hi");
  // const sourceStationBengali = await handleTranslate(
  //   result.sourceStation,
  //   "bn"
  // );
  // const destinationStationHindi = await handleTranslate(
  //   result.destinationStation,
  //   "hi"
  // );
  // const destinationStationBengali = await handleTranslate(
  //   result.destinationStation,
  //   "bn"
  // );

  // const response = {
  //   ...result,
  //   sourceStation: {
  //     original: result.sourceStation,
  //     hindi: sourceStationHindi,
  //     bengali: sourceStationBengali,
  //   },
  //   destinationStation: {
  //     original: result.destinationStation,
  //     hindi: destinationStationHindi,
  //     bengali: destinationStationBengali,
  //   },
  // };
  // return res.json(response);
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
      {
        $sort: {
          _id: -1,
        },
      },
    ])
    .toArray();
  return res.json(result);
};

export const deleteTicket = async (req: Request, res: Response) => {
  const ticketId = new ObjectId(req.params.id);
  const userId = new ObjectId(req.user!.userId);
  await tickets.deleteOne({ userId, _id: ticketId });

  return res.status(200).json({ message: "Deleted" });
};
