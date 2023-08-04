import { Controller, Get, Param, Post, Req, Res } from "@nestjs/common";
import {Response, Request} from "express";
import ProjectService from "src/services/project.service";

@Controller(['project'])

export class ProjectController{
    constructor(private readonly projectService: ProjectService){}
    @Post()
    fnLogin(@Req() req:Request, @Res() res:Response): Promise<any>{
        return new Promise<any>((resolve) => {
            resolve(this.projectService.newProject(req, res))
        });
    };
    @Get()
    verifyTk(@Req() req:Request, @Res() res:Response):Promise<any>{
        return new Promise<any>((resolve)=>{
            resolve(this.projectService.getProjectsByUser(req, res));
        })
    }
};