import { auth } from "@/app/_lib/auth";
import { connectDB } from "@/config/dbConnection";
import Cart from "@/models/Cart";
import User from "@/models/User";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
    product: string;
    size: string;
    quantity?: number;
}

interface CartItem {
    id: string;
    quantity: number;
    name: string;
    totalPrice: number;
    size: string;
    img: string;
}


export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const session = await auth();

        if (!session?.user?.email) {
            return new NextResponse(JSON.stringify({ message: "Please login to continue" }), { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "No user found" }), { status: 404 });
        }

        const data = await Cart.find({ user: user._id }).populate("product");

        const dataToReturn: CartItem[] = [];

        data.forEach((item: any) => {
            dataToReturn.push({
                id: item.product._id,
                quantity: item.quantity,
                name: item.product.title,
                totalPrice: (item.product.price + item.product.options.find((opt: any) => opt.title.toLowerCase() === item.size.toLowerCase()).additionalPrice) * item.quantity,
                size: item.size,
                img: item.product.img,
            });
        });

        return new NextResponse(JSON.stringify({ cartArray: dataToReturn }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: "An error occurred" }), { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const session = await auth();

        if (!session?.user?.email) {
            return new NextResponse(JSON.stringify({ message: "Please login to continue" }), { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "No user found" }), { status: 404 });
        }

        const { product, quantity, size }: RequestBody = await req.json();

        if (!product || !quantity || !size || quantity <= 0 || quantity > 9) {
            return new NextResponse(JSON.stringify({ message: "Please enter a valid value to continue" }), { status: 400 });
        }

        const normalizedSize = size.toLowerCase();

        const alreadyInCart = await Cart.findOne({ product, user: user._id, size: normalizedSize });

        if (alreadyInCart) {
            return new NextResponse(JSON.stringify({ message: "That product is already in the cart" }), { status: 409 });
        }

        await Cart.create({
            product,
            user: user._id,
            quantity,
            size: normalizedSize,
        });

        return new NextResponse(JSON.stringify({ message: "Product added to cart successfully" }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: "An error occurred" }), { status: 500 });
    }
}


export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        const session = await auth();

        if (!session?.user?.email) {
            return new NextResponse(JSON.stringify({ message: "Please login to continue" }), { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "No user found" }), { status: 404 });
        }

        const { product, quantity, size }: RequestBody = await req.json();

        if (!product || !quantity || !size || quantity <= 0 || quantity > 9) {
            return new NextResponse(JSON.stringify({ message: "Please enter a valid value to continue" }), { status: 400 });
        }

        const normalizedSize = size.toLowerCase();

        const cartItem = await Cart.findOne({ product, user: user._id, size: normalizedSize });

        if (!cartItem) {
            return new NextResponse(JSON.stringify({ message: "No product found inside the cart" }), { status: 404 });
        }

        // Update the existing cart item
        cartItem.quantity = quantity;
        await cartItem.save();

        return new NextResponse(JSON.stringify({ message: "Product updated in cart successfully" }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: "An error occurred while updating product" }), { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const session = await auth();

        if (!session?.user?.email) {
            return new NextResponse(JSON.stringify({ message: "Please login to continue" }), { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "No user found" }), { status: 404 });
        }

        const { product, size }: RequestBody = await req.json();

        if (!product || !size) {
            return new NextResponse(JSON.stringify({ message: "Please enter a valid value to continue" }), { status: 400 });
        }

        const normalizedSize = size.trim().toLowerCase();

        const cartItem = await Cart.findOne({ product, user: user._id, size: normalizedSize });

        if (!cartItem) {
            return new NextResponse(JSON.stringify({ message: "No such item found in cart" }), { status: 400 });
        }

        await Cart.findByIdAndDelete(cartItem._id);

        return new NextResponse(JSON.stringify({ message: "Product successfully deleted from cart" }), { status: 200 });
    } catch (error) {
        console.error('Error occurred while deleting product from cart:', error);
        return new NextResponse(JSON.stringify({ message: "An error occurred while deleting product" }), { status: 500 });
    }
}