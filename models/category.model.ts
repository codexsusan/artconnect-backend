import {Model, model, Schema} from "mongoose";
import {CategoryInterface} from "../types";

const CategorySchema: Schema<CategoryInterface> = new Schema({
    name: {
        type: String,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false,
    }
});

const Category: Model<CategoryInterface> = model("Category", CategorySchema);
export default Category;