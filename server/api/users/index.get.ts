import { User } from "~~/server/models/user.model";
import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
    let users;
    try {
        await mongoose.connect("mongodb://localhost:27017/chat");
        users = await User.find();
        return users;

    } catch (e) {
        console.error(e);
    }
})