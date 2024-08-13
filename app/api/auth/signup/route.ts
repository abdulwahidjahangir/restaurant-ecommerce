import { connectDB } from "@/config/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import User from "@/models/User";

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function hashPassword(password: string): Promise<string> {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        // Destructure the required fields from the parsed body and trim them
        const firstName: string = body.firstName?.trim();
        const lastName: string = body.lastName?.trim();
        const email: string = body.email?.trim();
        let password: string = body.password;

        // Validate firstName, lastName
        if (!firstName || !lastName) {
            return new NextResponse(JSON.stringify({ message: "First name and last name cannot be empty" }), { status: 400 });
        }

        // Check if all required fields are present
        if (!firstName || !lastName || !email || !password) {
            return new NextResponse(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
        }


        // Validate email format
        if (!isValidEmail(email)) {
            return new NextResponse(JSON.stringify({ message: "Invalid email format" }), { status: 400 });
        }

        // Validate the length of password
        if (password.length < 8) {
            return new NextResponse(JSON.stringify({ message: "Password must be at least 8 characters long" }), { status: 400 });
        }

        password = await hashPassword(password);

        await User.create({
            firstName, lastName, email, password
        });

        return new NextResponse(JSON.stringify({ message: "working" }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong" }), { status: 500 });
    }
}