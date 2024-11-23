export interface CreateTicketInput {
  noAdult: number;
  noChild: number;
  ticketType: string;
  des_class: string;
  trainType: string;
  via: string;
  sourceStation: string;
  destinationStation: string;
}
