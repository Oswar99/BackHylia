import { Request, Response } from "express";
import * as moment from "moment";
import mongoose from "mongoose";
import { checkShare } from "src/helpers/users.helper";
import { IProject, Project } from "src/models/project.model";
import { IShare, Share } from "src/models/shared-list.model";

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
            const type = req.query.type;
            const pub = (type === "PUBLIC")? true: false;
            const filter = {
               "$and": [
                    { user: req.body.user._id },
                    type? {public: pub}: {}
                ]
            }
            const projects: IProject[] = await Project.find(filter, { html: 0, js: 0, css: 0, user: 0, created_at: 0, last_modified: 0 });
            res.status(200).json({ successed: true, projects: projects })
        } catch (error) {
            res.status(200).json({ successed: false, message: "Internal Server Error" })
        }
    }

    public async getProjectById(req: Request, res: Response) {
        try {
            const project: IProject = await Project.findOne({ "$or":[{user: req.body.user._id}, {public:true}], _id: req.params.id.replace("\n", "") });
            res.status(200).json({ successed: project? true:false, project: project, editable: project.user._id.toString() === req.body.user._id.toString() });
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

    public async shareWith(req:Request, res:Response){
        try {
            const body = req.body;
            const filter = {
                project: body.project,
                shared_with: body.id
            };
            const check: boolean = await checkShare(filter);
            if(!check){
                const newShare: IShare = new Share(filter);
                Project.findByIdAndUpdate(body.project, {shared: true});
                newShare.save().then(()=>{
                    res.status(200).json({successed:true, message: "El proyecto ha sido compartido!"});
                });
            }else{
                res.status(200).json({successed:false, message: "Ya se ha compartido el proyecto con este usuario!"})
            };
        } catch (error) {
            res.status(200).json({successed:false, message:"Ha ocurrido un error!"})
        }
    }
 
};

export default ProjectService;
