import mongoose from "mongoose";

export interface IUser extends mongoose.Document{
    name: string,
    email: string,
    phoneNumber: string,
    pass: string,
    type: string,
    enabled: boolean,
    img: string,
    joinTime: Date,
    lastSession: Date,
};

const UserSchema = new mongoose.Schema({
    name: {type:String, required: true},
    email: {type:String, required: true, unique: true},
    phoneNumber: {type:String, required: false},
    pass: {type:String, required: true},
    type: {type:String, required: false},
    img: {type:String, required: false},
    enabled: {type: Boolean, default: true},
    joinTime: {type:Date, default: new Date()},
    lastSession: {type:Date, default: new Date()},
});

export const User = mongoose.model<IUser>("User", UserSchema);