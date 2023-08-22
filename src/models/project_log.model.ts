import mongoose from "mongoose";
import { IUser } from "./user.model";
import { IProject } from "./project.model";

export interface IProjectLog extends mongoose.Document{
    title: string,
    created_at: Date
    created_at_str: string,
    html: string,
    css: string,
    js: string,
    public: boolean,
    created_by: IUser,
    project: IProject
};

const ProjectLogSchema = new mongoose.Schema({
    title: {type:String, required: true},
    created_at: {type:Date, required: true},
    created_at_str: {type:String, required: true},
    html: {type:String, default:""},
    css: {type:String, default:""},
    js: {type:String, default:""},
    public: {type:Boolean, default:false},
    created_by: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    project: {type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true},
});

export const ProjectLog = mongoose.model<IProjectLog>("ProjectLog", ProjectLogSchema);