import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface IPersonImage extends mongoose.Document{
    name: string,
    type: string,
    route: string,
    user: IUser,
    created_at: Date,
};

const ImageSchema = new mongoose.Schema({
    name: {type:String, required: true},
    type: {type:String, required: true},
    route: {type:String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    created_at: {type:Date, required: true},
});

export const PersonImage = mongoose.model<IPersonImage>("PersonImage", ImageSchema);