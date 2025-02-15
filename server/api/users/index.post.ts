import { User } from "~~/server/models/user.model";
import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    try {
        await mongoose.connect("mongodb://localhost:27017/chat");
        const user = new User({user: body.user});
        await user.save();
    } catch (e) {
        console.error(e);
    }
})