import { Schema, model, models, Document, Model, Types } from "mongoose";

interface IOProduct extends Document {
    id: Types.ObjectId,
    quantity: number,
    size: string,
}

interface IOrder extends Document {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    address: string,
    city: string,
    state: string,
    zipcode: string,
    products: IOProduct[],
    status: string,
    intent_id?: string,
    user: Schema.Types.ObjectId,
    orderID: string,
    createdAt?: string
}


const OrderSchema: Schema<IOrder> = new Schema({
    firstName: {
        type: String,
        required: [true, "A order must have first name"]
    },
    lastName: {
        type: String,
        required: [true, "A order must have last name"]
    },
    email: {
        type: String,
        required: [true, "A order must have email"]
    },
    phoneNumber: {
        type: String,
        required: [true, "A order must have phone number"]
    },
    address: {
        type: String,
        required: [true, "A order must have address"]
    },
    city: {
        type: String,
        required: [true, "A order must have city"]
    },
    state: {
        type: String,
        required: [true, "A order must have state"]
    },
    zipcode: {
        type: String,
        required: [true, "A order must have zipcode"]
    },
    products: [
        {
            id: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: Number,
            size: String,
        }
    ],
    status: {
        type: String,
        default: "order_placed"
    },
    intent_id: {
        type: String,
        required: false,
    },
    orderID: {
        type: String,
        required: [true, "A order must have an id"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    timestamps: true
});

const Order: Model<IOrder> = models.Order || model<IOrder>("Order", OrderSchema);

export default Order;
