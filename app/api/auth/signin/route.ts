import { connectDB } from "@/config/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import User from "@/models/User";

// Utility function to compare plain text password with hashed password
async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        return false;
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        const email: string = body.email?.trim();
        const password: string = body.password;

        const user = await User.findOne({ email });

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "Invalid Email or Password" }), { status: 401 });
        }

        const isPasswordMatch: boolean = await comparePassword(password, user.password);

        if (!isPasswordMatch) {
            return new NextResponse(JSON.stringify({ message: "Invalid Email or Password" }), { status: 401 });
        }

        return new NextResponse(JSON.stringify({ email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin }), { status: 200 });
    } catch (error) {
        // Handle any errors that occurred during the process
        return new NextResponse(JSON.stringify({ message: "Something went wrong" }), { status: 500 });
    }
}
