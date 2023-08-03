import { Controller, Get, Param, Post, Req, Res } from "@nestjs/common";
import {Response, Request} from "express";
import UserService from "src/services/user.service";

@Controller(['login','login/:id'])

export class USerController{
    constructor(private readonly userService: UserService){}
    @Post()
    fnLogin(@Req() req:Request, @Res() res:Response): Promise<any>{
        return new Promise<any>((resolve) => {
            resolve(this.userService.login(req, res))
        });
    };
    @Get()
    verifyTk(@Param() params:any, @Res() res:Response):Promise<any>{
        return new Promise<any>((resolve)=>{
            resolve(this.userService.verifytk(params.id, res));
        })
    }
};