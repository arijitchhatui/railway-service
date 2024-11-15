import { Collections } from "./util/constants";

(async () => {
  const { db } = await import("./rdb/mongodb");
  const users = db.collection(Collections.USERS);
  const userProfiles = db.collection(Collections.USER_PROFILES);
  for await (const user of users.find()) {
    await userProfiles.insertOne({
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
    });
  }
})();
