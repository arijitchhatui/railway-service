import { ObjectId } from "mongodb";

export interface UserProfilesEntity {
  userId: ObjectId;
  username: string;
  fullName: string;
}
