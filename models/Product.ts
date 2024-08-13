import { Schema, model, models, Document, Model } from "mongoose";

interface Options {
    title: string;
    additionalPrice: number;
}

export interface IProduct extends Document {
    title: string;
    desc: string;
    img: string;
    price: number;
    isFeatured: boolean;
    options: Options[];
    category: Schema.Types.ObjectId;
}

const ProductSchema: Schema<IProduct> = new Schema({
    title: {
        type: String,
        required: [true, "A product must have a title"]
    },
    desc: {
        type: String,
        required: [true, "A product must have a description"]
    },
    img: {
        type: String,
        required: [true, "A product must have an image"]
    },
    price: {
        type: Number,
        required: [true, "A product must have a price"]
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    options: [
        {
            title: { type: String, required: [true, "An option must have a title"] },
            additionalPrice: { type: Number, required: [true, "An option must have an additional price"] },
        }
    ],
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "A product must belong to a category"],
    }
}, {
    timestamps: true
});

const Product: Model<IProduct> = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
