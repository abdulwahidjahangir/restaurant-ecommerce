import { connectDB } from "@/config/dbConnection";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

type GetProductParams = {
    params: {
        id: string
    }
}

export async function GET(req: NextRequest, { params }: GetProductParams) {
    try {
        await connectDB();

        const productId: string = params.id || "";

        if (productId === "") {
            throw new Error("Missing product ID!");
        }

        const product = await Product.findById(productId);

        if (!product) {
            throw new Error("Something went wrong while loading product");
        }

        return new NextResponse(JSON.stringify({ product }), { status: 200 });
    } catch (error: any) {
        console.log(error);
        return new NextResponse(JSON.stringify({ data: "Somethign went wrong" }), { status: 500 });
    }
}