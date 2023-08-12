import { Controller, Get, Param, Post, Req, Res } from "@nestjs/common";
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
};