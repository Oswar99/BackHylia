import { Request, Response } from "express";
import * as moment from "moment";
import { IProject, Project } from "src/models/project.model";

class ProjectService {

    public async newProject(req: Request, res: Response) {
        const project: IProject = new Project({
            ...req.body,
            title: req.body.title.toUpperCase(),
            created_at: new Date(),
            created_at_str: moment().format("DD-MM-yyyy")
        });
        project.save().then(() => {
            res.status(200).json({ successed: true })
        }).catch(() => {
            res.status(200).json({ successed: false })
        })
    };

    public async getProjectsByUser(req: Request, res: Response) {
        try {
            const projects = await Project.find({user: req.body.user._id}, {html:0, js:0, css:0, user:0});
            res.status(200).json({successed:true, projects: projects})
        } catch (error) {
            res.status(200).json({successed:false, message:"Internal Server Error"})
        }
    }
};

export default ProjectService;
