import {model, Schema} from "mongoose";
import {UserInterestInterface} from "../types";

const UserInterestSchema: Schema<UserInterestInterface> = new Schema({
    userId: {
        type: String,
        required: true,
        ref: "User",
    },
    interestId: {
        type: String,
        required: true,
        ref: "Category",
    }
});

const UserInterest = model("UserInterest", UserInterestSchema);

export default UserInterest;