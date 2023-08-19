import { Controller, Get, Param, Post, Put, Delete, Req, Res } from "@nestjs/common";
import {Response, Request} from "express";
import ProjectService from "src/services/project.service";

@Controller()

export class ProjectController{
    constructor(private readonly projectService: ProjectService){}
    @Post("project")
    fnLogin(@Req() req:Request, @Res() res:Response): Promise<any>{
        return new Promise<any>((resolve) => {
            resolve(this.projectService.newProject(req, res))
        });
    };
    @Get(['project'])
    projectByUser(@Req() req:Request, @Res() res:Response):Promise<any>{
        return new Promise<any>((resolve)=>{
            resolve(this.projectService.getProjectsByUser(req, res));
        })
    }

    @Get(['v2/project'])
    projectByFather(@Req() req:Request, @Res() res:Response):Promise<any>{
        return new Promise<any>((resolve)=>{
            resolve(this.projectService.getProjectsByFather(req, res));
        })
    };

    @Get(['project/:id'])
    getProjectByID(@Req() req:Request, @Res() res:Response):Promise<any>{
        return new Promise<any>((resolve)=>{
            resolve(this.projectService.getProjectById(req, res));
        })
    }
    @Put(['project/:id'])
    updateProjectById(@Req() req:Request, @Res() res:Response):Promise<any>{
        return new Promise<any>((resolve)=>{
            resolve(this.projectService.updateProjectById(req, res));
        })
    };
    @Post("share")
    shareWith(@Req() req:Request, @Res() res:Response){
        return this.projectService.shareWith(req, res);
    };

    @Get("share")
    getShares(@Req() req:Request, @Res() res:Response){
        return this.projectService.getShares(req, res);
    }; 

    @Get("v2/share")
    getSharesByUser(@Req() req:Request, @Res() res:Response){
        return this.projectService.getShareByUser(req, res);
    };

    @Delete("share")
    deleteShare(@Req() req:Request, @Res() res:Response){
        return this.projectService.deleteShare(req, res);
    };
};