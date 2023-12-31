import * as moment from "moment";
import { IToken, Token } from "../models/token.model";
import { IUser, User } from "../models/user.model";
import { decodeResp, encodeResp } from "./helpers";

class TokenHelper{
    public verifyToken(tk: string): Promise<any>{
        return new Promise<any>(async (resolve)=>{
            try {
                const dtoken = await decodeResp(tk);
                const user: IUser|any = await User.findById(dtoken.user,{_id:1, email:1, type:1, name: 1, img:1, nickname: 1, enabled: 1, lastname:1, joinTime:1, lastSession:1});
                const end = new Date(dtoken.end).getTime();
                const now = new Date().getTime();
    
                if(user!.enabled && now < end){
                    await User.findByIdAndUpdate(dtoken.user, {lastSession: new Date()})
                    const us:any = {
                        ...user._doc,
                        joinTime: moment(user.joinTime).format("LLL"), 
                        lastSession: moment(user.lastSession).format("LLL")
                    };
                    resolve({status: true, user: us})
                }else{
                    resolve({status: false, message:"El token no es valido!"})
                };
            } catch (error:any) {
                resolve({status: false, message: error.message})
            }
        })
    };

    public generateToken(user:IUser): Promise<string|null>{
        return new Promise<string|null>((resolve)=>{
            try {
                const tk: IToken = new Token({
                    user: user._id,
                    start: new Date(),
                    end: moment().add(4, "hours")
                });
                tk.save().then(()=>{
                    const entk: string = encodeResp(tk);
                    resolve(entk)
                }).catch((reason:any)=>{
                    console.log(reason.message);
                    resolve(null);
                });
            } catch (error) {
                console.log(error.message)
            }
        });
    };
};

export default TokenHelper;