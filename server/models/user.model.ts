import { Schema, model } from "mongoose";

const userSchema = new Schema({
    user: String
});

export const User = model("user", userSchema);