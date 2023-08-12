import mongoose from "mongoose";

export interface IUser extends mongoose.Document{
    name: string,
    lastname: string,
    nickname: string,
    email: string,
    phoneNumber: string,
    pass: string,
    type: "ADMIN" | "ESTANDAR",
    enabled: boolean,
    img: string,
    joinTime: Date,
    lastSession: Date,
};

const UserSchema = new mongoose.Schema({
    name: {type:String, required: true},
    lastname: {type:String, required: true},
    nickname: {type:String, required: false, unique:true},
    email: {type:String, required: true, unique: true},
    phoneNumber: {type:String, required: false},
    pass: {type:String, required: true},
    type: {type:String, required: false, default:"ESTANDAR"},
    img: {type:String, required: false, default:"https://bootdey.com/img/Content/avatar/avatar7.png"},
    enabled: {type: Boolean, default: true},
    joinTime: {type:Date, default: new Date()},
    lastSession: {type:Date, default: new Date()},
});

export const User = mongoose.model<IUser>("User", UserSchema);