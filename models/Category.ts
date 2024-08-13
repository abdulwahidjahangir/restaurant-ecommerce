import { Schema, model, models, Document, Model } from "mongoose";

export interface ICategory extends Document {
    title: string;
    desc: string;
    color: string;
    image: string;
    slug: string;
}

const CategorySchema: Schema<ICategory> = new Schema({
    title: {
        type: String,
        required: [true, "A category must have a title"]
    },
    desc: {
        type: String,
        required: [true, "A category must have a description"]
    },
    color: {
        type: String,
        required: [true, "A category must have a color"]
    },
    image: {
        type: String,
        required: [true, "A category must have an image"]
    },
    slug: {
        type: String,
        required: [true, "A category must have a slug"]
    },
}, {
    timestamps: true
});

const Category: Model<ICategory> = models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
