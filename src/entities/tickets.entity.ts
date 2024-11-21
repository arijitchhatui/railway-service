import { ObjectId } from "mongodb";

export interface TicketsEntity {
  userId: ObjectId;
  noAdult: string;
  noChild: string;
  ticketType: string;
  des_class: string;
  trainType: string;
  bookingDate: Date;
  utsNo: string;
  via: string;
  sac: string |number;
  ir: string;
  bookingTime: Date;
  sourceStation: string;
  destinationStation: string
}
