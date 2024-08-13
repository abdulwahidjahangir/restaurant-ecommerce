import { connectDB } from "@/config/dbConnection";
import User from "@/models/User";

export async function getUser(email: string) {
    try {
        await connectDB();

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("No user found");
        }

        return user;
    } catch (error) {
        console.log("Error While getting user data: ", error)
        return null;
    }
}