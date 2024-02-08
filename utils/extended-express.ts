import { UserInterface } from "../types";

declare module "express" {
  interface Request {
    userId: UserInterface["_id"];
    email: UserInterface["email"];
    // file: {
    //   location: string;
    // };
  }
}
