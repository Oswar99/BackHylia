import { Follow, IFollow } from "src/models/follow.model";
import TokenHelper from "../helpers/token.helper";
import { IUser, User } from "../models/user.model";
import {Request, Response} from "express";
import { encodeResp } from "src/helpers/helpers";
import { IProject, Project } from "src/models/project.model";

class UserService extends TokenHelper{
    public async login(req: Request,res:Response){
        const body:any = req.body;
        const user =  await User.findOne({
            "$or": [{email: body.email}, {nickname:body.email}],
            pass: encodeResp(body.pass),
            enabled: 1
        }, {_id:1, email:1, type:1, name: 1, img:1, nickname: 1, enabled: 1, lastname:1, joinTime:1, lastSession:1})
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
            name: data.name.toUpperCase(),
            lastname: data.lastname.toUpperCase(),
            joinTime: new Date(),
            lastSession: new Date(),
            pass: encodeResp(data.pass)
        });
        newuser.save().then(()=>{
            res.status(200).json({successed:true, message: "Se ha registrado correctamente!"})
        });
    };

    //{nickname:{ },
    public async findUser(req:Request, res:Response){
        const params = req.query;
        const users:IUser[] = await User.find({
            _id: {"$ne": req.body.user._id},
            "$or":[
                {nickname: {"$regex": params.search? params.search: "", "$options": "i" }},
                {email: params.search}
            ],
            enabled: true,
            }, {_id:1, name: 1, lastname: 1, email: 1, nickname:1, img: 1});
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

    public async unfollowUser(req:Request, res:Response){
        const id: string = req.body.id;
        Follow.findOneAndDelete({user: req.body.user._id, followed:id}).then(()=>{
            res.status(200).json({successed:true})
        });
    };


    public async getFollowedUsers(req:Request, res:Response){
        try {
            const followed = await Follow.aggregate([
                
                {
                    "$lookup":{
                        from: "users",
                        localField:"followed",
                        foreignField:"_id",
                        as:"users"
                    }
                },
                {"$match":{user:req.body.user._id}},
                {
                    "$project":{
                    _id:1,
                    user: 1,
                    users:{
                        _id:1,
                        name: 1,
                        lastname: 1,
                        nickname: 1,
                        img: 1
                    }
                }}
            ]);
            res.status(200).json({successed:true, list: followed})
        } catch (error) {
            res.status(200).json({successed:false, message:error.message})
        }
    }

    public async getUserById(req:Request, res:Response){
        const id: string = req.params.id;
        const followdata:IFollow[] = await Follow.find({followed:id, user: req.body.user._id});
        const projects: IProject[] = await Project.find({user:id, public:true});
        const user:IUser = await User.findOne({_id: id, enabled:true}, {enabled:0, pass:0});
        res.status(200).json({successed:true, user: user, followed: followdata.length > 0, projects: projects});
    }

};

export default UserService;
