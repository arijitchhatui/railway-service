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

const saltRounds = 10;
const users = db.collection<UsersEntity>(Collections.USERS);
const userProfiles = db.collection<UserProfilesEntity>(
  Collections.USER_PROFILES
);

export const login = async (req: Request, res: Response) => {
  try {
    const body = req.body as LoginInput;
    const email = body.email.toLowerCase().trim();

    const user = await users.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const isCorrectPassword = await bcrypt.compare(
      body.password,
      user.password
    );
    if (!isCorrectPassword)
      return res.status(401).json({ message: "Invalid credentials" });
    const userId = user._id.toString();
    const accessToken = createToken({ userId });
    return res.status(200).json({ userId, accessToken });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const body = req.body as SignUpInput;
    const email = body.email.toLowerCase().trim();

    const userExists = await users.findOne({ email });
    if (!userExists)
      return res.status(401).json({ message: "Email already exists!!" });

    const password = await bcrypt.hash(body.password, saltRounds);
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
    await userProfiles.insertOne({
      userId: _id,
      username,
      fullName: body.fullName,
    });

    const userId = _id.toString();
    const accessToken = createToken({ userId });
    return res.json({ userId, accessToken });
  } catch (error) {
    console.error("SignUp error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAuthUser = async (req: Request, res: Response) => {
  const userId = new ObjectId(req.user!.userId);
  const user = await users.findOne({ _id: userId });

  if (!user) return res.status(404).json("User not found!");
  const userProfile = await userProfiles.findOne({ userId });
  if (!userProfile) return res.status(404).json("Profile not found!");
  return res.status(200).json(userProfile);
};