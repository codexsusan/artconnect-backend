import {model, Schema} from "mongoose";
import {UserCategoryInterface} from "../types";

const UserCategorySchema: Schema<UserCategoryInterface> = new Schema({
    userId: {
        type: String,
        required: true,
        ref: "User",
    },
    categoryId: {
        type: String,
        required: true,
        ref: "Category",
    }
});

const UserCategory = model("UserCategory", UserCategorySchema);

export default UserCategory;