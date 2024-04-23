import mongoose from "mongoose";
import { DATABASE_URL } from "../constants";

export const dbConnection = async () => {
  const env = {
    dev: `${DATABASE_URL}/production`,
    test: `${DATABASE_URL}/test`,
    prod: `${DATABASE_URL}/production`,
  };
  const dbString: string = env[process.env.NODE_ENV || "dev"];
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
