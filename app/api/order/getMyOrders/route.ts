import { connectDB } from "../../../../config/dbConnection";
import Order from "../../../../models/Order"
import User from "../../../../models/User";
import Product from "../../../../models/Product";
import { NextRequest, NextResponse } from "next/server";

interface OrderData {
    orderID: string;
    totalPrice: number;
    products: {
        name: string;
        size: string;
        quantity: number;
        price: number;
    }[];
    date: string;
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        console.log("Connected to database");

        const { email } = await req.json();

        if (!email) {
            throw new Error("Please login to continue");
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            console.log("User not found");
            return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const orders = await Order.find({ user: user._id }).populate({
            path: 'products.id',
            model: Product
        }).sort({ createdAt: -1 });

        const orderDataToReturn: OrderData[] = orders.map(order => {
            const products = order.products.map(product => {
                const productData = product.id as any;
                return {
                    name: productData.title,
                    size: product.size,
                    quantity: product.quantity,
                    price: productData.price + (productData.options.find((opt: any) => opt.title === product.size)?.additionalPrice || 0)
                };
            });

            let totalPrice = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
            totalPrice = totalPrice < 30 ? totalPrice + 5 : totalPrice;

            return {
                orderID: order.orderID,
                totalPrice: totalPrice,
                products: products,
                date: order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'
            };
        });

        return new NextResponse(JSON.stringify(orderDataToReturn), { status: 200 });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return new NextResponse(JSON.stringify({ error: "An error occurred while fetching orders" }), { status: 500 });
    }
}