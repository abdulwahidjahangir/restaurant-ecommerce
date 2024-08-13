import { auth } from "@/app/_lib/auth";
import { generateUniqueString, isValid } from "@/app/_lib/helper";
import { connectDB } from "@/config/dbConnection";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import User from "@/models/User";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface OrderBody {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    intent_id: string;
}

interface OrderedProduct {
    id: Types.ObjectId;
    quantity: number;
    size: string;
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const session = await auth();

        if (!session) {
            throw new Error("Please login to continue");
        }

        const userEmail: string | null | undefined = session?.user?.email;
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            throw new Error("No user found with current session");
        }

        const cart = await Cart.find({ user: user._id });

        if (!cart || cart.length === 0) {
            throw new Error("No items in the cart");
        }

        const { firstName, lastName, email, phoneNumber, address, city, state, zipcode, intent_id }: OrderBody = await req.json();

        if (!isValid(firstName)) throw new Error('Invalid or missing firstName');
        if (!isValid(lastName)) throw new Error('Invalid or missing lastName');
        if (!isValid(email)) throw new Error('Invalid or missing email');
        if (!isValid(phoneNumber)) throw new Error('Invalid or missing phoneNumber');
        if (!isValid(address)) throw new Error('Invalid or missing address');
        if (!isValid(city)) throw new Error('Invalid or missing city');
        if (!isValid(state)) throw new Error('Invalid or missing state');
        if (!isValid(zipcode)) throw new Error('Invalid or missing zipcode');
        if (!isValid(intent_id)) throw new Error('Invalid or missing intent_id');

        const paymentIntent = await stripe.paymentIntents.retrieve(intent_id);

        if (!paymentIntent || paymentIntent.status !== "succeeded") {
            throw new Error("Payment not completed");
        }

        const orderList: OrderedProduct[] = [];

        for (const item of cart) {
            orderList.push({
                id: item.product,
                quantity: item.quantity,
                size: item.size,
            });
        }

        const orderID = generateUniqueString();
        console.log(orderID)

        await Order.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            address,
            city,
            state,
            zipcode,
            products: orderList,
            status: "Order Placed",
            intent_id,
            orderID,
            user: user._id,
        });

        await Cart.deleteMany({ user: user._id });

        return new NextResponse(JSON.stringify({ message: "Order placed successfully" }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ message: "Something went wrong" }), { status: 500 });
    }
}
