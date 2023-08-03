import TokenHelper from "../helpers/token.helper";
import { User } from "../models/user.model";
import {Request, Response} from "express";

class UserService extends TokenHelper{
    public async login(req: Request,res:Response){
        const body:any = req.body;
        const user =  await User.findOne({email: body.email, pass: body.pass, enabled: 1}, {_id:1, email:1, type:1, name: 1})
        if(user){
            const utk = await super.generateToken(user);
            res.status(200).json({token: utk, user: user})
        }else{
            res.status(200).json({token: null, user:null})
        };
    };

    public async verifytk(id:string, res:Response){
        const r = await super.verifyToken(id)
        res.status(200).json(r);
    }
};

export default UserService;
