import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface IProject extends mongoose.Document{
    title: string,
    created_at: Date,
    html: string,
    css: string,
    js: string,
    type: string,
    shared: boolean,
    user: IUser
};

const ProjectSchema = new mongoose.Schema({
    title: {type:String, required: true},
    create_at: {type:Date, required: true},
    html: {type:String, default:""},
    css: {type:String, default:""},
    js: {type:String, default:""},
    type: {type:String, default:"PUBLICO"},
    shared: {type:Boolean, default: false},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
});

export const Project = mongoose.model<IProject>("Project", ProjectSchema);