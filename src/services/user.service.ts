import { Follow, IFollow } from "src/models/follow.model";
import TokenHelper from "../helpers/token.helper";
import { IUser, User } from "../models/user.model";
import {Request, Response} from "express";
import { encodeResp } from "src/helpers/helpers";

class UserService extends TokenHelper{
    public async login(req: Request,res:Response){
        const body:any = req.body;
        const user =  await User.findOne({
            "$or": [{email: body.email}, {nickname:body.email}],
            pass: encodeResp(body.pass),
            enabled: 1
        }, {_id:1, email:1, type:1, name: 1, img:1, nickname: 1, enabled: 1})
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
    };

    public async addUser(req:Request, res:Response){
        const data = req.body;
        const newuser:IUser = new User({
            ...data,
            joinTime: new Date(),
            lastSession: new Date(),
            pass: encodeResp(data.pass)
        });
        newuser.save().then(()=>{
            res.status(200).json({successed:true, message: "Se ha registrado correctamente!"})
        });
    };

    //{nickname:{ "$regex": params.search? params.search: "", "$options": "i" }},
    public async findUser(req:Request, res:Response){
        const params = req.query;
        const users:IUser = await User.findOne({"$or":[
            {nickname: params.search},
            {email: params.search}
        ]});
        res.status(200).json({successed:true, users: users});
    };

    public async followUser(req:Request, res:Response){
        const id: string = req.body.id;
        const newfollow: IFollow = new Follow({
            user: req.body.user._id,
            followed: id,
            created_at: new Date(),
        });
        newfollow.save().then(()=>{
            res.status(200).json({successed:true, message: "Se agrego a su lista de seguidos"})
        });
    };

};

export default UserService;
