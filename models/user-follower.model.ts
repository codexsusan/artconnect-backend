import { Schema, model } from "mongoose";
import { UserFollowersInterface } from "../types";

const UserFollowerSchema: Schema<UserFollowersInterface> = new Schema(
  {
    followingId: {
      type: String,
      ref: "User",
      required: true,
    },
    followerId: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserFollower = model("UserFollower", UserFollowerSchema);

export default UserFollower;
