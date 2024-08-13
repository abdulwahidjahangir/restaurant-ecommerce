import mongoose from "mongoose";
import initModels from "./initModels"

let connected: boolean = false;

export async function connectDB(): Promise<void> {
    try {
        mongoose.set("strictQuery", true);

        if (connected) {
            console.log("DB already connected");
            return;
        }

        if (!process.env.DB_CONNECTION) {
            throw new Error("DB_CONNECTION environment variable is not set");
        }

        await mongoose.connect(process.env.DB_CONNECTION || "");
        connected = true;
        console.log("DB connected");

        initModels();
    } catch (error) {
        console.error("Error connecting to database: ", error);
    }
}
