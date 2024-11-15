import { ObjectId } from "mongodb";

export interface TicketEntity {
  userId: ObjectId;
  noAdult: number;
  noChild: number;
  ticketType: string;
  class: string;
  trainType: string;
  bookingDate: Date;
  utsNo: string;
  mobileNumber: number;
  via: string;
  sac: string |number;
  ir: string;
  bookingTime: Date;
  charge: number;
}
