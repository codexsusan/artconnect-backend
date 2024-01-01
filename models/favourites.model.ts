import { model, Schema } from "mongoose";
import { FavouritesInterface } from "../types";
import UserModel from "./user.model";

const favouritesSchema: Schema<FavouritesInterface> =
  new Schema<FavouritesInterface>({
    userId: {
      type: String,
      required: true,
      ref: UserModel,
    },
    artworkId: {
      type: String,
      required: true,
    },
  });

const Favourites = model("Favourites", favouritesSchema);
export default Favourites;
