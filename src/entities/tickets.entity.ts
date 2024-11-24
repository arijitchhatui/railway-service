import { ObjectId } from "mongodb";

export interface TicketsEntity {
  userId: ObjectId;
  noAdult: number;
  noChild: number;
  ticketType: string;
  des_class: string;
  trainType: string;
  bookingDate: Date;
  utsNo: string;
  via: string;
  sac: string;
  ir: string;
  bookingTime: Date;
  sourceStation: string
  destinationStation: string
}
