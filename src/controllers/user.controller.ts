import { Controller, Get, Param, Post, Put, Req, Res } from "@nestjs/common";
import {Response, Request} from "express";
import UserService from "src/services/user.service";

@Controller()

export class USerController{
    constructor(private readonly userService: UserService){}
    @Post('login')
    fnLogin(@Req() req:Request, @Res() res:Response): Promise<any>{
        return new Promise<any>((resolve) => {
            resolve(this.userService.login(req, res))
        });
    };
    @Get('login/:id')
    verifyTk(@Param() params:any, @Res() res:Response):Promise<any>{
        return new Promise<any>((resolve)=>{
            resolve(this.userService.verifytk(params.id, res));
        })
    };

    @Post('register')
    register(@Req() req:Request, @Res() res:Response):Promise<void>{
        return new Promise<void>((resolve)=>{
            resolve(this.userService.addUser(req, res))
        })
    };

    @Put('users')
    updateUser(@Req() req:Request, @Res() res:Response):Promise<void>{
        return new Promise<void>((resolve)=>{
            resolve(this.userService.updateUser(req, res))
        })
    };

    @Get('users')
    findUser(@Req() req:Request, @Res() res:Response):Promise<any>{
        return new Promise<any>((resolve)=>{
            resolve(this.userService.findUser(req, res));
        });
    };

    @Get('users/:id')
    getUserById(@Req() req:Request, @Res() res:Response):Promise<any>{
        return new Promise<any>((resolve)=>{
            resolve(this.userService.getUserById(req, res));
        });
    };
 
    @Post('follow/users')
    followUser(@Req() req:Request, @Res() res:Response):Promise<any>{
        return new Promise<any>((resolve)=>{
            resolve(this.userService.followUser(req, res))
        });
    };

    @Put('follow/users')
    unfollowUser(@Req() req:Request, @Res() res:Response):Promise<any>{
        return new Promise<any>((resolve)=>{
            resolve(this.userService.unfollowUser(req, res))
        });
    };

    @Get('follow/users')
    getfollowedUsers(@Req() req:Request, @Res() res:Response):Promise<any>{
        return new Promise<any>((resolve)=>{
            resolve(this.userService.getFollowedUsers(req, res))
        });
    };

}; 