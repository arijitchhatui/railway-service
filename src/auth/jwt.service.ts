import { sign } from "jsonwebtoken";

export const createToken = (input: { userId: string }) => {
  sign(input, process.env.JWT_SECRET!);
};
