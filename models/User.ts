import { Schema, Model, Document, model, models } from "mongoose";

interface IUser extends Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isAdmin: boolean,
}

const UserSchema: Schema<IUser> = new Schema({
    firstName: {
        type: String,
        required: [true, "A user must have first name."]
    },
    lastName: {
        type: String,
        required: [true, "A user must have last name."]
    },
    email: {
        type: String,
        required: [true, "A user must have email."],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: [true, "A user must have passowrd."]
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
})

const User: Model<IUser> = models.User || model("User", UserSchema);

export default User;