import { UserInterface } from "../types";

declare module "express" {
  interface Request {
    // queryParams: {
    //   limit: number;
    //   page: number;
    // };
    userId: UserInterface["_id"];
    email: UserInterface["email"];
  }
}
