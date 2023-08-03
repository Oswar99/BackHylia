import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface IShare extends mongoose.Document{
    user: IUser,
    sh: IUser,
};

const ShareSchema = new mongoose.Schema({
    project: {type: mongoose.Schema.Types.ObjectId, ref: "Project", required:true},
    sharedList: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
});

export const Share = mongoose.model<IShare>("Share", ShareSchema);