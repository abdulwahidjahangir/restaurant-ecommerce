import { connectDB } from "../../../config/dbConnection";
import Category, { ICategory } from "../../../models/Category";
import { NextRequest, NextResponse } from "next/server";

interface ResponseData {
    total: number;
    categories: ICategory[];
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        await connectDB();

        const pageNumber: number = parseInt(req.nextUrl.searchParams.get("page") ?? "1", 10);
        const limit: number = 6;
        const skip: number = (pageNumber - 1) * limit;

        const total: number = await Category.countDocuments({});
        const categories: ICategory[] = await Category.find({}).skip(skip).limit(limit).exec();

        const responseData: ResponseData = {
            total,
            categories
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
