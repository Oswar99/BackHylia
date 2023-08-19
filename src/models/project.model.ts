import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface IProject extends mongoose.Document{
    title: string,
    created_at: Date,
    created_at_str: string,
    last_modified: Date,
    last_modified_str: string
    html: string,
    css: string,
    js: string,
    public: boolean,
    shared: boolean,
    user: IUser,
    father: string,
    carpet: boolean,
};

const ProjectSchema = new mongoose.Schema({
    title: {type:String, required: true},
    created_at: {type:Date, required: true},
    created_at_str: {type:String, required: true},
    last_modified: {type:Date, required: false},
    last_modified_str: {type:String, required: false},
    html: {type:String, default:""},
    css: {type:String, default:""},
    js: {type:String, default:""},
    public: {type:Boolean, default:false},
    shared: {type:Boolean, default: false},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    father: {type: String, default:"root"},
    carpet: {type: Boolean, default: false}
});

export const Project = mongoose.model<IProject>("Project", ProjectSchema);