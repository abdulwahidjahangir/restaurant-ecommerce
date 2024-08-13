import { Schema, model, models, Document, Model, Types } from "mongoose";

interface ICart extends Document {
    product: Types.ObjectId,
    user: Types.ObjectId,
    quantity: number,
    size: string,
}

const CartSchema: Schema<ICart> = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    quantity: {
        type: Number,
        required: [true, "You must select at least one quantity to add it your cart"]
    },
    size: {
        type: String,
        required: [true, "You must select the size of item you want"]
    },
}, {
    timestamps: true
})


const Cart: Model<ICart> = models.Cart || model<ICart>("Cart", CartSchema);

export default Cart;