import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserProfilesEntity } from "../entities/user-profiles.entity";
import { db } from "../rdb/mongodb";
import { Collections } from "../util/constants";

const userProfiles = db.collection<UserProfilesEntity>(
  Collections.USER_PROFILES
);

export const getUserByIdOrUsername = async (req: Request, res: Response) => {
  console.log(req.params);

  const where = ObjectId.isValid(req.params.usernameOrId)
    ? { _id: new ObjectId(req.params.usernameOrId) }
    : { username: req.params.usernameOrId };

  const userProfile = await userProfiles.findOne(where);
  if (!userProfile) return res.status(404).json("User not found!");

  return res.status(200).json(userProfile);
};
