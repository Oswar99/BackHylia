import mongoose from "mongoose";
import { IUser } from "./user.model";
import { IProject } from "./project.model";

export interface IShare extends mongoose.Document{
    project: IProject,
    sharedList: IUser,
};

const ShareSchema = new mongoose.Schema({
    project: {type: mongoose.Schema.Types.ObjectId, ref: "Project", required:true},
    sharedList: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
});

export const Share = mongoose.model<IShare>("Share", ShareSchema);