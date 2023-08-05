import { Request, Response } from "express";
import * as moment from "moment";
import mongoose from "mongoose";
import { IProject, Project } from "src/models/project.model";

class ProjectService {

    public async newProject(req: Request, res: Response) {
        const project: IProject = new Project({
            ...req.body,
            title: req.body.title.toUpperCase(),
            created_at: new Date(),
            created_at_str: moment().format("DD-MM-yyyy LTS"),
            last_modified: new Date(),
            last_modified_str: moment().format("DD-MM-yyyy LTS")
        });
        project.save().then(() => {
            res.status(200).json({ successed: true })
        }).catch(() => {
            res.status(200).json({ successed: false })
        })
    };

    public async getProjectsByUser(req: Request, res: Response) {
        try {
            const projects: IProject[] = await Project.find({ user: req.body.user._id }, { html: 0, js: 0, css: 0, user: 0, created_at: 0, last_modified: 0 });
            res.status(200).json({ successed: true, projects: projects })
        } catch (error) {
            res.status(200).json({ successed: false, message: "Internal Server Error" })
        }
    }

    public async getProjectById(req: Request, res: Response) {
        try {
            const project: IProject = await Project.findOne({ user: req.body.user._id, _id: req.params.id.replace("\n", "") }, { user: 0 });
            res.status(200).json({ successed: true, project: project });
        } catch (error) {
            res.status(200).json({ successed: false })
        }
    };

    public async updateProjectById(req: Request, res: Response) {
        try {
            await Project.findOneAndUpdate({ user: req.body.user._id, _id: req.params.id.replace("\n", "") },
                {
                    ...req.body,
                    title: req.body.title.toUpperCase(),
                    last_modified: new Date(),
                    last_modified_str: moment().format("DD-MM-yyyy LTS")
                }, { user: 0 }).then(() => {
                    res.status(200).json({ successed: true });
                }).catch(() => {
                    res.status(200).json({ successed: false })
                });
        } catch (error) {
            res.status(200).json({ successed: false })
        }
    };

};

export default ProjectService;
