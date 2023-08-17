import mongoose from "mongoose";
import { IUser } from "./user.model";
import { IProject } from "./project.model";

export interface IShare extends mongoose.Document{
    project: IProject,
    shared_with: IUser,
    created_at: Date
};

const ShareSchema = new mongoose.Schema({
    project: {type: mongoose.Schema.Types.ObjectId, ref: "Project", required:true},
    shared_with: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    created_at: {type: Date, required: true}
});
 
export const Share = mongoose.model<IShare>("Share", ShareSchema);