import { connectDB } from "../../../../config/dbConnection";
import Category from "../../../../models/Category";
import Product from "../../../../models/Product";
import { NextResponse, NextRequest } from "next/server";

type CategoryTypeParams = {
    params: {
        categoryType: string,
    }
}

export async function GET(req: NextRequest, { params }: CategoryTypeParams) {
    try {
        await connectDB();

        const url = new URL(req.url);
        const pageParam = url.searchParams.get("page");


        let pageNumber: number = pageParam ? parseInt(pageParam, 10) : 1;
        if (pageNumber <= 0) {
            pageNumber = 1;
        }

        const limit: number = 6;
        const skip: number = (pageNumber - 1) * limit;

        const categoryTitle: string = params.categoryType;

        const category = await Category.findOne({ slug: categoryTitle });
        if (!category) {
            return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 404 });
        }

        const totalPages = Math.ceil(await Product.countDocuments({ category: category._id }) / limit);
        const products = await Product.find({ category: category._id }).skip(skip).limit(limit);

        const resData = {
            totalPages,
            products,
        }

        return new NextResponse(JSON.stringify(resData), { status: 200 });
    } catch (error: any) {
        console.error(error); // Log error for debugging
        return new NextResponse(JSON.stringify({ message: "Something went wrong" }), { status: 500 });
    }
}
