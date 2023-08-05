import { Controller, Get, Param, Post, Put, Req, Res } from "@nestjs/common";
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
    verifyTk(@Req() req:Request, @Res() res:Response):Promise<any>{
        return new Promise<any>((resolve)=>{
            resolve(this.projectService.getProjectsByUser(req, res));
        })
    }
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
    }
};