import { auth } from "../../../_lib/auth";
import { connectDB } from "../../../../config/dbConnection";
import Cart from "../../../../models/Cart";
import User from "../../../../models/User";
import { NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe Secret Key is not defined in environment variables.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
    try {
        await connectDB();

        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Please login to continue" }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "Please login to continue" }, { status: 401 });
        }

        const cart = await Cart.find({ user: user._id }).populate("product");

        if (!cart || cart.length === 0) {
            return NextResponse.json({ error: "Please add items to cart to continue" }, { status: 400 });
        }

        const subTotal: number[] = cart.map((item: any) => {
            const option = item.product.options.find((opt: any) => opt.title.toLowerCase() === item.size.toLowerCase());
            const additionalPrice = option?.additionalPrice || 0;
            return (item.product.price + additionalPrice) * item.quantity;
        });

        let total = subTotal.reduce((acc: number, totalPrice: number) => {
            return acc + totalPrice;
        }, 0);
        total = total < 30 ? total + 5 : total;

        if (total <= 0) {
            return NextResponse.json({ error: "Invalid cart total" }, { status: 400 });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: "eur",
            automatic_payment_methods: { enabled: true },
        });

        return NextResponse.json({ paymentIntent: paymentIntent.client_secret }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error, please try again later" }, { status: 500 });
    }
}
