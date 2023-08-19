import { Controller, Get, Post, Req, Res} from "@nestjs/common";
import {Response, Request} from "express";
import { FileService } from "src/services/files.service";

@Controller()

export class FilesController{
    constructor(private readonly fservice: FileService){}

    @Post("files")
    postImg(@Req() req:Request, @Res() res:Response): Promise<any>{
        return new Promise<any>((resolve) => {
            resolve(this.fservice.postImage(req, res))
        });
    };

    @Get(['img/:id'])
    getIng(@Req() req:Request, @Res() res:Response):Promise<any>{
        return new Promise<any>((resolve)=>{
            resolve(this.fservice.getImage(req, res));
        });
    };
};