import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface IFollow extends mongoose.Document{
    user: IUser,
    followed: IUser,
    created_at: Date,
};

const FollowSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    followed: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    created_at: {type:Date, required:true}
});

export const Follow = mongoose.model<IFollow>("Follow", FollowSchema);