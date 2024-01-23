import {Model, model, Schema} from "mongoose";
import {CategoryInterface} from "../types";

const CategorySchema: Schema<CategoryInterface> = new Schema({
    name: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    }
});

const Category: Model<CategoryInterface> = model("Category", CategorySchema);
export default Category;