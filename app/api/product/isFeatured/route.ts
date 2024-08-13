import { connectDB } from "@/config/dbConnection";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const product = await Product.find({ isFeatured: true }).limit(9);

        if (!product) {
            throw new Error("Something went wrong while loading product");
        }

        return new NextResponse(JSON.stringify({ product }), { status: 200 });
    } catch (error: any) {
        console.log(error);
        return new NextResponse(JSON.stringify({ data: "Somethign went wrong" }), { status: 500 });
    }
}