import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface IToken extends mongoose.Document{
    user: IUser,
    start: Date,
    end: Date,
    enabled: boolean
};

const TokenSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    start: {type: Date, default: new Date()},
    end: {type: Date, required: false},
    enabled: {type:Boolean, default:true}
});

export const Token = mongoose.model<IToken>("Token", TokenSchema);