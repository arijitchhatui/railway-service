import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserProfilesEntity } from "../entities/user-profiles.entity";
import { UsersEntity } from "../entities/users.entity";
import { db } from "../rdb/mongodb";
import { Collections } from "../util/constants";
import { LoginInput } from "./dto/login.dto";
import { SignUpInput } from "./dto/signup.dto";
import { createToken } from "./jwt.service";

const users = db.collection<UsersEntity>(Collections.USERS);
const profiles = db.collection<UserProfilesEntity>(Collections.USER_PROFILES);

const salt = 10;

export const login = async (req: Request, res: Response) => {
  const body = req.body as LoginInput;
  const email = body.email.toLowerCase().trim();

  const user = await users.findOne({ email });
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const isCorrect = await bcrypt.compare(body.password, user.password);
  if (!isCorrect) return res.status(401).json({ message: "Unauthorized" });

  const userId = user._id.toString();
  const accessToken = createToken({ userId });

  return res.status(200).json({ userId, accessToken });
};

export const signup = async (req: Request, res: Response) => {
  const body = req.body as SignUpInput;
  console.log(body);
  const email = body.email.toLowerCase().trim();

  const user = await users.findOne({ email });
  if (user) return res.status(400).json({ message: "Email already exists" });

  const password = await body.password

  const username = `${body.fullName
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "")}-${randomBytes(3).toString("hex")}`;

  const _id = new ObjectId();
  await users.insertOne({
    _id,
    email,
    password,
  });
  await profiles.insertOne({
    userId: _id,
    username,
    fullName: body.fullName,
  });
  const userId = _id.toString();
  const accessToken = createToken({ userId });
  return res.json({ userId, accessToken });
};

export const getAuthUser = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);

  const user = await users.findOne({ _id: userId });
  if (!user) return res.status(404).json({ message: "User not found" });

  const userProfile = await profiles.findOne({ userId });
  if (!userProfile)
    return res.status(404).json({ message: "Profile not found" });

  return res.status(200).json(userProfile);
};
