import mongoose from "mongoose";
import { DATABASE_URL } from "../constants";

export const dbConnection = async () => {
  const dbString: string =
    process.env.NODE_ENV === "test"
      ? `${DATABASE_URL}/test`
      : `${DATABASE_URL}/dev`;
  console.log("Connecting to database ...");
  try {
    await mongoose.connect(dbString).then(() => {
      console.log("Connected to database");
    });
  } catch (error) {
    console.log("Database connection failed");
    console.log(error);
  }
};
